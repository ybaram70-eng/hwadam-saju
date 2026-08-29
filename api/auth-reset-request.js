import { db } from './_db.js';
import { ensurePasswordResetTable, normalizePhone, validPhone } from './_auth.js';

function normDate(v){
  const m=String(v||'').match(/(\d{4})-(\d{2})-(\d{2})/);
  return m?`${m[1]}-${m[2]}-${m[3]}`:'';
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
  const s=db();
  if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
  try{
    await ensurePasswordResetTable();
    const {name,phone,birthDate}=req.body||{},p=normalizePhone(phone),n=String(name||'').trim(),bd=normDate(birthDate);
    if(!n||!validPhone(p)||!bd)return res.status(400).json({ok:false,error:'RESET_INFO_REQUIRED'});
    const rows=await s`select id from hwadam_users where phone=${p} and name=${n} and birth_date=${bd} limit 1`;
    if(rows[0]){
      const old=await s`select id from hwadam_password_reset_requests where user_id=${rows[0].id} and status='pending' limit 1`;
      if(!old.length)await s`insert into hwadam_password_reset_requests(user_id) values(${rows[0].id})`;
    }
    return res.status(200).json({ok:true,message:'관리자 확인 요청이 접수되었습니다.'});
  }catch(e){
    console.error('auth-reset-request',e);
    return res.status(500).json({ok:false,error:'RESET_REQUEST_FAILED'});
  }
}
