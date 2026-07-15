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
 */

var SHEET_NAME = '문진응답';

function doPost(e) {
  var sheet = getOrCreateSheet_();
  var data = JSON.parse(e.postData.contents);

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
    data.raw || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput('청춘한의원 문진 접수 서버가 정상 동작 중입니다.')
    .setMimeType(ContentService.MimeType.TEXT);
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
      '문진 요약', '증상(직접입력)', '원본데이터(JSON, 백업용)'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }
  return sheet;
}
