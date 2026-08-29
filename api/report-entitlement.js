import crypto from 'node:crypto';
import {getEntitlement} from './_db.js';
const PRODUCTS={
  'annual-fortune':9900,
  'money-business':5900,
  'compatibility':7900,
  'comprehensive':9900
};
function safeEq(a,b){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)}
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'POST 요청만 지원합니다.'});
  const secret=process.env.TOSS_SECRET_KEY||'';
  if(!secret)return res.status(503).json({ok:false,error:'결제 서버 설정이 아직 완료되지 않았습니다.'});
  try{
    const token=String(req.body?.token||''),reportId=String(req.body?.reportId||'');
    const [body,sig]=token.split('.');
    if(!body||!sig||!reportId)return res.status(400).json({ok:false,error:'리포트 이용권 정보가 없습니다.'});
    const expectedSig=crypto.createHmac('sha256',secret).update(body).digest('base64url');
    if(!safeEq(sig,expectedSig))return res.status(403).json({ok:false,error:'유효하지 않은 리포트 이용권입니다.'});
    const payload=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));
    const allowedAmount=payload?.v===2?PRODUCTS[payload?.productId]:[5900,7900,9900].includes(Number(payload?.amount))?Number(payload.amount):0;
    if(![1,2].includes(payload?.v)||payload?.reportId!==reportId||!allowedAmount||Number(payload?.amount)!==allowedAmount)return res.status(403).json({ok:false,error:'이 리포트에 사용할 수 없는 이용권입니다.'});
    if(process.env.POSTGRES_URL||process.env.DATABASE_URL){const row=await getEntitlement(reportId);if(!row||row.payment_status!=='DONE'||Number(row.amount)!==allowedAmount||row.order_id!==payload.orderId)return res.status(403).json({ok:false,error:'서버 결제기록을 확인할 수 없습니다.'})}
    const auth=Buffer.from(secret+':').toString('base64');
    const pr=await fetch('https://api.tosspayments.com/v1/payments/orders/'+encodeURIComponent(payload.orderId),{headers:{Authorization:'Basic '+auth}});
    const pay=await pr.json().catch(()=>({}));
    if(!pr.ok||pay.status!=='DONE'||Number(pay.totalAmount)!==allowedAmount)return res.status(403).json({ok:false,error:'현재 유효한 결제 상태를 확인할 수 없습니다.'});
    return res.status(200).json({ok:true,reportId:payload.reportId,orderId:payload.orderId,approvedAt:payload.approvedAt,productId:payload.productId||''});
  }catch(e){return res.status(400).json({ok:false,error:'리포트 이용권을 확인할 수 없습니다.'})}
}
