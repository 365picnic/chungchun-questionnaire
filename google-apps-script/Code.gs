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
 *
 * ※ AI 처방 추천 기능을 쓰려면 아래 두 가지가 추가로 필요합니다.
 *    1. 이 프로젝트에 google-apps-script/PrescriptionKnowledge.gs 파일도 똑같이
 *       추가해야 합니다 (Apps Script 편집기 좌측 파일 목록 옆 "+" > 스크립트 > 이름을
 *       PrescriptionKnowledge로 저장 후 내용 붙여넣기).
 *    2. 편집기 좌측 톱니바퀴(프로젝트 설정) > "스크립트 속성" > 속성 추가에서
 *       이름: GEMINI_API_KEY, 값: 원장님의 Gemini API 키(aistudio.google.com에서
 *       구글 계정으로 직접 발급, 보통 무료로 시작 가능)를 등록해야 합니다.
 *       코드에는 절대 키를 직접 적지 않습니다.
 */

var SHEET_NAME = '문진응답';
var SHEET_NAME_DIET = '다이어트문진응답';

// 관리 페이지(admin.html)에서 답변 목록을 조회할 때 쓰는 비밀번호 역할의 값.
// 필요하면 원하는 문자열로 바꾸고 "새 버전으로 배포"를 다시 하면 됩니다.
var ADMIN_KEY = '3133';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // 관리자페이지에서 원장님이 문진 답변을 직접 고쳐서 저장할 때 (신규 접수가 아니라 기존 행 수정)
  if (data.action === 'update') {
    return handleUpdate_(data);
  }
  // 관리자페이지의 "AI 처방 분석 실행" 버튼
  if (data.action === 'ai_recommend') {
    return handleAiRecommend_(data);
  }
  // 관리자페이지에서 문진 기록을 완전히 삭제할 때 (테스트 접수, 중복 등)
  if (data.action === 'delete') {
    return handleDelete_(data);
  }
  // 관리자페이지 달력에서 "문진 없는 환자"에게 처방 기록을 남길 때 - 이름/전화번호만으로
  // 새 줄을 만들고, 그 자리에 바로 처방 기록을 달 수 있도록 줄 번호(rowNum)를 돌려줍니다.
  if (data.action === 'quick_add') {
    return handleQuickAdd_(data);
  }
  // 관리자페이지 다이어트문진 탭의 "AI 다이어트 분석" 버튼
  if (data.action === 'diet_ai_analyze') {
    return handleDietAiAnalyze_(data);
  }
  // 다이어트 문진(diet.html)에서 접수된 신규 제출 - 별도 시트에 저장
  if (data.formType === 'diet') {
    return handleDietSubmit_(data);
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
    '', // 원장 메모(JSON) - 접수 시점에는 비어있고, 진료 중 관리자페이지에서 채워집니다.
    ''  // AI 추천 결과(JSON) - AI 처방 분석을 실행하면 채워집니다.
  ]);

  // 문진 요약처럼 줄바꿈이 많은 칸 때문에 행이 세로로 길게 늘어나지 않도록 설정
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 12).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.setRowHeight(lastRow, 21);

  // 전화번호가 "01012345678"처럼 숫자로만 되어 있으면 구글시트가 자동으로 숫자로 인식해서
  // 맨 앞 0을 지워버리므로, 전화번호 칸은 텍스트 서식으로 바꾼 뒤 값을 다시 정확히 넣어줍니다.
  sheet.getRange(lastRow, 3).setNumberFormat('@').setValue(data.phone || '');
  // 생년월일도 "1969-01-07"처럼 날짜로 보이는 문자열이라 구글시트가 자동으로 실제 날짜값으로
  // 바꿔버리는데, 이러면 시간대 계산 때문에 하루가 밀려 보이는 문제가 생깁니다. 텍스트로 고정합니다.
  sheet.getRange(lastRow, 4).setNumberFormat('@').setValue(data.birth_date || '');

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 다이어트 문진(diet.html)의 신규 제출을 별도 시트("다이어트문진응답")에 저장합니다.
// 한약 문진과 열 구성이 달라(주소/희망개월수/감량목표 등) 별도 함수로 분리했습니다.
function handleDietSubmit_(data) {
  var sheet = getOrCreateDietSheet_();

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.birth_date || '',
    data.gender || '',
    data.height || '',
    data.weight || '',
    data.goal || '',
    data.plan || '',
    data.address || '',
    data.summary || '',
    data.raw || '',
    '' // 원장 메모(JSON) - 접수 시점에는 비어있고, 진료 중 관리자페이지에서 채워집니다.
  ]);

  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 13).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.setRowHeight(lastRow, 21);

  // 전화번호/생년월일이 숫자·날짜로 자동 변환되어 앞자리 0이 사라지거나 하루 밀리는 문제를
  // 막기 위해 텍스트 서식으로 고정합니다. (한약 문진 doPost와 동일한 이유)
  sheet.getRange(lastRow, 3).setNumberFormat('@').setValue(data.phone || '');
  sheet.getRange(lastRow, 4).setNumberFormat('@').setValue(data.birth_date || '');

  return jsonOutput_({ status: 'ok' });
}

// 관리자페이지 다이어트문진 탭의 "AI 다이어트 분석" 버튼 — 환자의 신상(나이·성별·키·몸무게·감량목표)과
// 문진 답변, 원장 상담메모를 Gemini에 보내 현재 상태 / 문제점 / 관리 방향을 정리받습니다.
// 이름·전화번호·주소는 보내지 않습니다(admin.html의 buildDietPatientDataForAi가 애초에 넣지 않음).
// 결과는 진단이 아니라 원장님 상담을 돕는 참고자료이며, 해당 환자 줄의 "AI 분석 결과(JSON)" 칸(N열)에
// 저장해서 나중에 다시 열어도 그대로 보이게 합니다.
function handleDietAiAnalyze_(data) {
  if (!data.key || data.key !== ADMIN_KEY) {
    return jsonOutput_({ status: 'error', message: 'invalid key' });
  }
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    return jsonOutput_({ status: 'error', message: 'API 키가 설정되지 않았습니다. Apps Script 편집기 좌측 톱니바퀴(프로젝트 설정) > 스크립트 속성에 GEMINI_API_KEY를 추가해주세요.' });
  }

  var systemPrompt =
    '당신은 한의원 다이어트 클리닉 원장의 상담 준비를 돕는 보조 도구입니다. 아래 환자의 신상·체형 정보와 ' +
    '다이어트 문진 답변, 원장 상담메모를 분석해서 원장이 상담 전에 빠르게 파악할 수 있도록 정리하세요. ' +
    '진단이나 처방을 확정하는 것이 아니라 참고자료이며, 최종 판단은 반드시 원장이 직접 합니다.\n' +
    '- current_status: BMI 구간(대한비만학회 기준: 18.5 미만 저체중, 23 미만 정상, 25 미만 비만전단계, ' +
    '30 미만 1단계 비만, 35 미만 2단계 비만, 그 이상 3단계 비만)을 포함해 현재 상태를 3~4문장으로 요약.\n' +
    '  ※ "첫 처방 개월수"와 "최종 감량 희망"은 서로 묶인 목표가 아닙니다. 첫 처방 개월수는 우선 그만큼 진행해보기로 ' +
    '한 기간이고, 감량 희망은 최종적으로 빼고 싶은 무게이며, 다이어트 기간은 경과에 따라 얼마든지 연장할 수 있습니다. ' +
    '따라서 "N개월 안에 Nkg은 어렵다/비현실적이다"처럼 두 값을 묶어 평가하지 말고, 필요하면 최종 목표까지 기간 연장을 ' +
    '염두에 둔 단계적 접근으로 설명하세요.\n' +
    '- problems: 체중이 늘었거나 잘 안 빠지는 원인으로 보이는 문제점(식습관·수면·스트레스·음주·수분·배변 등). ' +
    '각 문제마다 문진 답변 중 어떤 근거에서 그렇게 판단했는지 evidence에 적으세요. 중요한 순서대로 3~6개.\n' +
    '- solutions: 문제점별 생활 관리·상담 방향(환자에게 어떻게 설명하고 무엇을 실천시킬지). 3~6개.\n' +
    '- safety_checks: 임신·수유, 심장·갑상선·간·콩팥 질환, 정신과 약·수면제·식욕억제제 복용, 이전 한약·보조제 부작용, ' +
    '카페인 민감, 불면 등 다이어트 한약 처방 전에 원장이 반드시 확인할 안전 관련 사항. 없으면 빈 배열.\n' +
    '- questions_to_ask: 판단이 애매하거나 정보가 부족해서 상담 때 추가로 물어보면 좋은 질문과 그 이유. 1~4개.\n' +
    '문진 답변에 근거한 내용만 쓰고, 답이 없는 부분은 추측하지 말고 questions_to_ask로 돌리세요. ' +
    '몇 kg이 빠질지 숫자로 단정하지 마세요. 간결한 한국어로 쓰세요.\n' +
    '반드시 아래 JSON 형식으로만 응답하고, 코드블록 표시(```) 없이 순수 JSON 텍스트만 출력하세요.\n' +
    '{"current_status":"...",' +
    '"problems":[{"title":"문제점(짧게)","evidence":"문진 근거","detail":"왜 문제인지 1~2문장"}],' +
    '"solutions":[{"title":"관리 방향(짧게)","detail":"구체적인 방법 1~2문장"}],' +
    '"safety_checks":["확인할 사항"],' +
    '"questions_to_ask":[{"question":"질문","reason":"이유"}]}';

  var result = callGeminiJson_(apiKey, systemPrompt, '환자 정보:\n' + (data.patientData || ''));
  if (result.error) {
    return jsonOutput_({ status: 'error', message: result.error });
  }

  var rowNum = parseInt(data.rowNum, 10);
  if (rowNum) {
    var sheet = getOrCreateDietSheet_();
    ensureDietAiColumn_(sheet);
    if (rowNum >= 2 && rowNum <= sheet.getLastRow()) {
      sheet.getRange(rowNum, 14).setValue(JSON.stringify(result.json));
    }
  }
  return jsonOutput_({ status: 'ok', result: result.json });
}

// Gemini에 요청을 보내 JSON 응답을 받아옵니다. 성공하면 {json: ...}, 실패하면 {error: '이유'}를 돌려줍니다.
// (handleAiRecommend_와 같은 모델·재시도 방식을 사용합니다.)
function callGeminiJson_(apiKey, systemPrompt, userText) {
  var payload = {
    contents: [{ role: 'user', parts: [{ text: userText }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      maxOutputTokens: 8000,
      thinkingConfig: { thinkingLevel: 'low' }
    }
  };
  var model = 'gemini-3.6-flash';
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(apiKey);

  var res, code, bodyText;
  for (var attempt = 1; attempt <= 3; attempt++) {
    try {
      res = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
    } catch (err) {
      return { error: 'Gemini API 호출 실패: ' + err.message };
    }
    code = res.getResponseCode();
    bodyText = res.getContentText();
    if (code !== 503 && code !== 429) break;
    if (attempt < 3) Utilities.sleep(1500 * attempt);
  }
  if (code !== 200) {
    return { error: 'Gemini API 오류(' + code + ')' };
  }

  var text = '';
  try {
    var parsed = JSON.parse(bodyText);
    text = parsed.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
    var jsonStart = text.indexOf('{');
    var jsonEnd = text.lastIndexOf('}');
    var cleaned = (jsonStart >= 0 && jsonEnd > jsonStart) ? text.slice(jsonStart, jsonEnd + 1) : text.trim();
    return { json: JSON.parse(cleaned) };
  } catch (e) {
    return { error: 'AI 응답을 해석하지 못했습니다.' };
  }
}

// 다이어트문진응답 시트에 N열(AI 분석 결과) 헤더가 없으면 추가합니다.
function ensureDietAiColumn_(sheet) {
  if (!sheet.getRange(1, 14).getValue()) {
    sheet.getRange(1, 14).setValue('AI 분석 결과(JSON)').setFontWeight('bold');
  }
}

// 관리자페이지(admin.html)에서 "저장" 버튼을 눌렀을 때 실행되는 부분.
// 원장님만 접근 가능하도록 ADMIN_KEY 를 반드시 확인한 뒤, 요청에 실제로 담겨 온
// 항목만 해당 환자의 행 번호(rowNum)에 덮어씁니다. (문진 답변 수정 / 주증상·메모 저장 공용)
// data.formType이 'diet'면 다이어트문진응답 시트를, 아니면(기본값) 한약 문진 시트를 사용합니다.
function handleUpdate_(data) {
  if (!data.key || data.key !== ADMIN_KEY) {
    return jsonOutput_({ status: 'error', message: 'invalid key' });
  }
  var rowNum = parseInt(data.rowNum, 10);
  var isDiet = data.formType === 'diet';
  var sheet = isDiet ? getOrCreateDietSheet_() : getOrCreateSheet_();
  if (!rowNum || rowNum < 2 || rowNum > sheet.getLastRow()) {
    return jsonOutput_({ status: 'error', message: 'invalid rowNum' });
  }
  if (isDiet) {
    if (data.summary !== undefined) sheet.getRange(rowNum, 11).setValue(data.summary || '');  // 문진 요약
    if (data.raw !== undefined) sheet.getRange(rowNum, 12).setValue(data.raw || '');           // 원본데이터(JSON)
    if (data.notes !== undefined) sheet.getRange(rowNum, 13).setValue(data.notes || '');       // 원장 메모(JSON)
    if (data.height !== undefined) sheet.getRange(rowNum, 6).setValue(data.height === '' ? '' : Number(data.height));
    if (data.weight !== undefined) sheet.getRange(rowNum, 7).setValue(data.weight === '' ? '' : Number(data.weight));
    if (data.goal !== undefined) sheet.getRange(rowNum, 8).setValue(data.goal === '' ? '' : Number(data.goal));
    return jsonOutput_({ status: 'ok' });
  }
  if (data.summary !== undefined) sheet.getRange(rowNum, 8).setValue(data.summary || '');  // 문진 요약
  if (data.raw !== undefined) sheet.getRange(rowNum, 10).setValue(data.raw || '');         // 원본데이터(JSON)
  if (data.notes !== undefined) sheet.getRange(rowNum, 11).setValue(data.notes || '');     // 원장 메모(JSON)
  // 키/몸무게 - 환자가 문진에 잘못(또는 속여) 적은 값을 원장님이 실측치로 고칠 수 있게 함
  if (data.height !== undefined) sheet.getRange(rowNum, 5).setValue(data.height === '' ? '' : Number(data.height));
  if (data.weight !== undefined) sheet.getRange(rowNum, 6).setValue(data.weight === '' ? '' : Number(data.weight));
  return jsonOutput_({ status: 'ok' });
}

// 관리자페이지에서 문진 기록 하나를 완전히 삭제합니다 (되돌릴 수 없음).
// 원장님만 접근 가능하도록 ADMIN_KEY를 반드시 확인합니다.
function handleDelete_(data) {
  if (!data.key || data.key !== ADMIN_KEY) {
    return jsonOutput_({ status: 'error', message: 'invalid key' });
  }
  var rowNum = parseInt(data.rowNum, 10);
  var sheet = data.formType === 'diet' ? getOrCreateDietSheet_() : getOrCreateSheet_();
  if (!rowNum || rowNum < 2 || rowNum > sheet.getLastRow()) {
    return jsonOutput_({ status: 'error', message: 'invalid rowNum' });
  }
  sheet.deleteRow(rowNum);
  return jsonOutput_({ status: 'ok' });
}

// 관리자페이지 달력에서 문진표를 작성하지 않은 환자(내원만 했거나 예전부터 다니던 환자 등)에게도
// 처방 기록을 남길 수 있도록, 이름/전화번호만으로 새 줄을 하나 만듭니다. 문진 답변(요약/원본/키/
// 몸무게 등)은 전부 비워두고, 나중에 그 환자가 실제로 문진표를 작성해도 이 줄과는 자동으로
// 합쳐지지 않습니다(중복되면 관리자페이지의 삭제 기능으로 정리해주세요).
// 새로 만들어진 줄 번호(rowNum)를 돌려줘야 하므로, 관리자페이지에서는 이 요청만 응답을 읽습니다.
function handleQuickAdd_(data) {
  if (!data.key || data.key !== ADMIN_KEY) {
    return jsonOutput_({ status: 'error', message: 'invalid key' });
  }
  var name = data.name || '';
  if (!name) {
    return jsonOutput_({ status: 'error', message: 'name required' });
  }
  var phone = data.phone || '';
  var isDiet = data.formType === 'diet';
  var sheet = isDiet ? getOrCreateDietSheet_() : getOrCreateSheet_();
  if (isDiet) {
    sheet.appendRow([new Date(), name, phone, '', '', '', '', '', '', '', '', '', '']);
  } else {
    sheet.appendRow([new Date(), name, phone, '', '', '', '', '', '', '', '', '']);
  }
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 3).setNumberFormat('@').setValue(phone);
  return jsonOutput_({ status: 'ok', rowNum: lastRow });
}

// 관리자페이지의 "AI 처방 분석 실행" 버튼 — Gemini API를 호출해 문진/형색성정/안진 데이터를
// PrescriptionKnowledge.gs의 임상 지식베이스와 대조시켜 후보 처방을 추천받습니다.
// API 키는 절대 admin.html(클라이언트, 누구나 볼 수 있는 코드)에 두지 않고, 이 Apps Script
// 프로젝트의 "스크립트 속성"에만 저장합니다 (편집기 좌측 톱니바퀴 > 스크립트 속성).
// 이 함수가 내리는 결과는 진단이 아니라 원장님의 검토를 돕는 참고자료일 뿐입니다.
// 결과는 rowNum이 함께 오면 해당 환자 행의 "AI 추천 결과(JSON)" 칸에도 저장해서,
// 나중에 그 환자를 다시 열었을 때도 그대로 보이게 합니다.
function handleAiRecommend_(data) {
  if (!data.key || data.key !== ADMIN_KEY) {
    return jsonOutput_({ status: 'error', message: 'invalid key' });
  }
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    return jsonOutput_({ status: 'error', message: 'API 키가 설정되지 않았습니다. Apps Script 편집기 좌측 톱니바퀴(프로젝트 설정) > 스크립트 속성에 GEMINI_API_KEY를 추가해주세요.' });
  }

  var patientInfo = data.patientData || '';
  var systemPrompt = PRESCRIPTION_KNOWLEDGE + '\n\n' +
    '당신은 위 상한금궤방 임상 지식베이스를 참고해 한의사(원장)의 처방 결정을 돕는 보조 도구입니다. ' +
    '진단이나 처방을 확정하는 것이 아니라, 후보를 추려 원장이 빠르게 검토할 수 있도록 돕는 역할입니다. ' +
    '최종 처방 결정은 반드시 원장이 직접 합니다. ' +
    '아래 환자 정보에는 [주증상(CC)]와 [환자가 직접 적은 증상]처럼 환자 본인이 직접 표현한 주소증도 ' +
    '포함되어 있습니다. 이는 문진 체크박스 응답 못지않게, 오히려 그보다 우선해서 반영해야 할 핵심 ' +
    '단서입니다 — 환자가 스스로 가장 불편하다고 꼽은 내용을 무시하고 형색성정·안진 소견만으로 판단하지 ' +
    '마세요. ' +
    '아래 환자의 문진 답변/형색성정/안진 소견을 위 지식베이스와 대조해서, 가능성이 높은 처방 후보를 3~5개 ' +
    '적합도(fit_percent, 0~100 정수)와 함께 순위대로 제시하고, 판단이 애매하거나 후보를 좁히는 데 ' +
    '결정적일 추가 확인 질문도 제안하세요. 추가 확인 질문마다, 그 질문이 왜 필요한지(어떤 후보들을 ' +
    '가르는 데 도움이 되는지) 한 줄로 이유도 함께 적으세요. 근거 없이 추측하지 말고, 정보가 부족하면 ' +
    'fit_percent를 보수적으로 낮게 매기세요. ' +
    '반드시 아래 JSON 형식으로만 응답하고, 다른 설명이나 코드블록 표시(```) 없이 순수 JSON 텍스트만 ' +
    '출력하세요.\n\n' +
    '{"candidates":[{"name":"처방명","fit_percent":82,"matched":["일치하는 근거"],"missing":["불확실하거나 부족한 근거"],"note":"한 줄 설명"}],' +
    '"additional_questions":[{"question":"환자에게 추가로 확인하면 좋을 질문","reason":"이 질문이 왜 필요한지, 어떤 후보를 가르는 데 도움이 되는지"}]}';

  var payload = {
    contents: [
      { role: 'user', parts: [{ text: '환자 정보(문진 답변 / 형색성정 / 안진 / 주증상):\n' + patientInfo }] }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      // gemini-3.6-flash는 기본적으로 내부 "생각(thinking)" 토큰을 사용하는데, 이 토큰도
      // maxOutputTokens 예산에서 함께 차감된다. 3000 정도로는 생각 토큰만으로 예산이 다 소진되어
      // 정작 JSON 출력이 중간에 잘리는 문제가 있었다(따옴표/중괄호가 안 닫힌 채로 끊김).
      // thinkingLevel을 낮춰 생각 토큰 소비를 줄이고, maxOutputTokens도 넉넉히 늘려서 대비한다.
      maxOutputTokens: 8000,
      thinkingConfig: {
        thinkingLevel: 'low'
      }
    }
  };

  var model = 'gemini-3.6-flash';
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(apiKey);

  // Gemini 쪽이 일시적으로 혼잡할 때(503 UNAVAILABLE) 바로 실패시키지 않고,
  // 잠깐 대기 후 최대 3회까지 재시도합니다. 429(요청 과다)도 같은 방식으로 재시도합니다.
  var res, code, bodyText;
  var maxAttempts = 3;
  for (var attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      res = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
    } catch (err) {
      return jsonOutput_({ status: 'error', message: 'Gemini API 호출 실패: ' + err.message });
    }

    code = res.getResponseCode();
    bodyText = res.getContentText();

    if (code !== 503 && code !== 429) break;
    if (attempt < maxAttempts) {
      Utilities.sleep(1500 * attempt); // 1.5초, 3초로 점점 늘려가며 대기
    }
  }

  if (code !== 200) {
    var retryNote = (code === 503 || code === 429) ? ' (여러 번 재시도했지만 계속 실패했습니다. 잠시 후 다시 시도해주세요.)' : '';
    return jsonOutput_({ status: 'error', message: 'Gemini API 오류(' + code + '): ' + bodyText.slice(0, 300) + retryNote });
  }

  var parsed;
  try {
    parsed = JSON.parse(bodyText);
  } catch (e) {
    return jsonOutput_({ status: 'error', message: 'API 응답을 해석하지 못했습니다.' });
  }

  var text = '';
  var finishReason = '';
  if (parsed.candidates && parsed.candidates.length && parsed.candidates[0].content && parsed.candidates[0].content.parts) {
    text = parsed.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
    finishReason = parsed.candidates[0].finishReason || '';
  }

  // Gemini가 지시대로 순수 JSON만 주면 좋겠지만, 앞뒤에 설명이나 ```json 코드블록을 덧붙이는
  // 경우에도 안전하게 파싱되도록 첫 "{"부터 마지막 "}"까지만 잘라내서 시도합니다.
  var resultJson;
  try {
    var jsonStart = text.indexOf('{');
    var jsonEnd = text.lastIndexOf('}');
    var cleaned = (jsonStart >= 0 && jsonEnd > jsonStart) ? text.slice(jsonStart, jsonEnd + 1) : text.trim();
    resultJson = JSON.parse(cleaned);
  } catch (e) {
    // 응답이 도중에 잘렸을 때(finishReason === 'MAX_TOKENS')는 원인을 명확히 알려줍니다.
    var msg = finishReason === 'MAX_TOKENS'
      ? 'AI 응답이 글자 수 제한(maxOutputTokens)에 걸려 중간에 잘렸습니다. 다시 시도해보시고, ' +
        '계속 반복되면 Code.gs의 maxOutputTokens 값을 늘려야 합니다.'
      : 'AI 응답을 해석하지 못했습니다.';
    return jsonOutput_({ status: 'error', message: msg, raw: text.slice(0, 800) });
  }

  var rowNum = parseInt(data.rowNum, 10);
  if (rowNum) {
    var sheet = getOrCreateSheet_();
    if (rowNum >= 2 && rowNum <= sheet.getLastRow()) {
      sheet.getRange(rowNum, 12).setValue(JSON.stringify(resultJson));
    }
  }

  return jsonOutput_({ status: 'ok', result: resultJson });
}

function doGet(e) {
  var key = e.parameter.key;
  if (!key || key !== ADMIN_KEY) {
    return ContentService
      .createTextOutput('청춘한의원 문진 접수 서버가 정상 동작 중입니다.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  if (e.parameter.type === 'diet') {
    return doGetDiet_();
  }

  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return jsonOutput_([]);
  }
  var values = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
  var records = values.map(function (row, i) {
    return {
      rowNum: i + 2,
      submittedAt: row[0] ? new Date(row[0]).toISOString() : '',
      name: row[1],
      phone: row[2],
      birthDate: formatDateCell_(row[3]),
      height: row[4],
      weight: row[5],
      gender: row[6],
      summary: row[7],
      symptoms: row[8],
      raw: row[9],
      doctorNotes: row[10],
      aiResult: row[11]
    };
  }).reverse(); // 최신 제출 건이 먼저 오도록

  return jsonOutput_(records);
}

// 관리자페이지의 "다이어트문진" 탭에서 목록을 불러올 때 사용합니다 (doGet에서 type=diet일 때 호출).
function doGetDiet_() {
  var sheet = getOrCreateDietSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return jsonOutput_([]);
  }
  var values = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
  var records = values.map(function (row, i) {
    return {
      rowNum: i + 2,
      submittedAt: row[0] ? new Date(row[0]).toISOString() : '',
      name: row[1],
      phone: row[2],
      birthDate: formatDateCell_(row[3]),
      gender: row[4],
      height: row[5],
      weight: row[6],
      goal: row[7],
      plan: row[8],
      address: row[9],
      summary: row[10],
      raw: row[11],
      doctorNotes: row[12],
      aiResult: row[13]
    };
  }).reverse();
  return jsonOutput_(records);
}

// AI 처방 추천 기능을 처음 켤 때, 이 함수를 한 번 선택해서 "실행" 버튼을 누르면
// "외부 서비스(Gemini API) 연결" 권한을 승인하는 창이 뜹니다. 승인만 하면 되고,
// 그 이후로는 이 함수를 다시 실행할 필요가 없습니다 (지워도 됩니다).
function authorizeExternalRequest() {
  var res = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/', { muteHttpExceptions: true });
  Logger.log('권한 확인 완료. 응답 코드: ' + res.getResponseCode());
}

// 이미 쌓인 응답들 때문에 행이 세로로 길어져 있다면, Apps Script 편집기에서
// 이 함수를 한 번 선택해서 "실행" 버튼으로 직접 실행하면 한 번에 정리됩니다.
function fixExistingRowHeights() {
  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return;
  sheet.getRange(1, 1, lastRow, 12).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
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

// 예전에 접수되어 생년월일이 이미 구글시트의 "진짜 날짜" 값으로 저장된 행들을 위한 안전장치.
// 그런 셀은 Apps Script에서 읽으면 Date 객체로 오고, 그대로 내보내면 JSON 변환 과정에서
// 시간대가 섞여 "1969-01-06T15:00:00.000Z"처럼 하루 밀린 문자열로 보이게 됩니다.
// 스프레드시트 자체의 시간대 기준으로 날짜만 다시 뽑아 "1969-01-07" 형태로 돌려줍니다.
function formatDateCell_(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return v;
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
      '문진 요약', '증상(직접입력)', '원본데이터(JSON, 백업용)', '원장 메모(JSON)', 'AI 추천 결과(JSON)'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
  }
  return sheet;
}

// 다이어트 문진(diet.html) 응답을 저장하는 시트. 한약 문진과 열 구성이 달라 별도 시트를 씁니다.
function getOrCreateDietSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_DIET);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_DIET);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '제출일시', '이름', '전화번호', '생년월일', '성별', '키(cm)', '몸무게(kg)', '감량목표(kg)',
      '희망개월수', '주소', '문진 요약', '원본데이터(JSON, 백업용)', '원장 메모(JSON)'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 13).setFontWeight('bold');
  }
  return sheet;
}

// 이 코드를 처음 붙여넣기 전부터 시트에 응답이 쌓여 있었다면, L열(AI 추천 결과) 헤더가
// 없을 수 있습니다. Apps Script 편집기에서 이 함수를 한 번 "실행"하면 헤더만 추가됩니다.
function addAiResultColumnIfMissing() {
  var sheet = getOrCreateSheet_();
  var header = sheet.getRange(1, 12).getValue();
  if (!header) {
    sheet.getRange(1, 12).setValue('AI 추천 결과(JSON)').setFontWeight('bold');
  }
}
