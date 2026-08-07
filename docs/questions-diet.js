// 청춘한의원 다이어트 문진 - 문항 정의 (diet.html, admin.html 다이어트 탭 공용)
// 이름/연락처/생년월일/주소/희망개월수/키·몸무게·감량목표는 문진 앞부분(정보입력 단계)에서
// 따로 받기 때문에 이 배열에는 포함하지 않습니다. (한약 문진의 questions.js와 같은 구조)

const DIET_Q = [
{id:"job", cat:"직업", title:"직업이 어떻게 되시나요?", type:"single",
 opts:["주부","사무직","영업직","사업","교대근무","취업준비생","학생","기타"]},

{id:"purpose", cat:"다이어트 목적", title:"다이어트 목적이 어떻게 되시나요?", type:"single",
 opts:["건강증진","행사","결혼식","자존감 향상","산후비만","요요","자기만족","옷","기타"]},

{id:"tried_before", cat:"이전 시도", title:"다이어트는 어떻게 해보셨나요?", type:"text",
 hint:"양약, 한약, 운동, 식이요법 등 기간, 효과, 감량정도, 요요까지 히스토리를 자세히 적어주시면 좀 더 상세한 진료와 처방이 가능합니다."},

{id:"medical_history", cat:"복용약물/병력", title:"현재 복용중인 약물 / 과거에 앓았던 질환이 있다면 적어주세요.", type:"text",
 hint:"예: 우울증, 불면증, 식도염, 간·신장·심장 질환 등"},

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

{id:"weight_loss_tendency", cat:"감량 경향", title:"다이어트할 때 체중이 잘 빠지는 편인가요?", type:"single",
 opts:["예","아니오"]},

{id:"meal_pattern", cat:"식사 패턴", title:"하루 식사를 어떻게 하시나요?", type:"multi",
 opts:["아침","아점","점심","저녁","야식"]},

{id:"obstacle", cat:"방해 요인", title:"본인이 생각하기에 다이어트에 가장 방해되는 것은 무엇인가요?", type:"text"},

{id:"referral", cat:"내원 경로", title:"청춘한의원을 어떻게 아셨나요?", type:"text",
 hint:"소개로 아셨다면 소개자 성함을 적어주세요."}
];

// 한약 문진의 visibleQ()와 대응. 다이어트 문진은 조건부(cond) 문항이 없어 그대로 반환합니다.
function visibleDietQ() { return DIET_Q; }

// 답변을 사람이 읽기 쉬운 텍스트로 정리 (구글시트 "문진 요약" 칸에 저장되는 내용)
function buildDietSummary(answers) {
  const lines = [];
  DIET_Q.forEach(q => {
    const val = answers[q.id];
    if (val === undefined || val === '') return;
    const valText = Array.isArray(val) ? val.join(', ') : val;
    lines.push(`[${q.cat}] ${q.title}: ${valText}`);
  });
  return lines.join('\n');
}
