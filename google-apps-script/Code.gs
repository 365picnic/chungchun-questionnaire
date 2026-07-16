/**
 * 청춘한의원 사전문진 - 구글 시트 저장용 Apps Script
 *
 * 사용법 (구글 시트 화면에서):
 * 1. 새 구글 시트를 만든다.
 * 2. 상단 메뉴 확장 프로그램 > Apps Script 클릭.
 * 3. 기본으로 열려있는 코드를 모두 지우고, 이 파일 내용을 그대로 붙여넣는다.
 * 4. 저장(디스크 아이콘) 후, 우측 상단 "배포" > "새 배포" 클릭.
 * 5. 유형 선택에서 "웹 앱" 선택.
 *    - 실행할 사용자: 나(본인 계정)
 *    - 액세스 권한이 있는 사용자: 모든 사용자
 * 6. "배포" 클릭 → 권한 승인(계정 선택 후 "고급" > "안전하지 않음으로 이동" 등 안내에 따라 허용).
 * 7. 배포 완료 후 나오는 "웹 앱 URL"을 복사한다.
 * 8. 그 URL을 docs/index.html 안의 GAS_URL 값에 붙여넣는다.
 *
 * ※ 이미 배포되어 있는 상태에서 이 코드 내용을 바꿨다면 (예: handleUpdate_ 추가),
 *    새로 배포하지 말고 우측 상단 "배포 > 배포 관리"에서 연필(수정) 아이콘을 눌러
 *    기존 배포에 "새 버전"으로 반영해야 웹 앱 URL이 그대로 유지됩니다.
 */

var SHEET_NAME = '문진응답';

// 관리 페이지(admin.html)에서 답변 목록을 조회할 때 쓰는 비밀번호 역할의 값.
// 필요하면 원하는 문자열로 바꾸고 "새 버전으로 배포"를 다시 하면 됩니다.
var ADMIN_KEY = 'GbHXZumIjIYRZUiWLSQ4';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // 관리자페이지에서 원장님이 문진 답변을 직접 고쳐서 저장할 때 (신규 접수가 아니라 기존 행 수정)
  if (data.action === 'update') {
    return handleUpdate_(data);
  }

  var sheet = getOrCreateSheet_();

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.birth_date || '',
    data.height || '',
    data.weight || '',
    data.gender || '',
    data.summary || '',
    data.symptoms || '',
    data.raw || '',
    '' // 원장 메모(JSON) - 접수 시점에는 비어있고, 진료 중 관리자페이지에서 채워집니다.
  ]);

  // 문진 요약처럼 줄바꿈이 많은 칸 때문에 행이 세로로 길게 늘어나지 않도록 설정
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 11).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.setRowHeight(lastRow, 21);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 관리자페이지(admin.html)에서 "저장" 버튼을 눌렀을 때 실행되는 부분.
// 원장님만 접근 가능하도록 ADMIN_KEY 를 반드시 확인한 뒤, 요청에 실제로 담겨 온
// 항목만 해당 환자의 행 번호(rowNum)에 덮어씁니다. (문진 답변 수정 / 주증상·메모 저장 공용)
function handleUpdate_(data) {
  if (!data.key || data.key !== ADMIN_KEY) {
    return jsonOutput_({ status: 'error', message: 'invalid key' });
  }
  var rowNum = parseInt(data.rowNum, 10);
  var sheet = getOrCreateSheet_();
  if (!rowNum || rowNum < 2 || rowNum > sheet.getLastRow()) {
    return jsonOutput_({ status: 'error', message: 'invalid rowNum' });
  }
  if (data.summary !== undefined) sheet.getRange(rowNum, 8).setValue(data.summary || '');  // 문진 요약
  if (data.raw !== undefined) sheet.getRange(rowNum, 10).setValue(data.raw || '');         // 원본데이터(JSON)
  if (data.notes !== undefined) sheet.getRange(rowNum, 11).setValue(data.notes || '');     // 원장 메모(JSON)
  return jsonOutput_({ status: 'ok' });
}

function doGet(e) {
  var key = e.parameter.key;
  if (!key || key !== ADMIN_KEY) {
    return ContentService
      .createTextOutput('청춘한의원 문진 접수 서버가 정상 동작 중입니다.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return jsonOutput_([]);
  }
  var values = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
  var records = values.map(function (row, i) {
    return {
      rowNum: i + 2,
      submittedAt: row[0] ? new Date(row[0]).toISOString() : '',
      name: row[1],
      phone: row[2],
      birthDate: row[3],
      height: row[4],
      weight: row[5],
      gender: row[6],
      summary: row[7],
      symptoms: row[8],
      raw: row[9],
      doctorNotes: row[10]
    };
  }).reverse(); // 최신 제출 건이 먼저 오도록

  return jsonOutput_(records);
}

// 이미 쌓인 응답들 때문에 행이 세로로 길어져 있다면, Apps Script 편집기에서
// 이 함수를 한 번 선택해서 "실행" 버튼으로 직접 실행하면 한 번에 정리됩니다.
function fixExistingRowHeights() {
  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return;
  sheet.getRange(1, 1, lastRow, 11).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  for (var r = 1; r <= lastRow; r++) {
    sheet.setRowHeight(r, 21);
  }
}

// 이 코드를 처음 붙여넣기 전부터 시트에 응답이 쌓여 있었다면, K열(원장 메모) 헤더가
// 없을 수 있습니다. Apps Script 편집기에서 이 함수를 한 번 "실행"하면 헤더만 추가됩니다.
function addDoctorNotesColumnIfMissing() {
  var sheet = getOrCreateSheet_();
  var header = sheet.getRange(1, 11).getValue();
  if (!header) {
    sheet.getRange(1, 11).setValue('원장 메모(JSON)').setFontWeight('bold');
  }
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '제출일시', '이름', '전화번호', '생년월일', '키(cm)', '몸무게(kg)', '성별',
      '문진 요약', '증상(직접입력)', '원본데이터(JSON, 백업용)', '원장 메모(JSON)'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
  }
  return sheet;
}
