// 청춘한의원 사전문진 - 문항 정의 (환자용 문진표 index.html, 관리자페이지 admin.html 공용)
// 이 파일 하나만 고치면 문진표와 관리자페이지 양쪽에 그대로 반영됩니다.

const Q = [
// ===== 과거력·복용약물 (한약 처방 안전성 확인을 위해 가장 먼저 물어봅니다) =====
{id:"past_history",cat:"과거력",title:"과거에 수술이나 입원, 사고(교통사고 등) 경력이 있나요? 있다면 시기와 함께 간략히 적어주세요.",type:"text"},

{id:"current_medication",cat:"복용약물",title:"현재 복용 중인 약(양약·한약·영양제 포함)이 있나요? 있다면 약 이름을 적어주세요.",type:"text"},

{id:"sleep_main",cat:"잠",title:"잠을",type:"single",
 opts:["잘 자는 편","못 자는 편"],
 sub:{"못 자는 편":[
   {id:"sleep_severity",title:"어느 정도 못 주무시나요?",type:"single",opts:["매우 못자는 편","어느 정도","약간"]},
   {id:"sleep_wake",title:"",type:"multi",opts:["잠은 드는데 자다가 자주 깬다","새벽에 일찍 깨서 다시 못 잔다"]}
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
   {id:"chest_tight_extra",title:"가슴이 답답하면?",type:"multi",opts:["잠이 더 안온다","한숨을 자주 쉰다","숨이 깊이 마셔지지 않는 느낌"]},
   {id:"chest_tight_type",title:"답답한 느낌이 어느 쪽에 가깝나요?",type:"single",opts:["음식이 걸린 것처럼 답답하다","음식과 상관없이 그냥 답답하다"]}
 ]}},

{id:"chest_compare",cat:"흉부",title:"가슴 두근거림, 답답함 어느 것이 더 심한가요?",type:"single",
 opts:["가슴 두근거림이 더 심","가슴 답답함이 더 심","비슷하다"],
 cond:function(){return answers["chest_palp"]==="예"&&answers["chest_tight"]==="예"}},

{id:"chest_pain",cat:"흉부",title:"가슴이 뻐근하게 아플 때가 많다.",type:"single",
 opts:["예","아니오"]},

{id:"chest_stress",cat:"흉부",title:"스트레스를 받으면 가슴이 답답해지고 잠을 잘 못 잔다.",type:"single",
 opts:["그렇다","아니다"]},

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

{id:"stool_residual",cat:"대변",title:"대변을 보고도 덜 본 듯 잔변감이 있나요?",type:"single",
 opts:["그렇다","아니다"]},

{id:"digest_main",cat:"소화",title:"평소 소화가?",type:"single",
 opts:["잘 되는 편","보통","잘 안되는 편"],
 sub:{"잘 안되는 편":[
   {id:"digest_sev",title:"어느 정도?",type:"single",opts:["매우 안되는 편","어느 정도"]},
   {id:"digest_cause",title:"어떨 때 소화가 안되나요?",type:"multi",opts:["내 기준에 정해진 양 이상 과식하면","신경쓰면 소화가 자주 안된다"]}
 ]}},

{id:"digest_symptom",cat:"소화",title:"소화가 안되면?",type:"multi",
 opts:["명치(위장)에서 음식이 내려가지 않는 듯 답답하다","가슴이나 목에서 음식이 내려가지 않는 듯 답답하다","소화가 안되면 식욕도 더 떨어지곤 한다","소화가 안 되더라도 식욕은 여전히 좋은 편이다","사실 명치·위장 부위가 불편한 것은 아니다"],
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
   {id:"edema_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["오래 섰거나 걸으면 다리가 붓는다","양말 자국이 난다","운동하거나 움직이면 더 붓는다","관절(무릎 등)에 물이 차서 뺀 적이 있다"]}
 ]}},

{id:"dizzy",cat:"현훈",title:"앉았다 일어나면 어지러울 때가 많나요?",type:"single",
 opts:["그렇다","아니다"]},

{id:"headache_main",cat:"두통",title:"평소 두통이 있나요?",type:"single",
 opts:["거의 없다","가끔 있다","자주 있다"],
 sub:{"자주 있다":[
   {id:"headache_type",title:"두통이 주로 어떤 느낌인가요?",type:"multi",opts:["열이 위로 치받는 듯한 느낌","머리가 무겁고 띵한 느낌","한쪽만 지끈거리는 편두통 양상","뒷목에서부터 올라오는 느낌"]},
   {id:"headache_extra",title:"두통과 함께 나타나는 것이 있나요?",type:"multi",opts:["메스껍거나 토할 것 같다","어지럼증","뒷목이나 어깨가 뻣뻣하다","해당없음"]}
 ]}},

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
 opts:["일주일 3~4번 이상","일주일 2~3회","한달 3~4번 이하","술이 안 맞는 것 같아 잘 안 마신다","안 마신다"]},

{id:"alcohol_effect",cat:"술",title:"술을 조금만 마셔도?",type:"multi",
 opts:["얼굴~전신이 금방 붉어진다","금방 취한다","몸이 불편해진다","숙취가 오래간다","피부에 두드러기나 발진이 잘 생긴다","해당 없음"],
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
   {id:"menstrual_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["생리혈이 검붉게 나온다","생리혈이 덩어리져 나온다","평소 멍이 잘 든다","다리에 정맥이 파랗게 튀어나와 보인다(하지정맥류)","생리시 몸살기처럼 으실으실 추워지곤 한다","생리시 아랫배를 따듯하게 지지곤 한다"]}
 ]},
 cond:function(){return selectedGender==="여자"}},

{id:"cold_main",cat:"감기",title:"감기 걸리면 주로?",type:"multi",
 opts:["몸살 감기로 온다","목이 자주 붓는다"],
 sub:{"몸살 감기로 온다":[
   {id:"cold_body",title:"",type:"multi",opts:["으실으실 춥거나 몸이 쑤시고 아프다"]}
 ],"목이 자주 붓는다":[
   {id:"cold_throat",title:"",type:"multi",opts:["침 삼키면 아프다"]}
 ]}},

{id:"nose_main",cat:"코",title:"평소 콧물이나 코막힘으로 불편한가요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"nose_type",title:"콧물과 코막힘 중 어느 쪽이 더 심한가요?",type:"single",opts:["콧물이 더 심하다","코막힘이 더 심하다","둘 다 비슷하다"]},
   {id:"nose_discharge",title:"콧물의 색깔은 주로?",type:"single",opts:["맑고 묽다","누렇고 끈적하다","맑을 때도 누럴 때도 있다","콧물은 거의 없다"]},
   {id:"nose_trigger",title:"어떨 때 더 심해지나요?",type:"multi",opts:["찬바람을 쐬거나 추워지면","계절이 바뀔 때(환절기)","계절과 상관없이 항상 그렇다"]},
   {id:"nose_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["재채기가 잦다","코가 간지럽다","코가 건조하고 코딱지가 잘 생긴다","콧물이 목뒤로 넘어가는 느낌이 있다(후비루)","눈이나 입 주변도 가렵다","해당없음"]}
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

{id:"numbness_main",cat:"저림",title:"손발이 저리거나 찌릿찌릿한 느낌이 있나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"numbness_freq",title:"빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]}
 ]}},

{id:"muscle_cramp",cat:"저림",title:"종아리 등에 쥐가 잘 나나요?",type:"single",
 opts:["그렇다","아니다"]},

{id:"neck_tight",cat:"저림",title:"목이나 어깨가 당기듯 뻣뻣하게 굳어있나요?",type:"single",
 opts:["그렇다","아니다"]},

{id:"breath",cat:"숨참",title:"평소 숨이 차서 숨쉬기 힘들 때가 많나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"breath_sev",title:"숨참 정도가?",type:"single",opts:["심한편","어느 정도","약간"]},
   {id:"breath_when",title:"어떨 때 숨이 차나요?",type:"multi",opts:["찬 바람 맞으면","빨리 걷거나 뛰면","스트레스 받으면"]}
 ]}},

{id:"stamina",cat:"체력",title:"평소 체력이?",type:"single",
 opts:["매우 약한 편","약한 편","보통","좋은 편","매우 좋은 편"]},

{id:"skin_main",cat:"피부",title:"평소 피부에 불편한 점이 있나요?",type:"multi",
 opts:["건조하고 거칠거칠하다","두드러기가 잘 올라온다","특정 부위에 습진이 있다(예: 손발바닥)","여드름이나 뾰루지가 잘 난다","해당없음"],
 sub:{"두드러기가 잘 올라온다":[
   {id:"urticaria_trigger",title:"두드러기는 어떨 때 잘 생기나요?",type:"multi",opts:["특정 음식을 먹으면","추위나 찬바람에","스트레스 받으면","이유를 모르겠다"]}
 ]}},

{id:"eye_main",cat:"눈",title:"평소 눈이 건조하거나 충혈되는 편인가요?",type:"single",
 opts:["그렇다","아니다"]},

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
     {id:"emo_uneasy",text:"마음이 편치 않고 불안해질 때가 많다."},
     {id:"emo_height_fear",text:"높은 곳에 올라가면 불안해진다."},
     {id:"emo_confined_fear",text:"터널처럼 막힌 공간에 있으면 불안해진다."},
     {id:"emo_speed_fear",text:"차를 빨리 몰면 불안해진다."}
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
     {id:"emo_stage_fright",text:"특히 대중 발표할 때 긴장을 너무 많이 한다."},
     {id:"emo_stage_sweat",text:"그런 상황에서는 손발에 땀까지 난다."}
   ]}
 ]},

{id:"emo_trauma",cat:"감정",title:"본래 내 성격에 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 groups:[
   {icon:"&#128128;",bg:"#f5f0ff",items:[
     {id:"emo_trauma_change",text:"특정한 일을 겪은 후로 성격이나 마음 상태가 달라졌다."},
     {id:"emo_nightmare",text:"안 좋은 꿈(악몽)을 자주 꾼다."}
   ]}
 ]},

// ===== 증상입력 =====
{id:"symptom_entry",cat:"증상입력",title:"치료가 필요한 부분을 간략하게 적어주세요.",type:"symptom_entry"}
];

// ===================================================================
// QC: 소아 전용 문진 (만 15세 이하, isChildPatient가 true일 때 Q 대신 이 배열을 씁니다)
// 성인용 Q와 완전히 분리된 별도 문항 세트입니다. 성인 문항을 그대로 가져다 쓰지 않고
// 소아 눈높이로 다시 물었고, growth-data.js의 childAgeTier()가 계산하는 연령대(영유아/아동/청소년)에
// 따라 일부 문항만 노출되도록 cond에서 childTier를 참조합니다.
//   영유아: 만 0~6세(미취학)  아동: 만 7~12세(초등)  청소년: 만 13~15세(사춘기)
// 추위/더위, 소화, 대소변, 잠처럼 한의학 문진의 핵심 항목은 전 연령대 공통으로 반드시 포함합니다.
// ===================================================================
const QC = [

// ----- 과거력·복용약물 (한약 처방 안전성 확인을 위해 가장 먼저 물어봅니다) -----
{id:"qc_past_history",cat:"과거력",title:"아이가 과거에 수술이나 입원, 사고(예방접종 이상반응 포함)를 겪은 적이 있나요? 있다면 시기와 함께 간략히 적어주세요.",type:"text"},

{id:"qc_current_medication",cat:"복용약물",title:"아이가 현재 복용 중인 약(양약·한약·영양제 포함)이 있나요? 있다면 약 이름을 적어주세요.",type:"text"},

// ----- 잠 -----
{id:"qc_sleep_main",cat:"잠",title:"아이가 잠을 잘 자는 편인가요?",type:"single",
 opts:["잘 자는 편","못 자는 편"],
 sub:{"못 자는 편":[
   {id:"qc_sleep_severity",title:"어느 정도 못 자나요?",type:"single",opts:["매우 못 자는 편","어느 정도","약간"]},
   {id:"qc_sleep_wake",title:"",type:"multi",opts:["잠은 드는데 자다가 자주 깬다","혼자 못 자고 보채거나 안아줘야 잔다","새벽에 일찍 깬다"]}
 ]}},

{id:"qc_sleep_night",cat:"잠",title:"자다가 울면서 깨거나(야제) 잠꼬대·이갈이가 있나요?",type:"multi",
 opts:["자다가 울면서 깬다(야제)","잠꼬대를 한다","이갈이를 한다","해당없음"]},

{id:"qc_bedwetting",cat:"잠",title:"밤에 자다가 소변 실수(야뇨)가 있나요?",type:"single",
 opts:["거의 매일","일주일에 몇번","가끔","없다"],
 cond:function(){return childTier!=="청소년"}},

{id:"qc_teen_sleep",cat:"잠",title:"공부나 스마트폰 등으로 수면 시간이 부족한 편인가요?",type:"single",
 opts:["매우 부족한 편","약간 부족한 편","충분한 편"],
 cond:function(){return childTier==="청소년"}},

// ----- 추위/더위·땀 -----
{id:"qc_cold_heat",cat:"추위/더위",title:"아이가 추위나 더위를 유난히 타는 편인가요?",type:"multi",
 opts:["추위를 타지 않는 편","몸이 차서 추위를 타는 편","열이 많아 더위를 타는 편"]},

{id:"qc_hand_foot",cat:"추위/더위",title:"손발이 찬 편인가요?",type:"single",
 opts:["매우 찬 편","약간 찬 편","보통","열나고 화끈거리는 편"]},

{id:"qc_sweat",cat:"땀",title:"평소 땀이?",type:"single",
 opts:["아주 많은 편","많은 편","보통","적은 편"],
 sub:{"아주 많은 편":[
   {id:"qc_sweat_area",title:"땀이 많은 부위는?",type:"multi",opts:["머리","손발","전신","잠잘 때 특히 많다"]}
 ]}},

// ----- 소화·식욕 -----
{id:"qc_digest",cat:"소화",title:"평소 소화가?",type:"single",
 opts:["잘 되는 편","보통","잘 안되는 편"],
 sub:{"잘 안되는 편":[
   {id:"qc_digest_extra",title:"소화가 안되면?",type:"multi",opts:["배가 더부룩하다고 한다","토하거나 게울 때가 있다","트림을 자주 한다","식욕이 같이 떨어진다"]}
 ]}},

{id:"qc_appetite",cat:"소화",title:"평소 식욕이?",type:"single",
 opts:["매우 없는 편","없는 편","보통","좋은 편","매우 좋은 편"]},

{id:"qc_picky",cat:"소화",title:"편식이 심한 편인가요?",type:"single",
 opts:["매우 심한 편","어느 정도","거의 없다"]},

{id:"qc_chewing",cat:"소화",title:"음식을 씹기 싫어하거나 오래 씹지 않고 삼키나요?",type:"single",
 opts:["그렇다","아니다"]},

{id:"qc_stomachache",cat:"소화",title:"배가(특히 배꼽 주변) 자주 아프다고 하나요?",type:"single",
 opts:["자주 그렇다","가끔 그렇다","거의 없다"]},

// ----- 대변/소변 -----
{id:"qc_stool",cat:"대변",title:"평소 대변은?",type:"single",
 opts:["거의 매일 정상변을 보는 편","변비 경향","설사~무른변 경향"],
 sub:{"변비 경향":[
   {id:"qc_stool_const_sev",title:"변비 정도는?",type:"single",opts:["심한 편","어느 정도","약간"]}
 ],"설사~무른변 경향":[
   {id:"qc_stool_diarr_freq",title:"빈도는?",type:"single",opts:["거의 매일","일주일 3~4번 정도","한달 3~4번 이하"]}
 ]}},

{id:"qc_urine",cat:"소변",title:"소변보는 횟수나 색깔에 불편한 점이 있나요?",type:"multi",
 opts:["너무 자주 본다","너무 적게 본다","색이 진하다","냄새가 심하다","특별히 없다"]},

// ----- 체력 -----
{id:"qc_stamina",cat:"체력",title:"평소 체력·활동량이?",type:"single",
 opts:["매우 약한 편(쉽게 지친다)","약한 편","보통","좋은 편","매우 좋은 편(에너지가 넘친다)"]},

// ----- 면역력/호흡기 -----
{id:"cold_freq_child",cat:"면역력",title:"감기에 걸리는 빈도는?",type:"single",
 opts:["한달에 한번 이상","두세달에 한번 정도","일년에 몇번 정도","거의 안 걸린다"]},

{id:"otitis_tonsil",cat:"면역력",title:"중이염이나 편도염을 반복해서 앓은 적이 있나요?",type:"multi",
 opts:["중이염을 자주 앓는다","편도가 자주 붓는다(편도염)","둘 다 해당","해당없음"]},

{id:"absence_freq",cat:"면역력",title:"아파서 어린이집·학교를 자주 결석하나요?",type:"single",
 opts:["자주 그렇다","가끔 그렇다","거의 없다","해당없음(아직 다니지 않음)"]},

{id:"qc_nose",cat:"코",title:"콧물·코막힘·재채기 등 비염 증상이 있나요?",type:"single",
 opts:["그렇다","아니다"],
 sub:{"그렇다":[
   {id:"qc_nose_trigger",title:"어떨 때 더 심해지나요?",type:"multi",opts:["환절기·계절 바뀔 때","찬바람 쐬면","계절과 상관없이 항상","알레르기 유발물질(먼지,동물털 등)"]},
   {id:"qc_nose_extra",title:"해당하는 것을 선택해주세요.",type:"multi",opts:["코를 자주 만지거나 비빈다","콧물이 목뒤로 넘어간다(후비루)","눈도 가렵다","해당없음"]}
 ]}},

{id:"qc_throat",cat:"목",title:"편도가 자주 붓거나 목이 아프다고 하나요?",type:"single",
 opts:["자주 그렇다","가끔 그렇다","거의 없다"]},

{id:"qc_cough",cat:"기침",title:"가래 낀 기침을 달고 사는 편인가요?",type:"single",
 opts:["그렇다","아니다"]},

// ----- 피부/눈 -----
{id:"qc_skin",cat:"피부",title:"평소 피부에 불편한 점이 있나요?",type:"multi",
 opts:["건조하고 거칠다","아토피 습진이 있다","두드러기가 잘 올라온다","태열기가 남아있다","땀띠가 잘 난다","해당없음"]},

{id:"qc_eye",cat:"눈",title:"눈을 자주 비비거나 충혈되나요? 시력저하가 걱정되나요?",type:"multi",
 opts:["눈을 자주 비빈다","충혈이 잦다","시력이 나빠지는 것 같다","눈을 찡그리거나 깜빡임이 잦다","특별히 없다"],
 cond:function(){return childTier!=="영유아"}},

// ----- 두통/성장통 -----
{id:"qc_headache",cat:"두통",title:"두통을 호소하는 편인가요?",type:"single",
 opts:["자주 있다","가끔 있다","거의 없다"],
 cond:function(){return childTier!=="영유아"}},

{id:"growth_pain",cat:"성장통",title:"자다가 다리가 아프다고 하거나 성장통을 호소한 적이 있나요?",type:"single",
 opts:["자주 있다","가끔 있다","없다"]},

// ----- 출생·수유·발달 (영유아·아동) -----
{id:"birth_weight",cat:"출생·수유력",title:"태어날 때 몸무게는 어느 정도였나요?",type:"single",
 opts:["정상 체중(2.5~4kg)","저체중(2.5kg 미만)","고체중(4kg 이상)","잘 모른다"],
 cond:function(){return childTier!=="청소년"}},

{id:"birth_preterm",cat:"출생·수유력",title:"조산(37주 미만)으로 태어났나요?",type:"single",
 opts:["예","아니오","잘 모른다"],
 cond:function(){return childTier!=="청소년"}},

{id:"feeding_type",cat:"출생·수유력",title:"어릴 때 주로 어떤 수유를 했나요?",type:"single",
 opts:["모유 위주","분유 위주","혼합","잘 모른다/해당없음"],
 cond:function(){return childTier!=="청소년"}},

{id:"qc_milestone",cat:"발달",title:"또래에 비해 발달(뒤집기·걷기·말하기 등)이 느린 편이었나요?",type:"single",
 opts:["느린 편이었다","또래와 비슷했다","빠른 편이었다","잘 모르겠다"],
 cond:function(){return childTier==="영유아"}},

{id:"qc_stranger",cat:"발달",title:"낯가림이 심한 편인가요?",type:"single",
 opts:["매우 심한 편","어느 정도","거의 없다"],
 cond:function(){return childTier==="영유아"}},

// ----- 성장·사춘기 -----
{id:"puberty_menarche",cat:"성장·사춘기",title:"초경을 시작했나요?",type:"single",
 opts:["시작했다","아직 안했다"],
 sub:{"시작했다":[
   {id:"puberty_menarche_when",title:"초경 시작 시기는?",type:"single",opts:["또래보다 빠른 편","또래와 비슷한 편","또래보다 늦은 편","잘 모르겠다"]}
 ]},
 cond:function(){return childTier!=="영유아" && selectedGender==="여자"}},

{id:"puberty_voice",cat:"성장·사춘기",title:"변성기(목소리 변화)나 급성장이 시작됐나요?",type:"single",
 opts:["시작됐다","아직이다"],
 cond:function(){return childTier!=="영유아" && selectedGender==="남자"}},

// ----- 가족력 -----
{id:"family_allergy",cat:"가족력",title:"부모님 중에 아래 병력이 있나요?",type:"multi",
 opts:["비염·알레르기","아토피 피부염","천식","없음"]},

// ----- 환경적응/또래관계 -----
{id:"child_adapt",cat:"환경적응",title:"어린이집·학교(새로운 환경)에 적응하는 편인가요?",type:"single",
 opts:["잘 적응하는 편","다소 힘들어하는 편","매우 힘들어하는 편","해당없음(아직 다니지 않음)"]},

{id:"child_peer",cat:"환경적응",title:"또래 친구들과 어울리는 데 어려움이 있나요?",type:"single",
 opts:["그렇다","아니다","해당없음"],
 cond:function(){return childTier!=="영유아"}},

// ----- 정서·행동 (연령대별로 다른 문항) -----
{id:"emo_toddler",cat:"정서·행동",title:"평소 아이의 모습에 해당하는 것을 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 cond:function(){return childTier==="영유아"},
 groups:[
   {icon:"&#128549;",bg:"#f0f4ff",items:[
     {id:"toddler_separation",text:"엄마(보호자)와 떨어질 때 유난히 심하게 운다."}
   ]},
   {icon:"&#128544;",bg:"#ffeef0",items:[
     {id:"toddler_tantrum",text:"떼쓰기나 고집이 또래보다 심한 편이다."},
     {id:"toddler_stubborn",text:"뜻대로 안되면 바닥에 눕거나 물건을 던진다."}
   ]}
 ]},

{id:"emo_child",cat:"정서·행동",title:"평소 아이의 모습에 해당하는 것을 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 cond:function(){return childTier==="아동"},
 groups:[
   {icon:"&#128563;",bg:"#fff4e6",items:[
     {id:"child_distract",text:"집중을 잘 못하고 산만한 편이다."},
     {id:"child_impulsive",text:"충동적이고 기다리는 것을 힘들어한다."}
   ]},
   {icon:"&#128544;",bg:"#ffeef0",items:[
     {id:"child_tantrum",text:"짜증이나 떼쓰기가 또래보다 심한 편이다."}
   ]},
   {icon:"&#128561;",bg:"#f0f0f8",items:[
     {id:"child_tic",text:"눈 깜빡임, 헛기침, 어깨 들썩임 같은 틱 증상이 있다."},
     {id:"child_nail_biting",text:"손톱을 물어뜯거나 머리카락을 뽑는 습관이 있다."}
   ]}
 ]},

{id:"emo_teen",cat:"정서·행동",title:"평소 아이의 모습에 해당하는 것을 체크해주세요. 없으면 다음을 누르세요",type:"emotion",
 cond:function(){return childTier==="청소년"},
 groups:[
   {icon:"&#128544;",bg:"#ffeef0",items:[
     {id:"teen_irritable",text:"짜증이나 예민함이 부쩍 심해졌다."},
     {id:"teen_mood_swing",text:"기분 기복이 심한 편이다."}
   ]},
   {icon:"&#128546;",bg:"#f0f0f8",items:[
     {id:"teen_anxiety",text:"불안하거나 우울한 기분을 느낄 때가 많다."},
     {id:"teen_stress_body",text:"시험·학업 스트레스를 받으면 두통이나 배가 아프다."}
   ]},
   {icon:"&#128553;",bg:"#fef0f5",items:[
     {id:"teen_appearance",text:"외모나 체형에 대한 고민이 많다."}
   ]}
 ]},

// ----- 증상입력 -----
{id:"symptom_entry",cat:"증상입력",title:"치료가 필요한 부분을 간략하게 적어주세요.",type:"symptom_entry"}
];

// 조건부 문항(cond)은 answers / selectedGender / isChildPatient / childTier 전역 변수를 참조합니다.
// herbal.html, admin.html 양쪽에서 이 스크립트를 불러오기 전에
// `let answers = {}`, `let selectedGender = null`, `let isChildPatient = false`, `let childTier = null` 를
// 선언해두어야 합니다. isChildPatient(만 15세 이하)는 growth-data.js의 isChildAge()로, childTier(영유아/
// 아동/청소년)는 같은 파일의 childAgeTier()로 계산합니다 - 성인은 Q를, 소아는 QC를 사용하도록 나눕니다.

// 환자가 성인인지 소아인지에 따라 실제로 사용할 문항 배열을 고릅니다.
function activeQ() { return isChildPatient ? QC : Q; }

function visibleQ() { return activeQ().filter(q => !q.cond || q.cond()); }

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
