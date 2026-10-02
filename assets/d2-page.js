/* OnChain Aviation — secondary pages: theme · header · menu · reveal */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const themeBtns = $$('#themeToggle, [data-theme-alt]');
  function syncTheme() {
    const light = root.getAttribute('data-theme') === 'light';
    themeBtns.forEach(b => { b.setAttribute('aria-pressed', String(light)); b.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme'); });
  }
  themeBtns.forEach(b => b.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next); try { localStorage.setItem('oc-theme', next); } catch (e) {} syncTheme();
  }));
  syncTheme();

  const hdr = $('#hdr'); let ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { hdr && hdr.classList.toggle('is-stuck', scrollY > 24); ticking = false; }); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const menu = $('#menu'), burger = $('#burger'), closeBtn = $('#menuClose');
  if (menu && burger && closeBtn) {
    let lastFocus = null;
    const focusable = () => $$('a[href], button:not([disabled])', menu).filter(el => el.offsetParent !== null);
    const openMenu = () => { lastFocus = document.activeElement; menu.hidden = false; requestAnimationFrame(() => menu.setAttribute('data-open', '')); burger.setAttribute('aria-expanded', 'true'); root.setAttribute('data-menu-open', ''); setTimeout(() => (focusable()[0] || closeBtn).focus(), 60); };
    const closeMenu = () => { menu.removeAttribute('data-open'); burger.setAttribute('aria-expanded', 'false'); root.removeAttribute('data-menu-open'); const done = () => { menu.hidden = true; menu.removeEventListener('transitionend', done); }; reduced ? done() : menu.addEventListener('transitionend', done); if (lastFocus) lastFocus.focus(); };
    burger.addEventListener('click', openMenu); closeBtn.addEventListener('click', closeMenu);
    menu.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) closeMenu(); });
    menu.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key !== 'Tab') return; const f = focusable(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches && !menu.hidden) closeMenu(); });
  }

  let pending = $$('.rv');
  const show = el => { el.classList.add('in'); pending = pending.filter(x => x !== el); };
  if (reduced || !('IntersectionObserver' in window)) pending.slice().forEach(show);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    pending.forEach(el => io.observe(el));
    let tick = false;
    const sweep = () => { tick = false; if (!pending.length) return; const line = innerHeight * 0.94; pending.slice().forEach(el => { if (el.getBoundingClientRect().top < line) { show(el); io.unobserve(el); } }); };
    const onS = () => { if (!tick) { tick = true; requestAnimationFrame(sweep); } };
    addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS, { passive: true }); addEventListener('load', sweep);
  }
})();
