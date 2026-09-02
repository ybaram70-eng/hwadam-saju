import * as M from 'manseryeok';

export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST 요청만 지원합니다.'});
  try{
    const {year,month,day,hour,minute,isLunar,isLeapMonth,dayBoundary,gender}=req.body||{};
    const y=Number(year),m=Number(month),d=Number(day),h=Number(hour),min=Number(minute);
    if(!y||!m||!d||h<0||h>23||min<0||min>59) return res.status(400).json({error:'생년월일과 시간을 확인해 주세요.'});
    if(typeof M.calculateFourPillars!=='function') return res.status(500).json({error:'만세력 엔진을 불러오지 못했습니다.'});
    const r=M.calculateFourPillars({year:y,month:m,day:d,hour:h,minute:min,isLunar:!!isLunar,isLeapMonth:!!isLeapMonth,dayBoundary:dayBoundary||'midnight',gender:gender||'female'});
    const k=r.toObject();
    const dm=k?.day?.[0]||'';
    return res.status(200).json({ok:true,pillars:k,tenGods:r.tenGods||null,voidBranches:r.voidBranches||null,luckPillars:r.luckPillars||null,dayElement:dm&&M.getHeavenlyStemElement?M.getHeavenlyStemElement(dm):'',dayYinYang:dm&&M.getHeavenlyStemYinYang?M.getHeavenlyStemYinYang(dm):''});
  }catch(e){
    return res.status(500).json({error:e?.message||'사주 계산 중 오류가 발생했습니다.'});
  }
}
