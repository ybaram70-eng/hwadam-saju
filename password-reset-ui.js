(() => {
  const d=document,$=id=>d.getElementById(id);
  function style(){
    if($('hwadam-reset-style'))return;
    const s=d.createElement('style');s.id='hwadam-reset-style';
    s.textContent=`.hdForgotBtn{border:0;background:transparent;color:#8a6427;font-size:14px;font-weight:900;text-decoration:underline;padding:8px 2px;text-align:left}.hdResetForm{display:grid;gap:10px}.hdResetForm label{font-size:14px;font-weight:850;color:#3f4b45}.hdResetForm input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #d6cdbd;border-radius:12px;background:#fff;font-size:16px}.hdResetNotice{padding:11px 12px;border-radius:11px;background:#f7f0df;color:#725820;font-size:13px;line-height:1.65}`;
    d.head.appendChild(s);
  }
  function sheet(title,body){
    $('hwadamAuthModal')?.remove();
    const x=d.createElement('div');x.id='hwadamAuthModal';x.className='hdAuthModal';
    x.innerHTML=`<div class="hdAuthSheet"><div class="hdAuthHead"><h2>${title}</h2><button class="hdAuthClose" aria-label="닫기">×</button></div>${body}</div>`;
    d.body.appendChild(x);
    x.querySelector('.hdAuthClose').onclick=()=>x.remove();
    x.onclick=e=>{if(e.target===x)x.remove()};
    return x;
  }
  function openReset(){
    const x=sheet('비밀번호 재설정',`<form class="hdResetForm"><div class="hdResetNotice">가입할 때 입력한 이름·휴대폰번호·생년월일이 모두 일치하면 새 비밀번호로 변경됩니다.</div><label>이름<input name="name" required></label><label>휴대폰번호<input name="phone" inputmode="numeric" placeholder="01012345678" required></label><label>생년월일<input name="birthDate" inputmode="numeric" maxlength="8" placeholder="예: 19651214" required></label><label>새 비밀번호<input name="newPassword" type="password" minlength="8" placeholder="8자 이상" required></label><label>새 비밀번호 확인<input name="confirmPassword" type="password" minlength="8" placeholder="한 번 더 입력" required></label><div class="hdAuthMsg"></div><button class="hdAuthSubmit">비밀번호 재설정</button></form>`);
    x.querySelector('form').onsubmit=async e=>{
      e.preventDefault();
      const form=e.currentTarget,fd=new FormData(form),msg=form.querySelector('.hdAuthMsg'),btn=form.querySelector('button');
      const digits=String(fd.get('birthDate')||'').replace(/\D/g,''),a=String(fd.get('newPassword')||''),b=String(fd.get('confirmPassword')||'');
      if(digits.length!==8){msg.textContent='생년월일 숫자 8자리를 입력해 주세요.';return}
      if(a.length<8){msg.textContent='새 비밀번호는 8자 이상 입력해 주세요.';return}
      if(a!==b){msg.textContent='새 비밀번호가 서로 다릅니다.';return}
      btn.disabled=true;msg.textContent='재설정 중…';
      try{
        const r=await fetch('/api/auth-session?action=direct-reset',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:JSON.stringify({name:fd.get('name'),phone:fd.get('phone'),birthDate:`${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`,newPassword:a})});
        let j={};try{j=await r.json()}catch{}
        if(r.ok){msg.style.color='#236646';msg.textContent='비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.';btn.style.display='none';return}
        if(j.error==='RESET_INFO_MISMATCH')msg.textContent='가입정보와 일치하지 않습니다. 이름·휴대폰번호·생년월일을 확인해 주세요.';
        else if(j.error==='PASSWORD_TOO_SHORT')msg.textContent='비밀번호는 8자 이상 입력해 주세요.';
        else msg.textContent='재설정하지 못했습니다. 입력내용을 확인해 주세요.';
        btn.disabled=false;
      }catch{
        btn.disabled=false;msg.textContent='연결이 지연되고 있습니다. 다시 눌러 주세요.';
      }
    };
  }
  function decorate(){
    style();
    const form=$('hwadamLoginForm');
    if(form&&!form.querySelector('.hdForgotBtn')){
      const b=d.createElement('button');
      b.type='button';b.className='hdForgotBtn';b.textContent='비밀번호를 잊으셨나요? 바로 재설정';
      b.onclick=openReset;
      form.querySelector('.hdAuthSubmit')?.insertAdjacentElement('afterend',b);
    }
  }
  function boot(){
    style();decorate();
    let t;
    new MutationObserver(()=>{clearTimeout(t);t=setTimeout(decorate,80)}).observe(d.body,{subtree:true,childList:true});
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();