(() => {
  const hash = '#meet-the-founder';
  let active = false, observer, timer, frame = 0;

  function stop() {
    active = false;
    observer?.disconnect();
    clearTimeout(timer);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function align() {
    frame = 0;
    if (!active || location.hash !== hash) return;
    const target = document.getElementById('meet-the-founder');
    if (!target) return;
    const header = document.querySelector('body > header');
    const offset = (header?.getBoundingClientRect().height || 90) + 18;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
    if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, behavior: 'instant' });
  }

  function schedule() {
    if (active && !frame) frame = requestAnimationFrame(align);
  }

  function begin() {
    stop();
    if (location.hash !== hash) return;
    active = true;
    schedule();
    // Late images, fonts and the shared footer can shift the original hash position.
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(schedule);
      observer.observe(document.body);
      const header = document.querySelector('body > header');
      if (header) observer.observe(header);
    }
    document.fonts?.ready.then(schedule).catch(() => {});
    timer = setTimeout(stop, 6000);
  }

  window.addEventListener('hashchange', begin);
  window.addEventListener('load', schedule);
  window.addEventListener('pageshow', event => { if (event.persisted) begin(); });
  // Once the visitor starts interacting, leave their scrolling entirely in their control.
  for (const name of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    window.addEventListener(name, stop, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin, { once: true });
  else begin();
})();
