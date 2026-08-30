(() => {
  const d = document;
  if (d.getElementById("hwadam-analysis-compact-font-style")) return;
  const style = d.createElement("style");
  style.id = "hwadam-analysis-compact-font-style";
  style.textContent = `
    #hwadamAnalysis .haHead h3{font-size:25px!important}
    #hwadamAnalysis .haGrid article{padding:13px!important}
    #hwadamAnalysis .haGrid article b{font-size:18px!important;line-height:1.4!important;margin-bottom:8px!important}
    #hwadamAnalysis .haGrid article p{font-size:15px!important;line-height:1.75!important;font-weight:500!important}
    #hwadamAnalysis .haGrid article p strong{font-size:15px!important}
    #hwadamAnalysis .haNote{font-size:13px!important;line-height:1.7!important;padding:12px!important}
  `;
  d.head.appendChild(style);
})();
