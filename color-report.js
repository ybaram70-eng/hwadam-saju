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
 const lines=String(raw||'').replace(/\r/g,'').split('\n').map(s=>s.trim());
 let card=null,body=null,count=0;
 function section(title){
  card=document.createElement('section');card.className='hwadam-reading-card';
  const h=document.createElement('h3');h.textContent=title;card.appendChild(h);
  body=document.createElement('div');body.className='hwadam-reading-body';card.appendChild(body);
  root.appendChild(card);count++;
 }
 function paragraph(line){
  if(!line)return;
  const cleaned=line.replace(/^#{1,5}\s*/,'').replace(/\*\*/g,'');
  const match=cleaned.match(/^(핵심 결론|명리학적 근거|현실적 변화|화담 조언)\s*[:：]?\s*(.*)$/);
  if(match){
   const p=document.createElement('p');p.className='hwadam-reading-point';
   const label=document.createElement('strong');label.textContent=match[1]+':';label.dataset.kind=({'핵심 결론':'conclusion','명리학적 근거':'basis','현실적 변화':'change','화담 조언':'advice'})[match[1]];
   p.appendChild(label);if(match[2])p.appendChild(document.createTextNode(' '+match[2]));body.appendChild(p);
  }else{
   const p=document.createElement('p');p.textContent=cleaned.replace(/^[-•]\s*/,'• ');body.appendChild(p);
  }
 }
 for(const line of lines){
  if(!line)continue;
  const cleaned=line.replace(/^#{1,5}\s*/,'').replace(/\*\*/g,'');
  if(/^\d{1,2}[.)]\s*\S/.test(cleaned)){section(cleaned);continue;}
  if(!card)section('사주풀이');
  paragraph(line);
 }
 if(!count)section('사주풀이');
 return root;
}
window.hwadamColorReport={render};
})();