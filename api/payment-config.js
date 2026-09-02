const PRODUCTS={
  'annual-membership':{name:'1년 회원권',amount:55000},
  'yongsin':{name:'개인 용신 분석',amount:5900},
  'annual-fortune':{name:'1년 신년운세',amount:9900},
  'money-business':{name:'재물·사업 상담',amount:5900},
  'compatibility':{name:'궁합 상담',amount:7900},
  'comprehensive':{name:'정식 상담 리포트',amount:9900},
  'lifetime-fortune':{name:'평생운세 장문 리포트',amount:14900}
};
export default function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'GET 요청만 지원합니다.'});
  const clientKey=process.env.TOSS_CLIENT_KEY||'';
  const productId=String(req.query?.productId||'comprehensive');
  const product=PRODUCTS[productId]||PRODUCTS.comprehensive;
  const mode=clientKey.startsWith('test_')?'test':clientKey.startsWith('live_')?'live':'unknown';
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.status(200).json({enabled:!!clientKey,clientKey,mode,isTest:mode==='test',productId:PRODUCTS[productId]?productId:'comprehensive',amount:product.amount,currency:'KRW',orderName:`화담 ${product.name}`,productName:product.name});
}
