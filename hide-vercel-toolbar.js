(()=>{
  function hideToolbar(){
    try{
      const pd=window.parent&&window.parent.document?window.parent.document:document;
      pd.querySelectorAll('vercel-live-feedback,#vercel-toolbar,.vercel-live-feedback,[data-vercel-feedback]').forEach(el=>{
        try{el.style.setProperty('display','none','important'); el.remove();}catch{}
      });
    }catch{}
  }
  hideToolbar();
  try{
    const pd=window.parent&&window.parent.document?window.parent.document:document;
    const obs=new MutationObserver(hideToolbar);
    obs.observe(pd.documentElement||pd.body,{childList:true,subtree:true});
    setInterval(hideToolbar,800);
  }catch{setInterval(hideToolbar,800);}
})();