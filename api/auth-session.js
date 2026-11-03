import { db } from './_db.js';
import { cookie, hashToken, clearSessionCookie, currentUser, isAdminUser, normalizePhone, normalizeEmail, validEmail, verifyPassword, createSession, setSessionCookie, ensureAuthTables, ensurePasswordResetTable, ensureEmailResetTable, validPhone, hashPassword } from './_auth.js';
import { randomBytes, createHash } from 'node:crypto';

export default async function handler(req,res){
  const action=String(req.query?.action||req.body?.action||'').trim();

  if(req.method==='GET'&&action==='signup-stats'){
    const s=db();
    if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
    try{
      const user=await currentUser(req);
      if(!user||!isAdminUser(user))return res.status(403).json({ok:false,error:'ADMIN_REQUIRED'});
      await ensureAuthTables();
      const rows=await s`
        select
          count(*) filter (where created_at::date=current_date)::int as today,
          count(*) filter (where created_at>=current_date-6)::int as last7,
          count(*)::int as total
        from hwadam_users
      `;
      return res.status(200).json({ok:true,stats:rows[0]||{today:0,last7:0,total:0}});
    }catch(e){console.error('signup-stats',e);return res.status(500).json({ok:false,error:'STATS_FAILED'})}
  }

  if(req.method==='POST'&&action==='forgot-email'){
    const s=db();
    if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
    const apiKey=String(process.env.RESEND_API_KEY||'').trim();
    const from=String(process.env.RESEND_FROM_EMAIL||'').trim();
    if(!apiKey||!from)return res.status(503).json({ok:false,error:'EMAIL_NOT_CONFIGURED'});
    try{
      await ensureEmailResetTable();
      const email=normalizeEmail(req.body?.email);
      if(!validEmail(email))return res.status(400).json({ok:false,error:'EMAIL_INVALID'});
      const rows=await s`select id,name,email from hwadam_users where email=${email} limit 1`;
      if(!rows[0])return res.status(200).json({ok:true,message:'가입된 이메일이라면 재설정 링크를 발송했습니다.'});
      const token=randomBytes(32).toString('hex');
      const tokenHash=createHash('sha256').update(token).digest('hex');
      const expires=new Date(Date.now()+30*60*1000).toISOString();
      await s`insert into hwadam_email_reset_tokens(user_id,token_hash,expires_at) values(${rows[0].id},${tokenHash},${expires})`;
      const origin='https://화담철학관.com';
      const resetUrl=origin+'/password-reset.html?token='+encodeURIComponent(token);
      const rr=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({from,to:[email],subject:'화담철학관 비밀번호 재설정',html:`<div style="font-family:sans-serif;line-height:1.7"><h2>화담철학관 비밀번호 재설정</h2><p>${rows[0].name||'회원'}님, 아래 버튼을 눌러 새 비밀번호를 설정해 주세요.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#20352d;color:#fff;text-decoration:none;border-radius:10px">비밀번호 재설정</a></p><p>이 링크는 30분 동안 유효합니다.</p></div>`})});
      if(!rr.ok){let ej={};try{ej=await rr.json()}catch{}console.error('forgot-email-send',rr.status,ej);return res.status(502).json({ok:false,error:'EMAIL_SEND_FAILED'})}
      return res.status(200).json({ok:true,message:'재설정 링크를 이메일로 보냈습니다.'});
    }catch(e){
      console.error('forgot-email',e);
      return res.status(500).json({ok:false,error:'EMAIL_SEND_FAILED'});
    }
  }

  if(req.method==='POST'&&action==='reset-email'){
    const s=db();
    if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
    try{
      await ensureEmailResetTable();
      const token=String(req.body?.token||''),pw=String(req.body?.newPassword||'');
      if(token.length<20)return res.status(400).json({ok:false,error:'RESET_TOKEN_INVALID'});
      if(pw.length<8)return res.status(400).json({ok:false,error:'PASSWORD_TOO_SHORT'});
      const tokenHash=createHash('sha256').update(token).digest('hex');
      const rows=await s`select id,user_id from hwadam_email_reset_tokens where token_hash=${tokenHash} and used_at is null and expires_at>now() limit 1`;
      if(!rows[0])return res.status(400).json({ok:false,error:'RESET_TOKEN_INVALID'});
      const {salt,hash}=hashPassword(pw),uid=rows[0].user_id;
      await s.begin(async tx=>{
        await tx`update hwadam_users set password_salt=${salt},password_hash=${hash} where id=${uid}`;
        await tx`delete from hwadam_sessions where user_id=${uid}`;
        await tx`update hwadam_email_reset_tokens set used_at=now() where id=${rows[0].id}`;
      });
      return res.status(200).json({ok:true});
    }catch(e){
      console.error('reset-email',e);
      return res.status(500).json({ok:false,error:'RESET_EMAIL_FAILED'});
    }
  }

  if(req.method==='GET'){
    try{
      const user=await currentUser(req);
      return res.status(200).json({ok:true,user:user||null,isAdmin:isAdminUser(user)});
    }catch(e){
      console.error(e);
      return res.status(500).json({ok:false,error:'ME_FAILED',user:null,isAdmin:false});
    }
  }

  if(req.method==='POST'&&action==='reset-request'){
    const s=db();
    if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
    try{
      const {name,phone,birthDate}=req.body||{};
      const p=normalizePhone(phone),n=String(name||'').trim(),bd=String(birthDate||'').trim();
      if(!n||!validPhone(p)||!/\d{4}-\d{2}-\d{2}/.test(bd))return res.status(400).json({ok:false,error:'RESET_INFO_REQUIRED'});
      await ensurePasswordResetTable();
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

  if(req.method==='POST'&&action==='change-password'){
    const s=db();
    if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
    try{
      const u=await currentUser(req);
      if(!u)return res.status(401).json({ok:false,error:'LOGIN_REQUIRED'});
      const {currentPassword,newPassword}=req.body||{};
      const rows=await s`select id,password_salt,password_hash from hwadam_users where id=${u.id} limit 1`;
      const row=rows[0];
      if(!row||!verifyPassword(currentPassword,row.password_salt,row.password_hash))return res.status(400).json({ok:false,error:'CURRENT_PASSWORD_INVALID'});
      const pw=String(newPassword||'');
      if(pw.length<8)return res.status(400).json({ok:false,error:'PASSWORD_TOO_SHORT'});
      const {salt,hash}=hashPassword(pw);
      await s`update hwadam_users set password_salt=${salt},password_hash=${hash} where id=${u.id}`;
      return res.status(200).json({ok:true});
    }catch(e){
      console.error('change-password',e);
      return res.status(500).json({ok:false,error:'PASSWORD_CHANGE_FAILED'});
    }
  }

  if(req.method==='POST'&&action==='login'){
    const s=db();
    if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
    try{
      const {phone,password}=req.body||{},p=normalizePhone(phone);
      const rows=await s`select id,name,email,phone,birth_date,gender,password_salt,password_hash from hwadam_users where phone=${p} limit 1`;
      const u=rows[0];
      if(!u||!verifyPassword(password,u.password_salt,u.password_hash))return res.status(401).json({ok:false,error:'LOGIN_INVALID'});
      const session=await createSession(u.id);
      setSessionCookie(res,session.token,session.expires);
      delete u.password_salt;delete u.password_hash;
      return res.status(200).json({ok:true,user:u});
    }catch(e){console.error(e);return res.status(500).json({ok:false,error:'LOGIN_FAILED'})}
  }

  if(req.method==='POST'&&action==='signup'){
    const s=db();
    if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
    try{
      await ensureAuthTables();
      const {name,email,password,newPassword,phone,birthDate,gender,calendarType,agree}=req.body||{};
      const p=normalizePhone(phone),em=normalizeEmail(email),cal=calendarType==='lunar'?'lunar':'solar',chosen=String(newPassword||password||'');
      const cleanName=String(name||'').trim(),cleanGender=String(gender||'').trim()||null;
      if(!cleanName)return res.status(400).json({ok:false,error:'NAME_REQUIRED'});
      if(!validPhone(p))return res.status(400).json({ok:false,error:'PHONE_INVALID'});
      if(!validEmail(em))return res.status(400).json({ok:false,error:'EMAIL_INVALID'});
      if(chosen.length<8)return res.status(400).json({ok:false,error:'PASSWORD_TOO_SHORT'});
      if(!agree)return res.status(400).json({ok:false,error:'AGREEMENT_REQUIRED'});
      const exists=await s`select id from hwadam_users where phone=${p} or email=${em} limit 1`;
      if(exists.length)return res.status(409).json({ok:false,error:'ACCOUNT_EXISTS'});
      const {salt,hash}=hashPassword(chosen);
      const rows=await s`insert into hwadam_users(name,email,phone,birth_date,gender,calendar_type,password_salt,password_hash) values(${cleanName},${em},${p},${birthDate||null},${cleanGender},${cal},${salt},${hash}) returning id,name,email,phone,birth_date,gender,calendar_type`;
      const u=rows[0],session=await createSession(u.id);
      setSessionCookie(res,session.token,session.expires);
      return res.status(200).json({ok:true,user:u});
    }catch(e){console.error('auth-signup',e);return res.status(500).json({ok:false,error:'SIGNUP_FAILED'})}
  }

  if(req.method==='POST'){
    try{
      const token=cookie(req,'hwadam_session'),s=db();
      if(token&&s)await s`delete from hwadam_sessions where token_hash=${hashToken(token)}`;
      clearSessionCookie(res);
      return res.status(200).json({ok:true});
    }catch(e){
      console.error(e);
      clearSessionCookie(res);
      return res.status(200).json({ok:true});
    }
  }
  return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
}
