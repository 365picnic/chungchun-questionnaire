// 청춘한의원 다이어트 문진 - 문항 정의 (diet.html, admin.html 다이어트 탭 공용)
// 이름/연락처/생년월일/주소/희망개월수/키·몸무게·감량목표는 문진 앞부분(정보입력 단계)에서
// 따로 받기 때문에 이 배열에는 포함하지 않습니다. (한약 문진의 questions.js와 같은 구조)
//
// cond: 이 문항을 보여줄지 결정하는 함수. 인자로 현재 답변 객체(ans)를 받습니다.
//       성별은 전역 selectedGender(diet.html / admin.html 양쪽에 존재)를 참조합니다.

const DIET_Q = [
{id:"job", cat:"직업", title:"직업이 어떻게 되시나요?", type:"single",
 opts:["주부","사무직","전문직","영업직","사업","교대근무","취업준비생","학생","기타"]},

{id:"purpose", cat:"다이어트 목적", title:"다이어트 목적이 어떻게 되시나요?", type:"single",
 opts:["건강증진","행사","결혼식","자존감 향상","산후비만","요요","자기만족","옷","기타"]},

// ===== 안전 확인 (임신·수유·과거력·복용약물) =====
{id:"preg_lactation", cat:"과거력", title:"임신 / 수유 / 임신 가능성에 해당하는 것을 모두 체크해주세요.", type:"multi",
 hint:"다이어트 한약은 임신 중이거나 수유 중에는 처방하지 않습니다. 안전 확인용으로 여쭤봅니다.",
 opts:[
   "임신 중",
   "수유 중 또는 출산 6개월 이내",
   "가임기이며 현재 피임하지 않음",
   "해당 없음"
 ],
 cond:function(){ return selectedGender === "여자"; }},

{id:"past_conditions", cat:"과거력", title:"진단받았거나 앓았던 적이 있는 질환을 모두 체크해주세요.", type:"multi",
 opts:[
   "고혈압",
   "심장질환 또는 부정맥",
   "갑상선질환",
   "당뇨",
   "뇌혈관질환",
   "녹내장",
   "간질환(지방간·간염 등)",
   "콩팥(신장)질환",
   "위장질환(위염·역류성식도염 등)",
   "우울증·공황장애 등 정신과 질환",
   "해당 없음"
 ]},

{id:"current_meds", cat:"복용약물", title:"현재 복용 중인 약을 모두 체크해주세요.", type:"multi",
 opts:[
   "다른 다이어트약 또는 식욕억제제",
   "항우울제·신경안정제·수면제",
   "갑상선약",
   "혈압약",
   "당뇨약",
   "두통약·진통제를 자주 복용",
   "피임약·호르몬제",
   "해당 없음"
 ]},

{id:"medical_history", cat:"복용약물", title:"위에서 체크한 약 이름 / 질환명 / 진단 시기를 자세히 적어주세요.", type:"text",
 hint:"예: 갑상선기능저하증(2019년~현재 신지로이드 복용), 지방간(작년 건강검진), 우울증(OO정신과 약물 복용) 등"},

{id:"herbal_adverse", cat:"복용약물", title:"예전에 한약이나 다이어트 보조제를 먹고 불편했던 경험이 있나요?", type:"single",
 opts:[
   "경험 없음",
   "소화장애·메스꺼움·설사",
   "두드러기·발진 등 알레르기 반응",
   "가슴 두근거림·불면",
   "기타 (위 병력란에 적어주세요)"
 ]},

// ===== 다이어트 이력 =====
{id:"tried_before", cat:"이전 시도", title:"다이어트는 어떻게 해보셨나요?", type:"text",
 hint:"양약, 한약, 운동, 식이요법 등 기간, 효과, 감량정도, 요요까지 히스토리를 자세히 적어주시면 좀 더 상세한 진료와 처방이 가능합니다."},

{id:"recent_weight_change", cat:"체중 변화", title:"최근 6개월간 체중 변화가 있었나요?", type:"single",
 opts:[
   "큰 변화 없음",
   "5kg 이상 늘었다",
   "5kg 이상 빠졌다",
   "늘었다 빠졌다를 반복한다(요요)"
 ]},

{id:"weight_loss_tendency", cat:"감량 경향", title:"다이어트할 때 체중이 잘 빠지는 편인가요?", type:"single",
 opts:["잘 빠지는 편","잘 안 빠지는 편","다이어트를 해본 적이 없다"]},

// ===== 생활습관 =====
{id:"diet_checklist", cat:"체크리스트", title:"다음에 해당되는 것을 체크해주세요.", type:"multi",
 opts:[
   "식욕억제가 안된다.",
   "스트레스가 너무 많고 먹는 걸로 푼다.",
   "커피 마시면 불편하다 (잠을 못자다, 심장이 두근거린다, 손이 떨린다, 속이 쓰린다)",
   "불면으로 고생중이다.",
   "우울감을 자주 느낀다.",
   "소화가 잘 안 된다.",
   "몸이 너무 붓는다.",
   "변비가 심하다.",
   "피로감이 심하다.",
   "음주가 잦다.",
   "외식, 회식을 자주 한다.",
   "한식위주의 식사는 적은데 과일이나 음료, 빵이나 과자, 분식류 등으로 식사를 대신하는 경우가 많다.",
   "저녁식사 후 야식이 주3회 이상이다.",
   "운동이 부족하다."
 ]},

{id:"meal_pattern", cat:"식사 패턴", title:"하루 식사를 어떻게 하시나요?", type:"multi",
 opts:["아침","아점","점심","저녁","야식"]},

// ===== 생활 리듬 (저녁 복약·수면 시간 안내를 위해) =====
{id:"wake_time", cat:"생활 리듬", title:"평소 몇 시에 일어나세요?", type:"single",
 opts:["6시 이전","6~8시","8~10시","10시 이후","교대근무 등 불규칙"]},

{id:"sleep_time", cat:"생활 리듬", title:"평소 몇 시에 잠자리에 드세요?", type:"single",
 opts:["21시 이전","21~23시","23~1시","1시 이후","불규칙"]},

{id:"dinner_time", cat:"생활 리듬", title:"저녁 식사는 보통 몇 시에 하세요?", type:"single",
 hint:"체감환은 식사 30분~1시간 전에 드시므로, 저녁 복약·수면 시간을 함께 안내하기 위해 여쭤봅니다.",
 opts:["18시 이전","18~20시","20~22시","22시 이후","거의 안 먹는다"]},

// ===== 수면 =====
{id:"sleep_onset", cat:"수면", title:"잠자리에 누우면 잠드는 데 보통 얼마나 걸리세요?", type:"single",
 opts:["10분 이내","10~30분","30분~1시간","1시간 이상"]},

{id:"sleep_aid", cat:"수면", title:"수면제나 수면유도제를 복용하세요?", type:"single",
 opts:["복용하지 않는다","가끔 복용한다","매일 복용한다"]},

// ===== 수분·카페인 =====
{id:"caffeine_intake", cat:"수분·카페인", title:"커피·홍차·에너지음료 등 카페인 음료를 하루 몇 잔 드세요?", type:"single",
 opts:["거의 안 마신다","하루 1잔","하루 2잔","하루 3잔 이상"]},

{id:"water_intake", cat:"수분·카페인", title:"순수한 물(생수)을 하루 어느 정도 드세요?", type:"single",
 opts:["1잔 이하","2~4잔","5~7잔","8잔 이상"]},

// ===== 배변 =====
{id:"bowel_freq", cat:"배변", title:"평소 대변은 얼마나 자주 보세요?", type:"single",
 hint:"식사량이 줄면 없던 변비가 생길 수 있어, 평소 상태를 확인합니다.",
 opts:["하루 1회 이상","2일에 1회","3~4일에 1회","주 1회 이하"]},

// ===== 기호 (흡연·음주) =====
{id:"smoking", cat:"흡연", title:"담배를 피우시나요?", type:"single",
 opts:["비흡연","과거에 피웠고 현재 금연","하루 반 갑 이하","하루 반 갑~1갑","하루 1갑 이상"]},

{id:"alcohol_freq", cat:"음주", title:"술을 얼마나 자주 드세요?", type:"single",
 opts:["거의 안 마신다","주 1회 이하","주 2~3회","주 4회 이상"]},

{id:"alcohol_type", cat:"음주", title:"주로 어떤 술을 드세요?", type:"single",
 opts:["소주","맥주","막걸리","와인","양주·하이볼","여러 가지 섞어 마심"],
 cond:function(ans){ return ans.alcohol_freq && ans.alcohol_freq !== "거의 안 마신다"; }},

{id:"alcohol_amount", cat:"음주", title:"한 번 마실 때 어느 정도 드세요? (주종과 무관하게, 아래는 대략적인 환산입니다)", type:"single",
 opts:[
   "소주 반 병 이하 (맥주 1~2캔 / 와인 2잔)",
   "소주 1병 정도 (맥주 3~4캔 / 와인 1병)",
   "소주 1~2병 (맥주 5~8캔)",
   "소주 2병 이상 (맥주 9캔 이상)"
 ],
 cond:function(ans){ return ans.alcohol_freq && ans.alcohol_freq !== "거의 안 마신다"; }},

{id:"liver_check", cat:"음주", title:"최근 건강검진에서 간수치 이상이나 지방간 소견을 들은 적이 있나요?", type:"single",
 opts:["없다","지방간 소견을 들었다","간수치가 높다고 들었다","검진을 안 받아 모른다"]},

// ===== 마무리 =====
{id:"obstacle", cat:"방해 요인", title:"본인이 생각하기에 다이어트에 가장 방해되는 것은 무엇인가요?", type:"text"},

{id:"referral", cat:"내원 경로", title:"청춘한의원을 어떻게 아셨나요?", type:"text",
 hint:"소개로 아셨다면 소개자 성함을 적어주세요."}
];

// 한약 문진의 visibleQ()와 대응. 조건부(cond) 문항을 걸러 실제로 보여줄 문항만 돌려줍니다.
// ans를 넘기지 않으면 전역 answers(diet.html의 다이어트 답변)를 사용합니다.
// admin.html처럼 전역 answers가 다른 용도(한약 답변)로 쓰이는 곳에서는 반드시 dietAnswers를 넘겨야 합니다.
function visibleDietQ(ans) {
  var a = ans || (typeof answers !== 'undefined' ? answers : {});
  return DIET_Q.filter(function(q){ return !q.cond || q.cond(a); });
}

// 답변을 사람이 읽기 쉬운 텍스트로 정리 (구글시트 "문진 요약" 칸에 저장되는 내용)
function buildDietSummary(answers) {
  const lines = [];
  visibleDietQ(answers).forEach(q => {
    const val = answers[q.id];
    if (val === undefined || val === '') return;
    const valText = Array.isArray(val) ? val.join(', ') : val;
    lines.push(`[${q.cat}] ${q.title}: ${valText}`);
  });
  return lines.join('\n');
}
