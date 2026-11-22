(function(){
'use strict';
function category(t){
 if(/재물|재고|돈|재정|수입|사업|직업/.test(t))return ['재물·활동','wealth'];
 if(/천을귀인|귀인|협력|인연|가족|배우자/.test(t))return ['귀인·인연','fortune'];
 if(/조후|오행|균형|대운|세운|월운|준비/.test(t))return ['운의 흐름','balance'];
 if(/주의|충돌|갈등|건강|위험|점검/.test(t))return ['생활 조언','caution'];
 return ['사주 해석','general'];
}
function render(raw){
 const root=document.createElement('div');root.className='hwadam-color-report';
 const chunks=String(raw||'').replace(/\r/g,'').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
 let n=0;
 for(const chunk of chunks){
  const lines=chunk.split('\n').map(s=>s.trim()).filter(Boolean);
  if(!lines.length)continue;
  const title=lines[0].replace(/^#{1,4}\s*/,'').replace(/^\*\*(.*?)\*\*$/,'$1');
  const isHeading=/^#{1,4}\s/.test(lines[0])||(/^(?:\d+[.)]\s*)?(?:핵심 결론|명리학적 근거|현실적 변화|화담 조언|총평|평생운세|대운|세운|월운|\d+월|\d+분기|재물운|직업운|건강운|귀인운|결혼운|상담 결과)/.test(title)&&title.length<65);
  const card=document.createElement('section');const [label,kind]=category(chunk);card.className='hwadam-reading-card '+kind;
  const badge=document.createElement('span');badge.className='hwadam-reading-tag';badge.textContent=label;card.appendChild(badge);
  if(isHeading){const h=document.createElement('h3');h.textContent=title;card.appendChild(h)}
  const body=document.createElement('div');body.className='hwadam-reading-body';
  const remaining=isHeading?lines.slice(1):lines;
  for(const line of remaining){
    const p=document.createElement('p');
    const m=line.match(/^(핵심 결론|명리학적 근거|현실적 변화|화담 조언|운세|조언|역할|현실적 변화|명리학적 해석)\s*[:：]\s*(.*)$/);
    if(m){const strong=document.createElement('strong');strong.textContent=m[1]+' · ';p.appendChild(strong);p.appendChild(document.createTextNode(m[2]))}
    else{p.textContent=line.replace(/^[-•]\s*/,'• ').replace(/\*\*/g,'')}
    body.appendChild(p);
  }
  if(!remaining.length&&!isHeading){const p=document.createElement('p');p.textContent=chunk;body.appendChild(p)}
  card.appendChild(body);root.appendChild(card);n++;
 }
 if(!n){const p=document.createElement('p');p.textContent=String(raw||'');root.appendChild(p)}
 return root;
}
window.hwadamColorReport={render};
})();