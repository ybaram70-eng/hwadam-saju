(()=>{const d=document;if(d.getElementById('hwadam-readability-colors-style'))return;const s=d.createElement('style');s.id='hwadam-readability-colors-style';s.textContent=`
:root{--hd-green:#214d3b;--hd-deep:#17362d;--hd-gold:#b7842e;--hd-text:#20252b;--hd-muted:#626a72;--hd-cream:#fffaf2;--hd-pink:#fff0f3;--hd-mint:#eef8f0;--hd-blue:#eef5ff;--hd-yellow:#fff8da;--hd-peach:#fff2e8}
body{color:var(--hd-text)!important}
#hwadamAnalysis .haHead h3,#hwadamAiConsult h2,.journalPanel h2{color:var(--hd-green)!important}
#hwadamAnalysis .haGrid article{border-width:2px!important;box-shadow:0 5px 14px rgba(30,55,45,.05)!important}
#hwadamAnalysis .haGrid article:nth-child(6n+1){background:var(--hd-mint)!important;border-color:#cfe5d4!important}
#hwadamAnalysis .haGrid article:nth-child(6n+2){background:var(--hd-blue)!important;border-color:#d2e0f2!important}
#hwadamAnalysis .haGrid article:nth-child(6n+3){background:var(--hd-yellow)!important;border-color:#eadfb2!important}
#hwadamAnalysis .haGrid article:nth-child(6n+4){background:var(--hd-peach)!important;border-color:#ead5c3!important}
#hwadamAnalysis .haGrid article:nth-child(6n+5){background:var(--hd-pink)!important;border-color:#ecd4dc!important}
#hwadamAnalysis .haGrid article:nth-child(6n){background:#f5f1ff!important;border-color:#ddd5ef!important}
#hwadamAnalysis .haGrid article b{color:var(--hd-deep)!important;font-size:22px!important;line-height:1.35!important;margin-bottom:10px!important}
#hwadamAnalysis .haGrid article p{color:#20252b!important;font-size:20px!important;line-height:1.85!important;font-weight:550!important;letter-spacing:-.1px!important}
#hwadamAnalysis .haGrid article p strong{color:#9b5c22!important;background:rgba(255,255,255,.65)!important;padding:2px 5px!important;border-radius:6px!important}
#hwadamAnalysis .haNote{font-size:17px!important;line-height:1.75!important;background:#f4f0e8!important;color:#4f5358!important;border-left:5px solid var(--hd-gold)!important;padding:14px!important}
#hwadamAiConsult{background:#fffdf8!important;border:2px solid #d9d0c1!important}
#hwadamAiConsult .aiIntro,#hwadamAiConsult .aiNote{font-size:17px!important;line-height:1.75!important;color:#505860!important}
#hwadamAiConsult .aiChips button{font-size:16px!important;background:var(--hd-mint)!important;border-color:#cfe5d4!important;color:var(--hd-green)!important}
#hwadamAiConsult #aiQuestion{font-size:18px!important;line-height:1.7!important;background:#fff!important}
#hwadamAiConsult #aiAsk{font-size:18px!important;background:var(--hd-green)!important}
#hwadamAiConsult .aiStatus{font-size:16px!important;line-height:1.7!important;background:var(--hd-yellow)!important;color:#5c552e!important}
#hwadamAiConsult .aiAnswer{font-size:20px!important;line-height:1.9!important;background:#fff!important}
#hwadamAiConsult .aiAnswer h3{font-size:24px!important;color:var(--hd-green)!important}
#hwadamAiConsult .aiAnswer h4{font-size:21px!important;color:#7b5b23!important}
.journalPanel{background:#fffdf8!important}
.journalWho{background:var(--hd-mint)!important;border-color:#cfe5d4!important;color:var(--hd-green)!important}
.journalCore{background:#fbf7ef!important}
.journalCore .coreBox:nth-child(1){background:var(--hd-blue)!important}.journalCore .coreBox:nth-child(2){background:var(--hd-mint)!important}.journalCore .coreBox:nth-child(3){background:var(--hd-yellow)!important}.journalCore .coreBox:nth-child(4){background:var(--hd-peach)!important}
.journalCore .coreBox b{font-size:18px!important}.journalCore .coreBox>div{font-size:18px!important;line-height:1.7!important}.journalCore .coreSmall{font-size:16px!important;line-height:1.7!important}
@media(max-width:430px){#hwadamAnalysis .haHead h3{font-size:31px!important}#hwadamAnalysis .haGrid article{padding:17px!important}#hwadamAnalysis .haGrid article b{font-size:22px!important}#hwadamAnalysis .haGrid article p{font-size:20px!important;line-height:1.9!important}#hwadamAiConsult .aiAnswer{font-size:20px!important;line-height:1.9!important}}
`;d.head.appendChild(s)})();