import {db} from './_db.js';
import {currentUser,isAdminUser} from './_auth.js';

async function ensureMembershipTable(){
  const s=db();
  if(!s)throw new Error('DB_NOT_CONFIGURED');
  await s`create table if not exists hwadam_memberships (
    user_id bigint primary key references hwadam_users(id) on delete cascade,
    plan text not null default 'annual',
    starts_at timestamptz not null default now(),
    expires_at timestamptz not null,
    status text not null default 'active',
    source text,
    order_id text,
    amount integer,
    updated_at timestamptz not null default now()
  )`;
  return s;
}

export async function getMembership(userId){
  if(!userId)return null;
  const s=await ensureMembershipTable();
  const rows=await s`select user_id,plan,starts_at,expires_at,status,source,amount from hwadam_memberships where user_id=${userId} limit 1`;
  const m=rows[0]||null;
  if(!m)return null;
  const active=m.status==='active'&&new Date(m.expires_at).getTime()>Date.now();
  return {...m,active};
}

export async function activateAnnualMembership({userId,orderId='',amount=55000,source='admin'}){
  const s=await ensureMembershipTable();
  const rows=await s`select expires_at from hwadam_memberships where user_id=${userId} limit 1`;
  const now=new Date();
  const old=rows[0]?.expires_at?new Date(rows[0].expires_at):null;
  const base=old&&old>now?old:now;
  const expires=new Date(base);
  expires.setFullYear(expires.getFullYear()+1);
  await s`insert into hwadam_memberships(user_id,plan,starts_at,expires_at,status,source,order_id,amount,updated_at)
    values(${userId},'annual',now(),${expires.toISOString()},'active',${source},${orderId||null},${amount},now())
    on conflict (user_id) do update set plan='annual',expires_at=excluded.expires_at,status='active',source=excluded.source,order_id=excluded.order_id,amount=excluded.amount,updated_at=now()`;
  return getMembership(userId);
}

export default async function handler(req,res){
  try{
    const user=await currentUser(req);
    if(!user)return res.status(401).json({ok:false,error:'LOGIN_REQUIRED'});
    if(req.method==='GET'){
      if(isAdminUser(user)){
        return res.status(200).json({ok:true,membership:{active:true,plan:'admin',source:'admin',admin:true,expires_at:null}});
      }
      const membership=await getMembership(user.id);
      return res.status(200).json({ok:true,membership:membership||{active:false,plan:null}});
    }
    if(req.method==='POST'){
      if(!isAdminUser(user))return res.status(403).json({ok:false,error:'ADMIN_ONLY'});
      const targetUserId=Number(req.body?.userId||0);
      if(!targetUserId)return res.status(400).json({ok:false,error:'USER_REQUIRED'});
      const membership=await activateAnnualMembership({userId:targetUserId,amount:55000,source:'admin'});
      return res.status(200).json({ok:true,membership});
    }
    return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
  }catch(e){console.error(e);return res.status(500).json({ok:false,error:'MEMBERSHIP_FAILED'});}
}
