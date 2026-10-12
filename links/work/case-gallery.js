(() => {
  const track = document.getElementById("case-gallery");
  if (!track) return;
  const cards = Array.from(track.querySelectorAll(".feature"));
  const previous = document.getElementById("case-previous");
  const next = document.getElementById("case-next");
  const count = document.getElementById("case-count");
  const announcement = document.getElementById("case-announcement");
  const controls = document.querySelector("[data-gallery-controls]");
  if (!cards.length || !previous || !next || !count || !announcement || !controls) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = -1;
  let scrollQueued = false;
  let resizeQueued = false;
  const leftFor = index => cards[index].offsetLeft - cards[0].offsetLeft;
  const closest = () => {
    let result = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const current = Math.abs(leftFor(index) - track.scrollLeft);
      if (current < distance) { distance = current; result = index; }
    });
    return result;
  };
  const update = () => {
    const index = closest();
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    count.textContent = String(index + 1).padStart(2, "0") + " / " + String(cards.length).padStart(2, "0");
    if (index !== active) {
      active = index;
      announcement.textContent = "Case " + (index + 1) + " of " + cards.length + ": " + cards[index].dataset.caseName;
    }
  };
  const go = (index, smooth = true) => {
    const target = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({ left: leftFor(target), behavior: smooth && !reducedMotion.matches ? "smooth" : "auto" });
    if (!smooth || reducedMotion.matches) update();
  };
  previous.addEventListener("click", () => go(closest() - 1));
  next.addEventListener("click", () => go(closest() + 1));
  track.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; update(); });
  }, { passive: true });
  track.addEventListener("keydown", event => {
    if (event.target !== track) return;
    const index = closest();
    if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
    else if (event.key === "Home") { event.preventDefault(); go(0); }
    else if (event.key === "End") { event.preventDefault(); go(cards.length - 1); }
  });
  const alignHash = () => {
    const hash = window.location.hash;
    const index = cards.findIndex(card => "#" + card.id === hash);
    if (index >= 0) go(index, false);
    else update();
  };
  window.addEventListener("hashchange", alignHash);
  window.addEventListener("resize", () => {
    if (resizeQueued) return;
    resizeQueued = true;
    const index = Math.max(0, active);
    requestAnimationFrame(() => { resizeQueued = false; go(index, false); });
  });
  controls.hidden = false;
  cards.forEach((card, index) => {
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute("aria-label", (index + 1) + " of " + cards.length + ": " + card.dataset.caseName);
  });
  update();
  requestAnimationFrame(alignHash);
})();
