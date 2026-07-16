// 청춘한의원 사전문진 - 문항 정의 (환자용 문진표 index.html, 관리자페이지 admin.html 공용)
// 이 파일 하나만 고치면 문진표와 관리자페이지 양쪽에 그대로 반영됩니다.

const Q = [
{id:"sleep_main",cat:"잠",title:"잠을",type:"single",
 opts:["잘 자는 편","못 자는 편"],
 sub:{"못 자는 편":[
   {id:"sleep_severity",title:"어느 정도 못 주무시나요?",type:"single",opts:["매우 못자는 편","어느 정도","약간"]},
   {id:"sleep_wake",title:"",type:"multi",opts:["잠은 드는데 자다가 자주 깬다"]}
 ]}},

{id:"sleep_important",cat:"잠",title:"내일 중요한 일 있으면?",type:"single",
 opts:["1~2시간 이상 한참 뒤척이다 겨우 자곤 한다","그래도 30분 전후로 잠드는 편이다"],
 sub:{"1~2시간 이상 한참 뒤척이다 겨우 자곤 한다":[
   {id:"sleep_imp_freq",title:"10번이면",type:"single",opts:["10~7번 정도","5번 전후","3~1번 정도 그럴 때가 있다"]},
   {id:"sleep_imp_extra",title:"",type:"multi",opts:["거의 못 자기도 한다","자다가 자주 깬다"]}
 ],"그래도 30분 전후로 잠드는 편이다":[
   {id:"sleep_ok_extra",title:"",type:"multi",opts:["자려고 마음 먹으면 잔다","살면서 잠이 안와서 힘든 적은 많지 않다"]}
 ]}},

{id:"sleep_coffee",cat:"잠",title:"커피 마시면?",type:"single",
 opts:["그래도 잘 자는 편","못 자는 편"]},

{id:"sleep_coffee_heart",cat:"잠",title:"커피를 마시면 가슴이 두근거리거나 손이 떨릴 때가 있다.",type:"single",
 opts:["예","아니오"]},

{id:"chest_palp",cat:"흉부",title:"가슴이 자주 두근거린다.",type:"single",
 opts:["예","아니오"],
 sub:{"예":[
   {id:"chest_palp_freq",title:"가슴 두근거림 빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]}
 ]}},

{id:"chest_tight",cat:"흉부",title:"(마음이 답답한게 아니라) 가슴이 막힌 듯 답답하다.",type:"single",
 opts:["예","아니오"],
 sub:{"예":[
   {id:"chest_tight_freq",title:"가슴 답답함 빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]},
   {id:"chest_tight_extra",title:"가슴이 답답하면?",type:"multi",opts:["잠이 더 안온다","한숨을 자주 쉰다","숨이 깊이 마셔지지 않는 느낌"]}
 ]}},

{id:"chest_compare",cat:"흉부",title:"가슴 두근거림, 답답함 어느 것이 더 심한가요?",type:"single",
 opts:["가슴 두근거림이 더 심","가슴 답답함이 더 심","비슷하다"],
 cond:function(){return answers["chest_palp"]==="예"&&answers["chest_tight"]==="예"}},

{id:"chest_pain",cat:"흉부",title:"가슴이 뻐근하게 아플 때가 많다.",type:"single",
 opts:["예","아니오"]},

{id:"stool_main",cat:"대변",title:"평소 대변은?",type:"single",
 opts:["거의 매일 정상변을 보는 편","변비 경향","설사~무른변 경향"],
 sub:{"변비 경향":[
   {id:"stool_const_sev",title:"변비 정도는?",type:"single",opts:["심한 편","어느 정도","약간"]},
   {id:"stool_const_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["대변 제때 못보면 가스가 많이 차서 더부룩 답답하다","설사를 해서라도 다 쏟아내면 너무 시원하고 좋겠다","대변이 굵고 단단해서 보기 힘들 때가 많다"]}
 ],"설사~무른변 경향":[
   {id:"stool_diarr_freq",title:"빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]},
   {id:"stool_diarr_cause",title:"어떨 때 설사~무른 변을 보나요?",type:"multi",opts:["찬 음식 먹으면","맵거나 자극적인 음식","기름기 많은 음식","술 많이 마시면","어떤 음식을 먹더라도 설사~무른변을 자주 보는 편"]}
 ]}},

{id:"stool_gas",cat:"대변",title:"평소 배에 가스가 많이 차서 헛배가 자주 부르나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"stool_gas_freq",title:"빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]}
 ]}},

{id:"digest_main",cat:"소화",title:"평소 소화가?",type:"single",
 opts:["잘 되는 편","보통","잘 안되는 편"],
 sub:{"잘 안되는 편":[
   {id:"digest_sev",title:"어느 정도?",type:"single",opts:["매우 안되는 편","어느 정도"]},
   {id:"digest_cause",title:"어떨 때 소화가 안되나요?",type:"multi",opts:["내 기준에 정해진 양 이상 과식하면","신경쓰면 소화가 자주 안된다"]}
 ]}},

{id:"digest_symptom",cat:"소화",title:"소화가 안되면?",type:"multi",
 opts:["명치(위장)에서 음식이 내려가지 않는 듯 답답하다","가슴이나 목에서 음식이 내려가지 않는 듯 답답하다","소화가 안되면 식욕도 더 떨어지곤 한다","소화가 안 되더라도 식욕은 여전히 좋은 편이다"],
 cond:function(){return answers["digest_main"]==="잘 안되는 편"}},

{id:"appetite",cat:"소화",title:"평소 식욕이?",type:"single",
 opts:["매우 없는 편","없는 편","보통","좋은 편","매우 좋은 편"],
 sub:{"매우 좋은 편":[
   {id:"appetite_extra",title:"",type:"multi",opts:["배고픈 것을 못 참는다"]}
 ]}},

{id:"cold_heat_main",cat:"추위/더위",title:"평소 추위와 더위는?",type:"multi",
 opts:["추위를 타지 않는 편","몸이 차서 추위를 타는 편","열이 많아 더위를 타는 편"],
 sub:{"몸이 차서 추위를 타는 편":[
   {id:"cold_sev",title:"추위를 타는 정도는?",type:"single",opts:["매우 많이","많이","어느 정도","약간"]},
   {id:"cold_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["날씨가 조금만 추워도 옷을 두텁게 입는다","몸을 차게하면 몸살기가 올 때가 많다","여름에도 바닥에 불을 올리고 잘 때가 많다","몸의 일부가 얼음장처럼 차고 시리다","몸의 일부가 남의 살처럼 감각이 둔하다"]}
 ],"열이 많아 더위를 타는 편":[
   {id:"heat_sev",title:"더위를 타는 정도는?",type:"single",opts:["매우 많이","많이","어느 정도","약간"]}
 ]}},

{id:"hand_temp",cat:"추위/더위",title:"손이?",type:"single",
 opts:["찬 편이다","보통이다","열이 나고 화끈거릴 때가 많다"],
 sub:{"찬 편이다":[
   {id:"hand_cold_sev",title:"어느 정도?",type:"single",opts:["매우 많이","많이","어느 정도"]}
 ],"열이 나고 화끈거릴 때가 많다":[
   {id:"hand_hot_freq",title:"빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]}
 ]}},

{id:"foot_temp",cat:"추위/더위",title:"발이?",type:"single",
 opts:["찬 편이다","보통이다","열이 나고 화끈거릴 때가 많다"],
 sub:{"찬 편이다":[
   {id:"foot_cold_sev",title:"어느 정도?",type:"single",opts:["매우 많이","많이","어느 정도"]}
 ],"열이 나고 화끈거릴 때가 많다":[
   {id:"foot_hot_freq",title:"빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]}
 ]}},

{id:"lower_belly",cat:"추위/더위",title:"아랫배가 (만져서 찬 정도가 아니라) 찬 느낌이 들 때가 많나요?",type:"single",
 opts:["매우 많이 차다","많이","어느 정도","아니다"],
 sub:{"매우 많이 차다":[
   {id:"belly_warm",title:"",type:"multi",opts:["아랫배를 따듯하게 지질 때가 많다"]}
 ],"많이":[
   {id:"belly_warm2",title:"",type:"multi",opts:["아랫배를 따듯하게 지질 때가 많다"]}
 ]}},

{id:"face_heat",cat:"추위/더위",title:"얼굴이나 상체로 열이 자주 달아 오르나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"face_heat_when",title:"어떨 때?",type:"multi",opts:["흥분 긴장 스트레스 시","더우면","갱년기라서"]}
 ]}},

{id:"sweat_main",cat:"땀",title:"평소 땀이?",type:"single",
 opts:["아주 많은 편","많은 편","보통","적은 편","거의 안나는 편"],
 sub:{"아주 많은 편":[
   {id:"sweat_area",title:"땀이 많은 부위는?",type:"multi",opts:["손","발","상체","전신"]}
 ],"많은 편":[
   {id:"sweat_area2",title:"땀이 많은 부위는?",type:"multi",opts:["손","발","상체","전신"]}
 ]}},

{id:"sauna",cat:"땀",title:"목욕탕 사우나에서 땀 빼고 나면?",type:"single",
 opts:["몸이 가볍고 개운한 편","몸이 무겁고 지치는 편","해당없음"]},

{id:"edema",cat:"부종",title:"평소 잘 붓는 편인가요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"edema_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["오래 섰거나 걸으면 다리가 붓는다","양말 자국이 난다"]}
 ]}},

{id:"dizzy",cat:"현훈",title:"앉았다 일어나면 어지러울 때가 많나요?",type:"single",
 opts:["그렇다","아니다"]},

{id:"urine_freq",cat:"소변",title:"하루 소변보는 횟수가?",type:"single",
 opts:["자주 보는 편","보통","적게 보는 편"]},

{id:"urine_night",cat:"소변",title:"밤에 자다가 소변을 보나요?",type:"single",
 opts:["3~4번 이상","1~2번","가끔 1번 볼 때가 있다","아니다"]},

{id:"urine_residual",cat:"소변",title:"소변보고 나서 덜 본 듯 잔뇨감이 있나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"urine_res_freq",title:"10번이면?",type:"single",opts:["10~7번 정도","5번 전후","3번 이하"]}
 ]}},

{id:"water_main",cat:"음수",title:"평소 물+음료수 마시는 양이?",type:"single",
 opts:["많은 편","보통","적은 편"],
 sub:{"많은 편":[
   {id:"water_reason",title:"물을 많이 마시는 이유는?",type:"multi",opts:["입이 마르고 갈증이 나서","습관적으로 많이 마신다","몸에 좋다니까 일부러 마신다"]}
 ]}},

{id:"water_temp",cat:"음수",title:"어떤 물을 좋아하시나요?",type:"single",
 opts:["찬 물을 좋아하는 편","따듯한 물을 좋아하는 편","상관없다"]},

{id:"alcohol_freq",cat:"술",title:"술을 얼마나 자주 마시나요?",type:"single",
 opts:["일주일 3~4번 이상","한달 3~4번 이하","술이 안 맞는 것 같아 잘 안 마신다","안 마신다"]},

{id:"alcohol_effect",cat:"술",title:"술을 조금만 마셔도?",type:"multi",
 opts:["얼굴~전신이 금방 붉어진다","금방 취한다","몸이 불편해진다","숙취가 오래간다","해당 없음"],
 cond:function(){return answers["alcohol_freq"]!=="안 마신다"}},

{id:"liver",cat:"술",title:"해당하는 것이 있나요?",type:"multi",
 opts:["지방간이 있다~예전에 있었다","간수치가 높은편~예전에 높았다","해당 없음"],
 cond:function(){return answers["alcohol_freq"]!=="안 마신다"}},

{id:"nausea",cat:"속메스꺼움",title:"비위가 약해서 속이 메슥거릴 때가 많나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"nausea_when",title:"속이 메슥거릴 때는?",type:"multi",opts:["머리가 아플 때","생리통이 심할 때","소화가 안될 때","과음후"]}
 ]}},

{id:"heartburn",cat:"속쓰림",title:"속이 자주 쓰리고 아프나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"heartburn_when",title:"어떨 때 속이 쓰린가요?",type:"multi",opts:["맵거나 자극적인 음식 먹으면","공복이나 새벽"]},
   {id:"heartburn_spicy",title:"그래서 맵거나 자극적인 음식을 못 먹나요?",type:"single",opts:["그렇다","아니다"]}
 ]}},

{id:"menstrual_main",cat:"생리",title:"생리와 관련된 불편한 점이 있나요?",type:"single",
 opts:["없다","있다"],
 sub:{"있다":[
   {id:"menstrual_pain",title:"생리통이 있나요?",type:"single",opts:["심한편","어느 정도","약간","없다"]},
   {id:"menstrual_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["생리혈이 검붉게 나온다","생리혈이 덩어리져 나온다","평소 멍이 잘 든다","생리시 몸살기처럼 으실으실 추워지곤 한다","생리시 아랫배를 따듯하게 지지곤 한다"]}
 ]},
 cond:function(){return selectedGender==="여자"}},

{id:"cold_main",cat:"감기",title:"감기 걸리면 주로?",type:"multi",
 opts:["몸살 감기로 온다","목이 자주 붓는다"],
 sub:{"몸살 감기로 온다":[
   {id:"cold_body",title:"",type:"multi",opts:["으실으실 춥거나 몸이 쑤시고 아프다"]}
 ],"목이 자주 붓는다":[
   {id:"cold_throat",title:"",type:"multi",opts:["침 삼키면 아프다"]}
 ]}},

{id:"throat_main",cat:"목",title:"피곤하거나 말을 많이 하면?",type:"multi",
 opts:["목이 잘 붓곤 한다","입술이 바짝 마르곤 한다","해당 없음"]},

{id:"throat_phlegm",cat:"목",title:"평소 목에 가래가 걸린 듯하여 불편한가요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"throat_phlegm_extra",title:"",type:"multi",opts:["그래서 목을 자주 '흠흠' 거리곤 한다"]}
 ]}},

{id:"neck_pain",cat:"목",title:"뒷목~어깨가 자주 아프나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"neck_pain_freq",title:"빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]}
 ]}},

{id:"breath",cat:"숨참",title:"평소 숨이 차서 숨쉬기 힘들 때가 많나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"breath_sev",title:"숨참 정도가?",type:"single",opts:["심한편","어느 정도","약간"]},
   {id:"breath_when",title:"어떨 때 숨이 차나요?",type:"multi",opts:["찬 바람 맞으면","빨리 걷거나 뛰면","스트레스 받으면"]}
 ]}},

{id:"stamina",cat:"체력",title:"평소 체력이?",type:"single",
 opts:["매우 약한 편","약한 편","보통","좋은 편","매우 좋은 편"]},

// ===== 감정 =====
{id:"emo_anger",cat:"감정",title:"본래 내 성격에 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 groups:[
   {icon:"&#128544;",bg:"#ffeef0",items:[
     {id:"emo_irritable",text:"신경질, 짜증이 잘 난다."},
     {id:"emo_express",text:"불만이 있으면 담아두지 않고 바로 말하는 편"}
   ]},
   {icon:"&#128557;",bg:"#f0f0f8",items:[
     {id:"emo_suppress",text:"화를 거의 내지 않고 삭히곤 한다."},
     {id:"emo_endure",text:"불만이 있어도 표현하지 않고 참는다."}
   ]}
 ]},

{id:"emo_anxiety",cat:"감정",title:"본래 내 성격에 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 groups:[
   {icon:"&#128552;",bg:"#fff8f0",items:[
     {id:"emo_uneasy",text:"마음이 편치 않고 불안해질 때가 많다."}
   ]},
   {icon:"&#128561;",bg:"#f0f4ff",items:[
     {id:"emo_fearful",text:"유달리 겁이 많다."},
     {id:"emo_horror",text:"TV 영화 무섭고 잔인한 장면 절대 못 본다."},
     {id:"emo_ride",text:"놀이기구 못 탄다."},
     {id:"emo_bug",text:"쥐나 벌레가 무섭고 싫다."}
   ]}
 ]},

{id:"emo_worry",cat:"감정",title:"본래 내 성격에 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 groups:[
   {icon:"&#128556;",bg:"#fff8e8",items:[
     {id:"emo_overthink",text:"안해도 되는 걱정을 많이 하곤 한다."},
     {id:"emo_health_worry",text:"건강염려증처럼 건강에 대해 걱정을 많이 한다."}
   ]},
   {icon:"&#128546;",bg:"#f0f0f8",items:[
     {id:"emo_depressed",text:"심한 우울감에 깊이 빠지곤 한다."},
     {id:"emo_lethargic",text:"무기력하고 침체되어 아무것도 안하게 된다."}
   ]}
 ]},

{id:"emo_sensitive",cat:"감정",title:"본래 내 성격에 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 groups:[
   {icon:"&#128553;",bg:"#fef0f5",items:[
     {id:"emo_sensitive_nerve",text:"신경이 매우 예민한 편이다."}
   ]},
   {icon:"&#128556;",bg:"#f0f8ff",items:[
     {id:"emo_tense",text:"유달리 긴장을 많이 한다."},
     {id:"emo_stage_fright",text:"특히 대중 발표할 때 긴장을 너무 많이 한다."}
   ]}
 ]},

// ===== 증상입력 =====
{id:"symptom_entry",cat:"증상입력",title:"치료가 필요한 부분을 간략하게 적어주세요.",type:"symptom_entry"}
];

// 조건부 문항(cond)과 여성 전용 문항은 answers / selectedGender 전역 변수를 참조합니다.
// index.html, admin.html 양쪽에서 이 스크립트를 불러오기 전에
// `let answers = {}`, `let selectedGender = null` 을 선언해두어야 합니다.

function visibleQ() { return Q.filter(q => !q.cond || q.cond()); }

// 답변을 사람이 읽기 쉬운 텍스트로 정리 (구글시트 "문진 요약" 칸에 저장되는 내용)
function buildSummary() {
    const lines = [];
    visibleQ().forEach(q => {
        if (q.type === 'symptom_entry') return;
        if (q.type === 'emotion') {
            q.groups.forEach(g => g.items.forEach(it => {
                if (answers[it.id]) lines.push(`[${q.cat}] ${it.text}`);
            }));
            return;
        }
        const val = answers[q.id];
        if (val === undefined) return;
        const valText = Array.isArray(val) ? val.join(', ') : val;
        lines.push(`[${q.cat}] ${q.title}: ${valText}`);
        if (q.sub) {
            const chosen = Array.isArray(val) ? val : [val];
            chosen.forEach(v => {
                if (q.sub[v]) {
                    q.sub[v].forEach(sq => {
                        const sv = answers[sq.id];
                        if (sv === undefined) return;
                        const svText = Array.isArray(sv) ? sv.join(', ') : sv;
                        const label = sq.title || '  ↳';
                        lines.push(`   - ${label}: ${svText}`);
                    });
                }
            });
        }
    });
    return lines.join('\n');
}
