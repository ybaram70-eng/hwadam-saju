import { currentUser, isAdminUser } from './_auth.js';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
  try{
    const user=await currentUser(req);
    if(!user) return res.status(200).json({ok:true,user:null,isAdmin:false});
    return res.status(200).json({ok:true,user,isAdmin:isAdminUser(user)});
  }catch(e){
    console.error(e);
    return res.status(500).json({ok:false,error:'ME_FAILED',user:null,isAdmin:false});
  }
}
