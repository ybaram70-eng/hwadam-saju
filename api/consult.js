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
