(() => {
  const d = document;

  function hideSamplePlaceholders() {
    ["year", "month", "day", "hour", "minute"].forEach((id) => {
      const el = d.getElementById(id);
      if (el) el.placeholder = "";
    });
  }

  function revealInput() {
    hideSamplePlaceholders();
    const name = d.getElementById("name");
    if (!name) return false;
    let node = name.closest(".card") || name.parentElement;
    while (node && node !== d.body) {
      node.classList.remove("hd-screen-hidden");
      if (
        node.matches("section, .card, main, .w") ||
        node.contains(name)
      ) {
        node.classList.add("hd-screen-visible");
      }
      node = node.parentElement;
    }
    try {
      d.scrollingElement.scrollTop = 0;
      d.defaultView.scrollTo(0, 0);
    } catch {}
    return true;
  }

  function bind() {
    try {
      const button = parent.document.querySelector(
        '.navItem[data-target="input"]',
      );
      if (!button || button.dataset.inputRevealBound) return;
      button.dataset.inputRevealBound = "1";
      button.addEventListener(
        "click",
        () => {
          hideSamplePlaceholders();
          setTimeout(revealInput, 40);
          setTimeout(revealInput, 180);
          setTimeout(revealInput, 500);
        },
        false,
      );
    } catch {}
  }

  function boot() {
    hideSamplePlaceholders();
    bind();
    setTimeout(() => {
      hideSamplePlaceholders();
      bind();
    }, 400);
    try {
      const active = parent.document.querySelector(
        '.navItem.active[data-target="input"]',
      );
      if (active) setTimeout(revealInput, 80);
    } catch {}
  }

  window.hwadamInputScreenFix = { reveal: revealInput, hideSamplePlaceholders };
  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
