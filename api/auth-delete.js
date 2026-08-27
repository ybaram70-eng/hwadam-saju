import { db } from './_db.js';
import { currentUser, clearSessionCookie, ensureAuthTables } from './_auth.js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  try{
    const user=await currentUser(req);
    if(!user) return res.status(401).json({error:'LOGIN_REQUIRED'});
    const s=db();
    if(!s) return res.status(503).json({error:'DB_NOT_CONFIGURED'});
    await ensureAuthTables();
    const phone=user.phone||null;
    await s.begin(async sql=>{
      if(phone) await sql`insert into hwadam_deleted_members(phone,deleted_at) values(${phone},now()) on conflict(phone) do update set deleted_at=excluded.deleted_at`;
      await sql`delete from hwadam_sessions where user_id=${user.id}`;
      await sql`delete from hwadam_users where id=${user.id}`;
    });
    clearSessionCookie(res);
    return res.status(200).json({ok:true,rejoinAllowed:true,phoneReleased:!!phone});
  }catch(e){
    console.error('auth-delete',e);
    return res.status(500).json({error:'DELETE_FAILED'});
  }
}
