/* OnChain Aviation — site script: theme · header · menu · reveal · ribbon · form · nav-current (replaces d2-prod.js) */
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

  /* ---------- ribbon (home) ---------- */
  const rb = $('#ribbon');
  if (rb) {
    const items = ['Gulfstream G450', 'Gulfstream G500', 'Gulfstream G550', 'Gulfstream G600', 'Gulfstream G650', 'Gulfstream G700', 'Gulfstream G800',
      'Calendar & hourly inspections', '24/7 AoG response', 'Aircraft management', 'Pre-purchase oversight', 'Powered by IronFleet'];
    rb.innerHTML = (reduced ? items : [...items, ...items]).map(t => `<span class="ribbon-item">${t}</span>`).join('');
  }

  /* ---------- request form (contact) ---------- */
  const form = $('#rfq'), msg = $('#formMsg');
  if (form && msg) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (form.website.value) return; // honeypot
      if (!form.checkValidity()) {
        const bad = $$(':invalid', form)[0];
        msg.textContent = 'Please complete the required fields.'; msg.className = 'form-msg err';
        bad && bad.focus(); return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';
      const fd = new FormData(form); fd.delete('website');
      const payload = Object.fromEntries(fd.entries());
      payload._honey = '';
      fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(j => {
          if (String(j.success) !== 'true') throw new Error(j.message || 'not accepted');
          msg.textContent = 'Received. Mike will reply same day. Aircraft on the ground? Call (912) 595-7795.'; msg.className = 'form-msg ok';
          form.reset();
        })
        .catch(() => {
          msg.innerHTML = 'The form could not send. Email <a href="mailto:mike@onchain.aero">mike@onchain.aero</a> or call <a href="tel:+19125957795">(912) 595-7795</a>.'; msg.className = 'form-msg err';
        })
        .finally(() => { btn.disabled = false; btn.textContent = 'Send request'; });
    });
    form.addEventListener('input', () => { if (msg.className.includes('err') && form.checkValidity()) { msg.textContent = ''; msg.className = 'form-msg'; } });
    // pre-select service from ?service= or #aog etc.
    const q = new URLSearchParams(location.search).get('service'); const sel = $('#svc');
    if (q && sel) { [...sel.options].forEach(o => { if (o.text.toLowerCase().startsWith(q.toLowerCase())) sel.value = o.value || o.text; }); }
  }

  /* ---------- nav: mark current page ---------- */
  const here = location.pathname.replace(/index\.html$/, '');
  $$('.nav a').forEach(a => { const p = new URL(a.href, location.href).pathname.replace(/index\.html$/, ''); if (p === here && !a.hash) a.setAttribute('aria-current', 'page'); });

  /* ---------- legacy home anchors → pages (links in the wild from the single-page site) ---------- */
  if (location.pathname === '/' || /\/index\.html$/.test(location.pathname)) {
    const map = { '#contact': '/contact.html', '#faq': '/faq.html', '#platform': '/platform.html', '#records': '/platform.html#provenance', '#about': '/about.html',
      '#services-manage': '/aircraft-management.html', '#services-aog': '/aog.html', '#services-technical': '/technical-services.html', '#services-consult': '/consulting.html' };
    const to = map[location.hash]; if (to) location.replace(to);
  }
})();
