import crypto from 'node:crypto';
import {saveEntitlement} from './_db.js';
const PRODUCTS={
  'money-business':{name:'재물·사업 상담',amount:5900},
  'compatibility':{name:'궁합 상담',amount:7900},
  'comprehensive':{name:'종합 사주 상담',amount:9900}
};
function b64url(v){return Buffer.from(v).toString('base64url')}
function sign(payload,secret){const body=b64url(JSON.stringify(payload));const sig=crypto.createHmac('sha256',secret).update(body).digest('base64url');return body+'.'+sig}
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'POST 요청만 지원합니다.'});
  const secret=process.env.TOSS_SECRET_KEY||'';
  if(!secret)return res.status(503).json({error:'결제 서버 설정이 아직 완료되지 않았습니다.'});
  const mode=secret.startsWith('test_sk_')?'test':secret.startsWith('live_sk_')?'live':'unknown';
  try{
    const {paymentKey,orderId,amount,reportId,productId}=req.body||{};
    const pid=String(productId||'comprehensive');
    const product=PRODUCTS[pid];
    if(!product)return res.status(400).json({error:'상담 상품 정보가 올바르지 않습니다.'});
    const expected=product.amount;
    if(!paymentKey||!orderId||!amount||!reportId)return res.status(400).json({error:'결제 승인 정보가 부족합니다.'});
    if(!/^RPT-[A-Za-z0-9_-]{10,80}$/.test(String(reportId)))return res.status(400).json({error:'리포트 식별값이 올바르지 않습니다.'});
    if(Number(amount)!==expected)return res.status(400).json({error:'결제 금액이 일치하지 않습니다.'});
    const auth=Buffer.from(secret+':').toString('base64');
    const r=await fetch('https://api.tosspayments.com/v1/payments/confirm',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Basic '+auth,'Idempotency-Key':orderId},body:JSON.stringify({paymentKey,orderId,amount:expected})});
    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data?.message||'결제 승인에 실패했습니다.',code:data?.code||''});
    if(data.status!=='DONE'||Number(data.totalAmount)!==expected)return res.status(400).json({error:'결제 승인 상태를 확인할 수 없습니다.'});
    const approvedAt=data.approvedAt||new Date().toISOString();
    try{await saveEntitlement({reportId:String(reportId),orderId:data.orderId,amount:expected,approvedAt,status:data.status})}catch(dbErr){console.error('entitlement save failed',dbErr)}
    const payload={v:2,reportId:String(reportId),orderId:data.orderId,amount:expected,productId:pid,approvedAt};
    const entitlementToken=sign(payload,secret);
    return res.status(200).json({ok:true,paymentKey:data.paymentKey,orderId:data.orderId,status:data.status,totalAmount:data.totalAmount,approvedAt:data.approvedAt,method:data.method,reportId,productId:pid,productName:product.name,mode,isTest:mode==='test',entitlementToken});
  }catch(e){return res.status(500).json({error:e?.message||String(e)})}
}
