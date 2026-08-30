import {db} from './_db.js';
import {currentUser,isAdminUser} from './_auth.js';

async function ensureTables(){
  const s=db();
  if(!s)throw new Error('DB_NOT_CONFIGURED');
  await s`create table if not exists hwadam_notices (
    id bigserial primary key,
    title text not null,
    body text not null,
    is_pinned boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`;
  await s`create table if not exists hwadam_inquiries (
    id bigserial primary key,
    user_id bigint not null references hwadam_users(id) on delete cascade,
    subject text not null,
    body text not null,
    status text not null default '접수',
    reply text,
    created_at timestamptz not null default now(),
    replied_at timestamptz
  )`;
  await s`create index if not exists hwadam_inquiries_user_idx on hwadam_inquiries(user_id,created_at desc)`;
  return s;
}

export default async function handler(req,res){
  try{
    const s=await ensureTables();
    const action=String(req.query?.action||'notices');
    const user=await currentUser(req);
    const admin=isAdminUser(user);

    if(req.method==='GET'&&action==='notices'){
      const rows=await s`select id,title,body,is_pinned,created_at,updated_at from hwadam_notices order by is_pinned desc, created_at desc limit 50`;
      return res.status(200).json({ok:true,notices:rows,admin});
    }
    if(req.method==='GET'&&action==='inquiries'){
      if(!user)return res.status(401).json({ok:false,error:'LOGIN_REQUIRED'});
      const rows=admin
        ? await s`select q.id,q.user_id,u.name,u.phone,q.subject,q.body,q.status,q.reply,q.created_at,q.replied_at from hwadam_inquiries q join hwadam_users u on u.id=q.user_id order by q.created_at desc limit 200`
        : await s`select id,subject,body,status,reply,created_at,replied_at from hwadam_inquiries where user_id=${user.id} order by created_at desc limit 100`;
      return res.status(200).json({ok:true,inquiries:rows,admin});
    }
    if(req.method==='POST'&&action==='notice'){
      if(!user||!admin)return res.status(403).json({ok:false,error:'ADMIN_ONLY'});
      const title=String(req.body?.title||'').trim().slice(0,120),body=String(req.body?.body||'').trim().slice(0,5000),pinned=!!req.body?.isPinned;
      if(!title||!body)return res.status(400).json({ok:false,error:'EMPTY_NOTICE'});
      const rows=await s`insert into hwadam_notices(title,body,is_pinned) values(${title},${body},${pinned}) returning id,title,body,is_pinned,created_at`;
      return res.status(200).json({ok:true,notice:rows[0]});
    }
    if(req.method==='POST'&&action==='inquiry'){
      if(!user)return res.status(401).json({ok:false,error:'LOGIN_REQUIRED'});
      const subject=String(req.body?.subject||'').trim().slice(0,120),body=String(req.body?.body||'').trim().slice(0,5000);
      if(!subject||!body)return res.status(400).json({ok:false,error:'EMPTY_INQUIRY'});
      const rows=await s`insert into hwadam_inquiries(user_id,subject,body) values(${user.id},${subject},${body}) returning id,subject,body,status,created_at`;
      return res.status(200).json({ok:true,inquiry:rows[0]});
    }
    if(req.method==='PATCH'&&action==='reply'){
      if(!user||!admin)return res.status(403).json({ok:false,error:'ADMIN_ONLY'});
      const id=Number(req.body?.id||0),reply=String(req.body?.reply||'').trim().slice(0,5000);
      if(!id||!reply)return res.status(400).json({ok:false,error:'INVALID_REPLY'});
      await s`update hwadam_inquiries set reply=${reply},status='답변완료',replied_at=now() where id=${id}`;
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
  }catch(e){console.error(e);return res.status(500).json({ok:false,error:'SUPPORT_FAILED'});}
}
