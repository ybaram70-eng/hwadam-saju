export default async function handler(req,res){
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'POST 요청만 지원합니다.'});
  }
  const key=process.env.OPENAI_API_KEY;
  if(!key)return res.status(503).json({error:'AI 상담 서버 연결이 아직 준비되지 않았습니다. 관리자 API 키 설정이 필요합니다.'});
  try{
    const body=req.body||{};
    const question=String(body.question||'').trim();
    const chart=body.chart||{};
    const mode=String(body.mode||'saju');
    const image=String(body.image||'');
    if(mode==='palm'){
      if(!image.startsWith('data:image/'))return res.status(400).json({error:'손바닥 사진을 올려 주세요.'});
      const hand=body.hand==='left'?'왼손':body.hand==='right'?'오른손':'손 구분 미선택';
      const detail=body.detail===true||body.detail==='detail';
      const model=process.env.OPENAI_MODEL||'gpt-5.6-luna';

      const extractText=(data)=>{
        let out='';
        for(const item of data.output||[]){if(item?.type==='message'){for(const x of item.content||[]){if(x?.type==='output_text'&&x.text)out+=x.text}}}
        if(!out&&typeof data.output_text==='string')out=data.output_text;
        return out;
      };

      if(detail){
        const observePayload={
          model,
          instructions:'당신은 손바닥 이미지의 선 형태만 판독하는 관찰자입니다. 손금의 의미나 운세는 절대 해석하지 말고, 사진에서 실제로 보이는 형태만 기록하세요. 생명선·두뇌선·감정선·운명선·태양선·수성구 세로선·결혼선·주요 보조선과 특수문양을 각각 확인하세요. 각 항목마다 [판독등급: 명확/부분확인/확인어려움], 시작점, 끝점, 방향, 길이, 굵기, 깊이/선명도, 끊김, 갈라짐, 상승지선/하강지선, 섬·십자·삼각·별·사각형 여부, 주변선과의 연결을 구체적으로 적으세요. 사진에서 보이지 않는 특징을 추측하지 마세요. 선이 피부주름인지 주요선인지 불확실하면 반드시 확인어려움으로 표시하세요. 손가락과 손목이 잘렸거나 초점·조명·각도 때문에 판독이 떨어지면 맨 위에 사진 품질 문제를 명확히 적으세요. 해석 문장은 쓰지 마세요.',
          input:[{role:'user',content:[
            {type:'input_text',text:'손 구분: '+hand+'\n이 손바닥 사진을 먼저 순수 관찰 단계로 판독해 주세요.'},
            {type:'input_image',image_url:image}
          ]}],
          max_output_tokens:1800
        };
        const or=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify(observePayload)});
        const od=await or.json();
        if(!or.ok)return res.status(or.status).json({error:od?.error?.message||'손금 형태 판독에 실패했습니다.'});
        const observations=extractText(od);
        if(!observations)return res.status(502).json({error:'손금 형태 판독 결과를 확인할 수 없습니다.'});

        const interpretPayload={
          model,
          instructions:'당신은 화담철학관의 전통 손금 상세 해설 보조 AI입니다. 아래에 제공되는 “사진 관찰 결과”만 근거로 해석하세요. 관찰 결과에 없는 선이나 문양을 새로 만들어내지 마세요. 판독등급이 확인어려움이면 해석하지 말고 “사진상 판독이 어려워 해석에서 제외합니다”라고 쓰세요. 부분확인은 제한적으로만 설명하고, 명확 항목은 형태를 다시 정확히 요약한 뒤 전통 손금학의 의미를 분리해 설명하세요. 관찰과 해석을 절대 섞지 마세요. 각 선마다 반드시 “관찰 결과”와 “전통적 해석” 두 부분을 둡니다. 생명선은 수명으로 해석하지 말고 활력·생활 리듬의 전통적 상징으로만 설명하세요. 건강·질병·사망시기·임신·범죄성은 판단하지 마세요. 재물·직업·관계도 확정적 예언이 아니라 전통 손금학의 상징적 경향으로 설명하세요. 모호한 문장보다 구체적인 형태와 근거를 먼저 제시하세요. 구성은 ① 사진 판독 품질 ② 생명선 ③ 두뇌선 ④ 감정선 ⑤ 운명선 ⑥ 태양선 ⑦ 재물 관련 수성구 세로선 ⑧ 결혼선 ⑨ 보조선·특수문양 ⑩ 손의 구 ⑪ 전체 종합 ⑫ 확인이 어려운 부분 ⑬ 현실적인 활용 조언 순서로 작성하세요. 약 3000~4500자로 충분히 자세히 작성하세요.',
          input:'[손 구분]\n'+hand+'\n\n[사진 관찰 결과]\n'+observations,
          max_output_tokens:3000
        };
        const ir=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify(interpretPayload)});
        const id=await ir.json();
        if(!ir.ok)return res.status(ir.status).json({error:id?.error?.message||'손금 상세 해석에 실패했습니다.'});
        const answer=extractText(id);
        if(!answer)return res.status(502).json({error:'손금 상세 해석 결과를 확인할 수 없습니다.'});
        return res.status(200).json({answer,observations});
      }

      const basicPayload={
        model,
        instructions:'당신은 화담철학관의 손금 기본 해설 보조 AI입니다. 업로드된 손바닥 사진에서 실제로 보이는 특징만 관찰하세요. 결과는 반드시 JSON 하나만 출력하세요. 형식은 {"photoStatus":"사진 상태 한 줄","lines":[{"name":"생명선","location":"어디서 시작해 어디로 향하는지","point":"사진에서 눈에 띄는 지점 또는 특징 한 줄","meaning":"그 지점의 전통 손금학적 의미 한 줄","confidence":"명확|부분확인|확인어려움"}],"notice":"참고 안내"} 입니다. lines에는 실제로 확인되는 주요선 중 최대 4개만 넣고 생명선·두뇌선·감정선·운명선을 우선하세요. 각 문장은 짧고 구체적으로 쓰세요. 보이지 않는 특징은 만들지 마세요. 수명, 질병, 사망 시기, 임신, 범죄성, 성격을 확정적으로 판단하지 마세요. meaning은 반드시 전통 손금학의 참고적 해석으로만 쓰세요.',
        input:[{role:'user',content:[
          {type:'input_text',text:'손 구분: '+hand+'\n이 손바닥 사진을 간단하고 명확하게, 선 위치와 눈에 띄는 지점 중심으로 정리해 주세요.'},
          {type:'input_image',image_url:image}
        ]}],
        max_output_tokens:900
      };
      const pr=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify(basicPayload)});
      const pd=await pr.json();
      if(!pr.ok)return res.status(pr.status).json({error:pd?.error?.message||'손금 AI 분석에 실패했습니다.'});
      const raw=extractText(pd).trim();
      if(!raw)return res.status(502).json({error:'손금 분석 결과를 확인할 수 없습니다.'});
      let summary=null;
      try{
        const cleaned=raw.replace(/^\`\`\`(?:json)?\s*/i,'').replace(/\s*\`\`\`$/,'');
        summary=JSON.parse(cleaned);
      }catch{}
      if(!summary||!Array.isArray(summary.lines)){
        return res.status(200).json({answer:raw});
      }
      const answer=[
        summary.photoStatus||'',
        ...summary.lines.map(x=>[x.name,x.location,x.point,x.meaning].filter(Boolean).join(' · ')),
        summary.notice||''
      ].filter(Boolean).join('\n\n');
      return res.status(200).json({answer,summary});
    }
    if(mode==='face'){
      if(!image.startsWith('data:image/'))return res.status(400).json({error:'얼굴 사진을 올려 주세요.'});
      const detail=body.detail===true||body.detail==='detail';
      const faceInstructions=detail
        ? '당신은 화담철학관의 관상 문화해설 보조 AI입니다. 결과는 “해석 중심”으로 짧고 명확하게 작성하세요. 사진에서 실제로 확인되는 얼굴 특징만 근거로 사용하고, 확인되지 않는 내용은 만들지 마세요. 긴 관찰 설명은 하지 말고 각 항목에서 근거를 한 문장 이내로만 제시한 뒤 바로 전통 관상학의 상징적 의미를 설명하세요. 구성은 ① 얼굴형 ② 이마 ③ 눈썹·눈 ④ 코 ⑤ 입 ⑥ 턱·하관 ⑦ 전체 요약 순서로 작성하세요. 각 항목은 “특징: … / 해석: …” 두 문장 이내로 제한하세요. 마지막 전체 요약은 3문장 이내로 작성하세요. “좋아 보입니다”, “복이 있습니다” 같은 막연한 문구는 피하고, 어떤 형태 때문에 어떤 전통적 의미를 붙이는지 분명히 쓰세요. 사진만으로 실제 성격, 지능, 건강, 수명, 범죄성, 재산, 정신상태, 민족·인종, 종교, 정치성향을 추정하거나 단정하지 마세요. 미래의 결혼·재물·직업 성공도 사실처럼 예언하지 마세요. 전체는 약 700~1000자로 간결하게 작성하세요.'
        : '관상 결과를 간결하게 해석하세요. 사진에서 가장 잘 확인되는 얼굴 특징 4가지만 골라 각 항목을 “특징: … / 해석: …” 형식으로 작성하세요. 특징은 한 문장, 해석은 전통 관상학의 참고 의미 한 문장만 씁니다. 마지막에 “전체 요약”을 2문장으로 정리하세요. 긴 관찰 설명, 반복, 모호한 표현은 피하세요. 확인되지 않는 특징은 쓰지 마세요. 사진만으로 실제 성격, 지능, 건강, 수명, 범죄성, 재산, 정신상태 같은 개인 특성을 단정하지 마세요. 전체는 약 350~550자로 작성하세요.';
      const facePayload={
        model:process.env.OPENAI_MODEL||'gpt-5.6-luna',
        instructions:faceInstructions,
        input:[{role:'user',content:[
          {type:'input_text',text:detail?'이 얼굴 사진을 전통 관상 문화해설 형식으로 자세히 설명해 주세요.':'이 얼굴 사진의 기본적인 관상 문화해설을 간단히 보여 주세요.'},
          {type:'input_image',image_url:image}
        ]}],
        max_output_tokens:detail?2200:650
      };
      const fr=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify(facePayload)});
      const fd=await fr.json();
      if(!fr.ok)return res.status(fr.status).json({error:fd?.error?.message||'관상 AI 분석에 실패했습니다.'});
      let answer='';
      for(const item of fd.output||[]){if(item?.type==='message'){for(const x of item.content||[]){if(x?.type==='output_text'&&x.text)answer+=x.text}}}
      if(!answer&&typeof fd.output_text==='string')answer=fd.output_text;
      if(!answer)return res.status(502).json({error:'관상 분석 결과를 확인할 수 없습니다.'});
      return res.status(200).json({answer});
    }
    if(!question)return res.status(400).json({error:'상담 질문을 입력해 주세요.'});

    const isLifetime=/평생운세 장문 리포트|평생 총운|말년운/.test(question);

    const normalInstructions=`당신은 한국 명리학 상담을 돕는 화담철학관 AI 보조상담가입니다. 사용자가 제공한 사주 원국과 계산 결과를 가장 우선적인 근거로 사용하세요. 제공되지 않은 생년월일, 나이, 대운, 세운, 가족관계, 재산상황을 추측하거나 만들어내지 마세요. 단정적 예언, 공포 조장, 질병 진단, 법률·투자 확정 조언은 하지 마세요. 재물·직업·관계·대운·세운은 가능성, 경향, 주의점, 활용 방향으로 설명하세요. 질문 주제에 직접 답하고 같은 내용을 반복하지 마세요. 한국어로 모바일에서 읽기 쉽게 작성하세요. 마크다운 기호는 사용하지 마세요. 답변은 핵심 요약, 명리상 근거, 현실적인 활용 조언 순서로 작성하세요. 각 항목은 • 로 시작하고 전체는 약 500~900자 정도로 작성하세요.`;

    const lifetimeInstructions=`당신은 한국 명리학 상담을 돕는 화담철학관 AI 보조상담가입니다. 사용자가 제공한 사주 원국과 계산 결과만을 근거로 평생운세 장문 리포트를 작성하세요. 제공되지 않은 가족관계, 재산, 직업 이력, 질병, 실제 사건은 추측하거나 만들어내지 마세요. 단정적 예언과 공포 조장을 피하고 모든 해석은 경향, 가능성, 시기별 활용 방향으로 설명하세요. 한국어로 작성하고 마크다운 기호는 사용하지 마세요.

반드시 아래 11개 장을 모두 작성하고 어느 장도 생략하지 마세요.
1. 평생운세 핵심 총평
2. 타고난 성향과 삶의 기본 구조
3. 재물운과 돈의 흐름
4. 직업·사업운과 사회적 성취
5. 배우자·결혼운과 인간관계
6. 가족·자녀와 관계의 흐름
7. 건강에서 주의할 생활 흐름
8. 대운별 주요 전환점
9. 중년 이후의 변화
10. 말년운과 삶의 정리
11. 현실적인 활용 조언

각 장은 실제 원국의 오행, 십신, 일간, 지지 관계와 화면에 제공된 대운·세운 자료 중 확인 가능한 근거만 사용하세요. 없는 대운이나 실제 사건을 만들어내지 마세요. 같은 설명을 반복하지 말고 각 장의 주제에 맞게 구체적으로 설명하세요. 건강 부분은 질병 진단이 아니라 생활 습관, 과로, 스트레스, 균형 관점으로만 설명하세요.

중요: 답변이 중간 문장에서 끝나면 안 됩니다. 1번부터 11번까지 반드시 모두 완성하세요. 10번 말년운 문장을 완결한 뒤 11번 현실적인 활용 조언을 반드시 작성하세요. 11번에는 사용자가 현실적으로 적용할 수 있는 행동 조언을 정확히 7개 작성하고 각 항목을 • 로 시작하세요. 마지막 조언까지 완전한 문장으로 끝내세요. 불필요하게 한 장을 길게 늘이지 말고 전체 분량을 5,000~7,000자 정도로 조절하여 모든 장이 출력 한도 안에 들어오게 하세요.`;

    const payload={
      model:process.env.OPENAI_MODEL||'gpt-5.6-luna',
      instructions:isLifetime?lifetimeInstructions:normalInstructions,
      input:`[사주 데이터]\n${JSON.stringify(chart)}\n\n[사용자 질문]\n${question}`,
      max_output_tokens:isLifetime?12000:900
    };

    const r=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body:JSON.stringify(payload)
    });
    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data?.error?.message||'AI 응답 생성에 실패했습니다.'});

    let answer='';
    for(const item of data.output||[]){
      if(item?.type==='message'){
        for(const c of item.content||[]){
          if(c?.type==='output_text'&&c.text)answer+=c.text;
        }
      }
    }
    if(!answer&&typeof data.output_text==='string')answer=data.output_text;
    if(!answer)return res.status(502).json({error:'AI 응답 텍스트를 확인할 수 없습니다.'});
    return res.status(200).json({answer});
  }catch(e){
    return res.status(500).json({error:e?.message||String(e)});
  }
}
