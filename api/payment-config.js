const PRODUCTS={
  'money-business':{name:'재물·사업 상담',amount:5900},
  'compatibility':{name:'궁합 상담',amount:7900},
  'comprehensive':{name:'종합 사주 상담',amount:9900}
};
export default function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'GET 요청만 지원합니다.'});
  const clientKey=process.env.TOSS_CLIENT_KEY||'';
  const productId=String(req.query?.productId||'comprehensive');
  const product=PRODUCTS[productId]||PRODUCTS.comprehensive;
  res.status(200).json({enabled:!!clientKey,clientKey,productId:PRODUCTS[productId]?productId:'comprehensive',amount:product.amount,currency:'KRW',orderName:`화담 ${product.name}`,productName:product.name});
}
