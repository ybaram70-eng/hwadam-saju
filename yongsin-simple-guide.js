(() => {
  const d = document;

  function render() {
    const analysis = d.getElementById("hwadamAnalysis");
    if (!analysis || d.getElementById("hwadamYongsinGuide")) return;

    const guide = d.createElement("section");
    guide.id = "hwadamYongsinGuide";
    guide.className = "hyGuide";
    guide.innerHTML = `
      <div class="hyIntro">
        <small>용신, 쉽게 알려드릴게요</small>
        <h3>나에게 가장 필요한 균형의 기운</h3>
        <p><b>용신</b>은 사주에서 너무 강한 기운은 누그러뜨리고, 부족한 기운은 채워 전체 균형을 돕는 핵심 오행입니다.</p>
      </div>
      <div class="hyCards">
        <article><span>⚖️</span><div><b>사람마다 달라요</b><p>같은 생년이라도 태어난 월·일·시간과 오행의 강약이 달라 용신도 달라질 수 있습니다.</p></div></article>
        <article><span>🌿</span><div><b>희신은 도와주는 기운</b><p>용신이 편안하게 작용하도록 곁에서 힘을 보태는 좋은 기운입니다.</p></div></article>
        <article><span>⛔</span><div><b>기신은 주의할 기운</b><p>이미 강한 기운을 더 키우거나 균형을 흔들 수 있어 과할 때 조절이 필요합니다.</p></div></article>
      </div>
      <div class="hyUse"><b>그래서 무엇을 보면 되나요?</b><p>아래의 <strong>용신 방향</strong>과 <strong>희신·기신 방향</strong>에서 나에게 필요한 오행을 확인하세요. 직업·관계·생활환경과 대운·세운의 흐름을 해석할 때 참고할 수 있습니다.</p></div>`;

    const grid = analysis.querySelector(".haGrid");
    if (grid) analysis.insertBefore(guide, grid);
    else analysis.appendChild(guide);

    if (!d.getElementById("hwadamYongsinGuideStyle")) {
      const style = d.createElement("style");
      style.id = "hwadamYongsinGuideStyle";
      style.textContent = `.hyGuide{margin:12px 0 14px;padding:15px;border:1px solid #d9cfbd;border-radius:18px;background:linear-gradient(145deg,#f8fbf7,#fffaf0)}.hyIntro small{color:#9a6a22;font-size:12px;font-weight:900}.hyIntro h3{margin:4px 0 9px;color:#20352d;font-size:21px}.hyIntro p{margin:0;color:#3c4540;font-size:14px;line-height:1.75;word-break:keep-all}.hyCards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.hyCards article{display:flex;gap:8px;padding:11px;background:#fff;border:1px solid #e3dacb;border-radius:13px}.hyCards span{font-size:20px}.hyCards b{display:block;color:#20352d;font-size:13px;margin-bottom:4px}.hyCards p{margin:0;color:#5b5b57;font-size:11px;line-height:1.55;word-break:keep-all}.hyUse{margin-top:10px;padding:12px;border-radius:12px;background:#20352d;color:#fff}.hyUse b{font-size:15px}.hyUse p{margin:5px 0 0;font-size:12px;line-height:1.7;word-break:keep-all}.hyUse strong{color:#f1cf83}@media(max-width:430px){.hyGuide{padding:13px}.hyCards{grid-template-columns:1fr}.hyCards article{align-items:flex-start}.hyIntro h3{font-size:20px}.hyIntro p{font-size:13px}}`;
      d.head.appendChild(style);
    }
  }

  function boot() {
    render();
    let timer;
    new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(render, 100);
    }).observe(d.body, { childList: true, subtree: true });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
