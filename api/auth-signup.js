import { db } from './_db.js';
import { ensureAuthTables, normalizePhone, validPhone, hashPassword, verifyPassword, createSession, setSessionCookie } from './_auth.js';

function normDate(v){
  if(!v)return '';
  if(v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0,10);
  const s=String(v);
  const m=s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if(m)return `${m[1]}-${m[2]}-${m[3]}`;
  const dt=new Date(v);
  return Number.isNaN(dt.getTime())?'':dt.toISOString().slice(0,10);
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
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

    const exists=await s`select id,name,email,phone,birth_date,gender,calendar_type,password_salt,password_hash from hwadam_users where phone=${p} limit 1`;
    if(exists.length)return res.status(409).json({ok:false,error:'PHONE_EXISTS'});

    const {salt,hash}=hashPassword(chosen);
    const rows=await s`insert into hwadam_users(name,email,phone,birth_date,gender,calendar_type,password_salt,password_hash) values(${cleanName},${null},${p},${birthDate||null},${cleanGender},${cal},${salt},${hash}) returning id,name,email,phone,birth_date,gender,calendar_type`;
    const u=rows[0],session=await createSession(u.id);
    setSessionCookie(res,session.token,session.expires);
    return res.status(200).json({ok:true,user:u});
  }catch(e){
    console.error('auth-signup',e);
    return res.status(500).json({ok:false,error:'SIGNUP_FAILED'});
  }
}
