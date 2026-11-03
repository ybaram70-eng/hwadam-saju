export default function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'GET_ONLY'});
  const client=String(process.env.TOSS_CLIENT_KEY||'');
  const secret=String(process.env.TOSS_SECRET_KEY||'');
  const clientMode=client.startsWith('test_')?'test':client.startsWith('live_')?'live':'unknown';
  const secretMode=secret.startsWith('test_sk_')?'test':secret.startsWith('live_sk_')?'live':'unknown';
  const configured=!!client&&!!secret;
  const matched=configured&&clientMode!=='unknown'&&clientMode===secretMode;
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({ok:matched,configured,clientMode,secretMode,matched});
}