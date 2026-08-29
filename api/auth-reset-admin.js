import { db } from './_db.js';
import { currentUser, ensurePasswordResetTable, hashPassword, isAdminUser } from './_auth.js';

export default async function handler(req,res){
  const s=db();
  if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
  try{
    await ensurePasswordResetTable();
    const admin=await currentUser(req);
    if(!isAdminUser(admin))return res.status(403).json({ok:false,error:'ADMIN_REQUIRED'});
    if(req.method==='GET'){
      const rows=await s`select r.id,r.requested_at,u.name,u.phone,u.birth_date from hwadam_password_reset_requests r join hwadam_users u on u.id=r.user_id where r.status='pending' order by r.requested_at desc limit 50`;
      return res.status(200).json({ok:true,requests:rows});
    }
    if(req.method==='POST'){
      const id=Number(req.body?.id),password=String(req.body?.temporaryPassword||'');
      if(!Number.isSafeInteger(id)||password.length<8)return res.status(400).json({ok:false,error:'TEMP_PASSWORD_INVALID'});
      const rows=await s`select user_id from hwadam_password_reset_requests where id=${id} and status='pending' limit 1`;
      if(!rows[0])return res.status(404).json({ok:false,error:'RESET_REQUEST_NOT_FOUND'});
      const {salt,hash}=hashPassword(password),userId=rows[0].user_id;
      await s.begin(async tx=>{
        await tx`update hwadam_users set password_salt=${salt},password_hash=${hash} where id=${userId}`;
        await tx`delete from hwadam_sessions where user_id=${userId}`;
        await tx`update hwadam_password_reset_requests set status='completed',completed_at=now(),completed_by=${admin.id} where id=${id}`;
      });
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
  }catch(e){
    console.error('auth-reset-admin',e);
    return res.status(500).json({ok:false,error:'RESET_ADMIN_FAILED'});
  }
}
