import { db } from './_db.js';
import { cookie, hashToken, clearSessionCookie, currentUser, isAdminUser, normalizePhone, verifyPassword, createSession, setSessionCookie, ensureAuthTables, validPhone, hashPassword } from './_auth.js';

export default async function handler(req,res){
  const action=String(req.query?.action||req.body?.action||'').trim();

  if(req.method==='GET'){
    try{
      const user=await currentUser(req);
      return res.status(200).json({ok:true,user:user||null,isAdmin:isAdminUser(user)});
    }catch(e){
      console.error(e);
      return res.status(500).json({ok:false,error:'ME_FAILED',user:null,isAdmin:false});
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
      const {name,password,newPassword,phone,birthDate,gender,calendarType,agree}=req.body||{};
      const p=normalizePhone(phone),cal=calendarType==='lunar'?'lunar':'solar',chosen=String(newPassword||password||'');
      const cleanName=String(name||'').trim(),cleanGender=String(gender||'').trim()||null;
      if(!cleanName)return res.status(400).json({ok:false,error:'NAME_REQUIRED'});
      if(!validPhone(p))return res.status(400).json({ok:false,error:'PHONE_INVALID'});
      if(chosen.length<8)return res.status(400).json({ok:false,error:'PASSWORD_TOO_SHORT'});
      if(!agree)return res.status(400).json({ok:false,error:'AGREEMENT_REQUIRED'});
      const exists=await s`select id from hwadam_users where phone=${p} limit 1`;
      if(exists.length)return res.status(409).json({ok:false,error:'PHONE_EXISTS'});
      const {salt,hash}=hashPassword(chosen);
      const rows=await s`insert into hwadam_users(name,email,phone,birth_date,gender,calendar_type,password_salt,password_hash) values(${cleanName},${null},${p},${birthDate||null},${cleanGender},${cal},${salt},${hash}) returning id,name,email,phone,birth_date,gender,calendar_type`;
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
