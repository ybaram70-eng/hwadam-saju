(()=>{
  const d=document,$=id=>d.getElementById(id);
  let user=null,isAdmin=false,mode='login';

  function style(){
    if($('hwadam-auth-style'))return;
    const s=d.createElement('style');
    s.id='hwadam-auth-style';
    s.textContent=`.hdAuthBar{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin:8px 10px 10px;flex-wrap:wrap}.hdAuthBtn{border:1px solid #d8cdbb;background:#fffdf8;color:#20352d;border-radius:999px;padding:9px 13px;font-size:13px;font-weight:900;box-shadow:0 3px 10px rgba(32,53,45,.06)}.hdAuthBtn.primary{background:#20352d;color:#fff;border-color:#20352d}.hdAuthBtn.admin{background:#b88746;color:#fff;border-color:#b88746}.hdAuthBtn.danger{color:#9b342c;border-color:#e4b9b4;background:#fff7f6;margin-left:auto}.hdAuthUser{font-size:13px;font-weight:900;color:#20352d}.hdAuthModal{position:fixed;z-index:99999;inset:0;background:rgba(15,25,21,.48);display:flex;align-items:flex-end;justify-content:center}.hdAuthSheet{width:min(100%,520px);max-height:92vh;overflow:auto;background:#fffdf8;border-radius:24px 24px 0 0;padding:22px 18px calc(22px + env(safe-area-inset-bottom));box-shadow:0 -10px 30px rgba(0,0,0,.15)}.hdAuthHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.hdAuthHead h2{margin:0;color:#20352d;font-size:25px}.hdAuthClose{border:0;background:#f3efe6;width:38px;height:38px;border-radius:50%;font-size:22px}.hdAuthTabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}.hdAuthTabs button{padding:12px;border-radius:12px;border:1px solid #d8cdbb;background:#fff;font-weight:900}.hdAuthTabs button.on{background:#20352d;color:#fff;border-color:#20352d}.hdAuthForm{display:grid;gap:10px}.hdAuthForm label{font-size:13px;font-weight:800;color:#4d4d4d}.hdAuthForm input,.hdAuthForm select{width:100%;padding:13px 14px;border:1px solid #d6cdbd;border-radius:12px;background:#fff;font-size:16px;box-sizing:border-box}.hdAuthSubmit{margin-top:5px;padding:14px;border:0;border-radius:14px;background:#20352d;color:#fff;font-size:17px;font-weight:900}.hdAuthAgree{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.5}.hdAuthAgree input{width:auto;margin-top:3px}.hdAuthMsg{min-height:20px;font-size:13px;font-weight:800;color:#9a3c32}.hdAuthHelp{font-size:12px;color:#756b5e;line-height:1.6}.hdHidden{display:none!important}`;
    d.head.appendChild(s);
  }

  function msgFor(e){return({DB_NOT_CONFIGURED:'회원가입 저장소 연결이 아직 필요합니다.',NAME_REQUIRED:'이름을 입력해 주세요.',PHONE_INVALID:'휴대폰번호를 확인해 주세요.',PHONE_EXISTS:'이미 가입된 휴대폰번호입니다.',PASSWORD_TOO_SHORT:'비밀번호는 8자 이상 입력해 주세요.',AGREEMENT_REQUIRED:'이용약관에 동의해 주세요.',LOGIN_INVALID:'휴대폰번호 또는 비밀번호를 확인해 주세요.',LOGIN_REQUIRED:'다시 로그인해 주세요.',DELETE_FAILED:'회원탈퇴 처리 중 오류가 발생했습니다.',REQUEST_TIMEOUT:'서버 응답이 늦어지고 있습니다.'})[e]||'처리 중 오류가 발생했습니다.'}
  function birth(v){const x=String(v||'').replace(/\D/g,'');if(!x)return null;if(!/^\d{8}$/.test(x))return false;const y=+x.slice(0,4),m=+x.slice(4,6),day=+x.slice(6,8),dt=new Date(y,m-1,day);if(dt.getFullYear()!==y||dt.getMonth()+1!==m||dt.getDate()!==day)return false;return `${x.slice(0,4)}-${x.slice(4,6)}-${x.slice(6,8)}`}

  function setCustomerNav(){
    try{
      const nav=parent.document.querySelector('.navItem[data-target="customers"]');
      if(nav)nav.style.display=isAdmin?'flex':'none';
    }catch{}
  }
  function goCustomers(){
    try{const b=parent.document.querySelector('.navItem[data-target="customers"]');if(b){b.style.display='flex';b.click();return}}catch{}
    try{d.defaultView?.hwadamScreenMode?.show?.('customers')}catch{}
  }
  function bar(){
    let b=$('hwadamAuthBar');
    if(!b){b=d.createElement('div');b.id='hwadamAuthBar';b.className='hdAuthBar';const hero=d.querySelector('.hero');if(hero)hero.insertAdjacentElement('beforebegin',b);else d.body.prepend(b)}
    if(user){
      b.innerHTML=`<span class="hdAuthUser">${user.name||'회원'}님</span>${isAdmin?'<button class="hdAuthBtn admin" id="hwadamAdminCustomers">관리자 · 고객목록</button>':''}<button class="hdAuthBtn" id="hwadamLogout">로그아웃</button><button class="hdAuthBtn danger" id="hwadamDeleteAccount">회원탈퇴</button>`;
    }else{
      b.innerHTML=`<button class="hdAuthBtn" id="hwadamLoginOpen">로그인</button><button class="hdAuthBtn primary" id="hwadamSignupOpen">회원가입</button><button class="hdAuthBtn admin" id="hwadamAdminLoginOpen">관리자 로그인</button>`;
    }
    b.querySelector('#hwadamLoginOpen')?.addEventListener('click',()=>open('login'));
    b.querySelector('#hwadamAdminLoginOpen')?.addEventListener('click',()=>open('login'));
    b.querySelector('#hwadamSignupOpen')?.addEventListener('click',()=>open('signup'));
    b.querySelector('#hwadamAdminCustomers')?.addEventListener('click',goCustomers);
    b.querySelector('#hwadamLogout')?.addEventListener('click',logout);
    b.querySelector('#hwadamDeleteAccount')?.addEventListener('click',deleteAccount);
    setCustomerNav();
  }

  function open(m){
    mode=m;let x=$('hwadamAuthModal');
    if(!x){
      x=d.createElement('div');x.id='hwadamAuthModal';x.className='hdAuthModal';
      x.innerHTML=`<div class="hdAuthSheet"><div class="hdAuthHead"><h2>화담 회원</h2><button class="hdAuthClose" aria-label="닫기">×</button></div><div class="hdAuthTabs"><button data-tab="login">로그인</button><button data-tab="signup">회원가입</button></div><form id="hwadamLoginForm" class="hdAuthForm"><label>휴대폰번호<input name="phone" inputmode="numeric" autocomplete="tel" placeholder="01012345678" required></label><label>비밀번호<input name="password" type="password" autocomplete="current-password" required></label><div class="hdAuthMsg"></div><button class="hdAuthSubmit">로그인</button></form><form id="hwadamSignupForm" class="hdAuthForm hdHidden"><label>이름<input name="name" required></label><label>휴대폰번호<input name="phone" inputmode="numeric" autocomplete="tel" placeholder="01012345678" required></label><label>생년월일<input name="birthDate" inputmode="numeric" maxlength="8" placeholder="예: 19651214"></label><label>성별<select name="gender"><option value="">선택</option><option value="female">여성</option><option value="male">남성</option></select></label><label>비밀번호<input name="password" type="password" minlength="8" autocomplete="new-password" required></label><label class="hdAuthAgree"><input name="agree" type="checkbox" required><span>이용약관 및 개인정보 수집·이용에 동의합니다.</span></label><div class="hdAuthMsg"></div><button class="hdAuthSubmit">회원가입</button><div class="hdAuthHelp">이메일 없이 휴대폰번호로 가입하고 로그인합니다.</div></form></div>`;
      d.body.appendChild(x);
      x.querySelector('.hdAuthClose').onclick=()=>x.remove();x.addEventListener('click',e=>{if(e.target===x)x.remove()});x.querySelectorAll('[data-tab]').forEach(t=>t.onclick=()=>switchTab(t.dataset.tab));x.querySelector('#hwadamLoginForm').onsubmit=submitLogin;x.querySelector('#hwadamSignupForm').onsubmit=submitSignup;
    }
    switchTab(m);
  }
  function switchTab(m){mode=m;const x=$('hwadamAuthModal');if(!x)return;x.querySelectorAll('[data-tab]').forEach(t=>t.classList.toggle('on',t.dataset.tab===m));x.querySelector('#hwadamLoginForm').classList.toggle('hdHidden',m!=='login');x.querySelector('#hwadamSignupForm').classList.toggle('hdHidden',m!=='signup');x.querySelectorAll('.hdAuthMsg').forEach(b=>b.textContent='')}

  async function post(url,data,timeout=30000){
    const c=new AbortController(),tm=setTimeout(()=>c.abort(),timeout);
    try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(data||{}),signal:c.signal,cache:'no-store'});let j={};try{j=await r.json()}catch{}return{r,j}}
    catch(e){return{r:{ok:false},j:{error:'REQUEST_TIMEOUT'}}}
    finally{clearTimeout(tm)}
  }
  async function refreshIdentity(){
    try{const r=await fetch('/api/auth-me',{credentials:'same-origin',cache:'no-store'});const j=await r.json();user=j.user||null;isAdmin=!!j.isAdmin}catch{user=null;isAdmin=false}
    bar();
  }
  async function submitLogin(e){e.preventDefault();const form=e.currentTarget,f=new FormData(form),box=form.querySelector('.hdAuthMsg'),btn=form.querySelector('.hdAuthSubmit');btn.disabled=true;box.textContent='로그인 중…';const {r,j}=await post('/api/auth-login',{phone:f.get('phone'),password:f.get('password')});btn.disabled=false;if(!r.ok){box.textContent=msgFor(j.error);return}await refreshIdentity();$('hwadamAuthModal')?.remove()}
  async function submitSignup(e){e.preventDefault();const form=e.currentTarget,f=new FormData(form),box=form.querySelector('.hdAuthMsg'),btn=form.querySelector('.hdAuthSubmit'),bd=birth(f.get('birthDate'));if(bd===false){box.textContent='생년월일을 숫자 8자리로 정확히 입력해 주세요. 예: 19651214';return}btn.disabled=true;box.textContent='가입 중…';const {r,j}=await post('/api/auth-signup',{name:f.get('name'),phone:f.get('phone'),birthDate:bd,gender:f.get('gender'),password:f.get('password'),agree:f.get('agree')==='on'});btn.disabled=false;if(!r.ok){box.textContent=msgFor(j.error);return}await refreshIdentity();$('hwadamAuthModal')?.remove();const n=d.getElementById('name');if(n&&!n.value)n.value=user?.name||''}
  async function logout(){await post('/api/auth-logout',{});user=null;isAdmin=false;bar()}
  async function deleteAccount(){if(!user)return;if(!window.confirm(`${user.name}님의 회원 계정을 탈퇴하시겠습니까?`))return;if(!window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'))return;const {r,j}=await post('/api/auth-delete',{});if(!r.ok){window.alert(msgFor(j.error));return}user=null;isAdmin=false;bar();window.alert('회원탈퇴가 완료되었습니다.')}
  function boot(){style();refreshIdentity()}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
