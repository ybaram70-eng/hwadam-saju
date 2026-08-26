import { db } from './_db.js';
import { cookie, hashToken, clearSessionCookie } from './_auth.js';
export default async function handler(req,res){if(req.method!=='POST')return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});try{const token=cookie(req,'hwadam_session'),s=db();if(token&&s)await s`delete from hwadam_sessions where token_hash=${hashToken(token)}`;clearSessionCookie(res);return res.status(200).json({ok:true})}catch(e){console.error(e);clearSessionCookie(res);return res.status(200).json({ok:true})}}
