import { db } from './_db.js';
import { ensureAuthTables, normalizePhone, validPhone, hashPassword, verifyPassword, createSession, setSessionCookie } from './_auth.js';

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
  const s=db();
  if(!s)return res.status(503).json({ok:false,error:'DB_NOT_CONFIGURED'});
  try{
    await ensureAuthTables();
    const {name,password,phone,birthDate,gender,calendarType,agree}=req.body||{};
    const p=normalizePhone(phone),cal=calendarType==='lunar'?'lunar':'solar';
    if(!String(name||'').trim())return res.status(400).json({ok:false,error:'NAME_REQUIRED'});
    if(!validPhone(p))return res.status(400).json({ok:false,error:'PHONE_INVALID'});
    if(String(password||'').length<8)return res.status(400).json({ok:false,error:'PASSWORD_TOO_SHORT'});
    if(!agree)return res.status(400).json({ok:false,error:'AGREEMENT_REQUIRED'});

    const exists=await s`select id,name,email,phone,birth_date,gender,calendar_type,password_salt,password_hash from hwadam_users where phone=${p} limit 1`;
    if(exists.length){
      const old=exists[0];
      if(!verifyPassword(password,old.password_salt,old.password_hash)){
        return res.status(409).json({ok:false,error:'REJOIN_PASSWORD_MISMATCH'});
      }
      const {salt,hash}=hashPassword(password);
      const rows=await s`update hwadam_users set name=${String(name).trim()},birth_date=${birthDate||null},gender=${String(gender||'').trim()||null},calendar_type=${cal},password_salt=${salt},password_hash=${hash} where id=${old.id} returning id,name,email,phone,birth_date,gender,calendar_type`;
      await s`delete from hwadam_sessions where user_id=${old.id}`;
      const u=rows[0],session=await createSession(u.id);
      setSessionCookie(res,session.token,session.expires);
      return res.status(200).json({ok:true,user:u,reRegistered:true});
    }

    const {salt,hash}=hashPassword(password);
    const rows=await s`insert into hwadam_users(name,email,phone,birth_date,gender,calendar_type,password_salt,password_hash) values(${String(name).trim()},${null},${p},${birthDate||null},${String(gender||'').trim()||null},${cal},${salt},${hash}) returning id,name,email,phone,birth_date,gender,calendar_type`;
    const u=rows[0],session=await createSession(u.id);
    setSessionCookie(res,session.token,session.expires);
    return res.status(200).json({ok:true,user:u});
  }catch(e){
    console.error(e);
    return res.status(500).json({ok:false,error:'SIGNUP_FAILED'});
  }
}
