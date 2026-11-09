const crypto=require('node:crypto');
const postgres=require('postgres');
let sql=null;
function db(){const url=process.env.POSTGRES_URL||process.env.DATABASE_URL||process.env.POSTGRES_URL_NON_POOLING||'';if(!url)return null;if(!sql)sql=postgres(url,{ssl:'require',max:1,prepare:false,connect_timeout:5,idle_timeout:20});return sql}
async function getEntitlement(reportId){const s=db();if(!s)return null;const rows=await s`select report_id,order_id,amount,payment_status from hwadam_report_entitlements where report_id=${reportId} limit 1`;return rows[0]||null}
async function currentUser(req){const raw=req.headers?.cookie||'';const part=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith('hwadam_session='));if(!part)return null;const token=part.slice('hwadam_session='.length);const s=db();if(!s)return null;const hash=crypto.createHash('sha256').update(token).digest('hex');const rows=await s`select u.phone from hwadam_sessions ss join hwadam_users u on u.id=ss.user_id where ss.token_hash=${hash} and ss.expires_at>now() limit 1`;return rows[0]||null}
function isAdminUser(user){if(!user?.phone)return false;const phone=String(user.phone).replace(/\D/g,'');return crypto.createHash('sha256').update('hwadam-admin-v1:'+phone).digest('hex')==='9a04a23863306bed15abc362c442c9e9d2a5fba058cba93f2481d892db4b72b9'}
const PRODUCTS={
  'yongsin':5900,
  'annual-fortune':9900,
  'money-business':5900,
  'compatibility':7900,
  'comprehensive':9900,
  'lifetime-fortune':14900,
  'palm-detail':5900,
  'palm-saju':9900,
  'face-detail':5900,
  'face-saju':9900
};
function safeEq(a,b){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'POST 요청만 지원합니다.'});
  try{
    const token=String(req.body?.token||''),reportId=String(req.body?.reportId||'');
    // Token-based purchases must not wait for a potentially stalled session database.
    if(!token){const user=await Promise.race([currentUser(req).catch(()=>null),new Promise(resolve=>setTimeout(()=>resolve(null),2500))]);
    if(user&&isAdminUser(user)){
      return res.status(200).json({ok:true,admin:true,reportId:String(req.body?.reportId||''),productId:'admin'});
    }
    }
    const secret=process.env.TOSS_SECRET_KEY||'';
    if(!secret)return res.status(503).json({ok:false,error:'결제 서버 설정이 아직 완료되지 않았습니다.'});
    const [body,sig]=token.split('.');
    if(!body||!sig||!reportId)return res.status(400).json({ok:false,error:'리포트 이용권 정보가 없습니다.'});
    const expectedSig=crypto.createHmac('sha256',secret).update(body).digest('base64url');
    if(!safeEq(sig,expectedSig))return res.status(403).json({ok:false,error:'유효하지 않은 리포트 이용권입니다.'});
    const payload=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));
    const base=payload?.v===2?PRODUCTS[payload?.productId]:0;
    const validAmounts=base?[Number(base),Math.floor(Number(base)/2)]:[2950,3950,4950,7450,5900,7900,9900,14900];
    const paidAmount=Number(payload?.amount);
    if(![1,2].includes(payload?.v)||payload?.reportId!==reportId||!validAmounts.includes(paidAmount))return res.status(403).json({ok:false,error:'이 리포트에 사용할 수 없는 이용권입니다.'});
    // A DONE row is written only after Toss confirms the payment in /api/payment-confirm.
    // Prefer the persisted confirmation for report reads: repeated Toss lookups may
    // return errors after payment and must not block an already paid customer.
    if(process.env.POSTGRES_URL||process.env.DATABASE_URL){
      const row=await Promise.race([getEntitlement(reportId),new Promise((_,reject)=>setTimeout(()=>reject(new Error('DB_TIMEOUT')),4000))]);
      if(!row||row.payment_status!=='DONE'||Number(row.amount)!==paidAmount||row.order_id!==payload.orderId)return res.status(403).json({ok:false,error:'서버 결제기록을 확인할 수 없습니다.'});
      return res.status(200).json({ok:true,reportId:payload.reportId,orderId:payload.orderId,approvedAt:payload.approvedAt,productId:payload.productId||'',source:'confirmed-payment-record'});
    }
    const auth=Buffer.from(secret+':').toString('base64');
    const pr=await fetch('https://api.tosspayments.com/v1/payments/orders/'+encodeURIComponent(payload.orderId),{headers:{Authorization:'Basic '+auth},signal:AbortSignal.timeout(6000)});
    const pay=await pr.json().catch(()=>({}));
    if(!pr.ok||pay.status!=='DONE'||Number(pay.totalAmount)!==paidAmount)return res.status(403).json({ok:false,error:'현재 유효한 결제 상태를 확인할 수 없습니다.'});
    return res.status(200).json({ok:true,reportId:payload.reportId,orderId:payload.orderId,approvedAt:payload.approvedAt,productId:payload.productId||''});
  }catch(e){const slow=e?.name==='TimeoutError'||e?.name==='AbortError'||e?.message==='DB_TIMEOUT';return res.status(slow?503:400).json({ok:false,error:slow?'결제 확인 서버 연결이 지연되고 있습니다. 다시 결제하지 마시고 잠시 후 다시 시도해 주세요.':'리포트 이용권을 확인할 수 없습니다.'})}
}
