/* OnChain Aviation — D2 production script
   Modules: theme · header · menu · ribbon · tabs · reveal · form · nav-current */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  const themeBtns = $$('#themeToggle, [data-theme-alt]');
  function syncTheme() {
    const light = root.getAttribute('data-theme') === 'light';
    themeBtns.forEach(b => {
      b.setAttribute('aria-pressed', String(light));
      b.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    });
    const meta = $('meta[name="theme-color"]:not([media])');
    if (meta) meta.content = light ? '#EEEBE4' : '#0A0A0B';
  }
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('oc-theme', next); } catch (e) {}
    syncTheme();
  }
  themeBtns.forEach(b => b.addEventListener('click', () =>
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')));
  syncTheme();

  /* ---------- header condense ---------- */
  const hdr = $('#hdr');
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { hdr.classList.toggle('is-stuck', scrollY > 24); ticking = false; });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- mobile menu ---------- */
  const menu = $('#menu'), burger = $('#burger'), closeBtn = $('#menuClose');
  let lastFocus = null;
  const focusable = () => $$('a[href], button:not([disabled])', menu).filter(el => el.offsetParent !== null);
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(() => menu.setAttribute('data-open', ''));
    burger.setAttribute('aria-expanded', 'true');
    root.setAttribute('data-menu-open', '');
    setTimeout(() => (focusable()[0] || closeBtn).focus(), 60);
  }
  function closeMenu() {
    menu.removeAttribute('data-open');
    burger.setAttribute('aria-expanded', 'false');
    root.removeAttribute('data-menu-open');
    const done = () => { menu.hidden = true; menu.removeEventListener('transitionend', done); };
    reduced ? done() : menu.addEventListener('transitionend', done);
    if (lastFocus) lastFocus.focus();
  }
  burger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  menu.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) closeMenu(); });
  menu.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const f = focusable(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches && !menu.hidden) closeMenu(); });

  /* ---------- ribbon ---------- */
  const items = ['Gulfstream G450', 'Gulfstream G500', 'Gulfstream G550', 'Gulfstream G600', 'Gulfstream G650', 'Gulfstream G700', 'Gulfstream G800',
    'Calendar & hourly inspections', '24/7 AoG response', 'Verified records', 'Project management', 'Operations consulting'];
  const rb = $('#ribbon');
  if (rb) rb.innerHTML = (reduced ? items : [...items, ...items]).map(t => `<span class="ribbon-item">${t}</span>`).join('');

  /* ---------- capabilities: tabs ---------- */
  const data = {
    manage: { tag: 'Tier 01 · Managed aircraft', title: 'Aircraft Management',
      lead: 'Full-time technical ownership of your aircraft without a full-time department. One A&P accountable for the maintenance program, the records, the vendors and the schedule — first call on every work item, priority AoG response, preferred rates.',
      feats: [['Maintenance program', 'Calendar, hourly and light scheduled events planned and tracked'], ['Records & compliance', 'Logbooks, ADs and due lists kept current in IronFleet aviOS'], ['Vendor & parts oversight', 'Sourcing, supervision and sign-off on any work sent out'], ['Priority AoG', 'Managed aircraft go to the front of the line']],
      cta: ['How management works →', 'aircraft-management.html', false],
      w: { type: 'status', title: 'Managed aircraft · illustrative', status: 'Airworthy', color: 'var(--teal)', rows: [['12-month calendar', 'Planned', 'var(--tx-2)'], ['600-hour', 'Tracked', 'var(--tx-2)'], ['AD compliance', 'Current', 'var(--teal)'], ['Records', 'Current', 'var(--teal)']] } },
    aog: { tag: 'Any tier · 24/7 coverage', title: 'AoG Response',
      lead: 'When the aircraft is on the ground, every minute counts. Triage on the phone, parts sourced in parallel, technician moving before the quote is signed. One call, one number, any hour.',
      feats: [['24/7 hotline', 'Live triage from a Gulfstream technician'], ['Remote diagnosis', 'Direction before parts ship'], ['On-site repair', 'Mobile response across the Southeast'], ['Parts sourcing', 'Network access when you need it now']],
      cta: ['Call the AoG hotline →', 'tel:+19125957795', true],
      w: { type: 'events', title: 'AoG activity · illustrative', status: 'Active', color: 'var(--aog)', rows: [['2m ago', 'Triage opened — G650', 'SAV · diagnostic in progress'], ['38m ago', 'Parts sourced — G450', 'Hydraulic pump shipped overnight'], ['2h ago', 'On-site repair — G550', 'Aircraft returned to service']] } },
    technical: { tag: 'Tier 02 · Per event', title: 'Technical Services',
      lead: 'Owner-side technical work, one event at a time — pre-purchase inspection oversight, owner’s technical representation, forensic records and logbook audits, delivery acceptance, site surveys and per-event maintenance. Often the first job before a management agreement.',
      feats: [['Pre-buy oversight', 'Owner’s representative through the PPI, LOI to closing'], ['Records & logbook audit', 'Forensic review of history, ADs and compliance'], ['Delivery acceptance', 'New-aircraft acceptance, oversight and turnover'], ['Site survey & per-event MRO', 'Condition reports and scoped work, on your ramp']],
      cta: ['See technical services →', 'technical-services.html', false],
      w: { type: 'status', title: 'PPI oversight · template', status: 'Template', color: 'var(--accent-lt)', rows: [['Records audit', 'Complete', 'var(--teal)'], ['AD compliance', 'Complete', 'var(--teal)'], ['Logbook review', 'In progress', 'var(--accent-lt)'], ['Borescope', 'Scheduled', 'var(--mut)'], ['Test flight', 'Pending', 'var(--mut)']] } },
    consult: { tag: 'Tier 03 · Advisory', title: 'Operations & AI Consulting',
      lead: 'Operations and AI-implementation advisory for flight departments and shops — how to run a maintenance operation on modern tooling, from an operator who runs his own on it.',
      feats: [['Operations review', 'Process, vendors and cost visibility'], ['AI implementation', 'Putting aviOS and AI tooling to work in your shop'], ['Records modernisation', 'From paper and PDFs to a searchable history'], ['Vendor strategy', 'Network and pricing leverage']],
      cta: ['Schedule a call →', '#contact', false],
      w: { type: 'status', title: 'Program health · illustrative', status: 'Monitoring', color: 'var(--teal)', rows: [['Records digitised', 'Complete', 'var(--teal)'], ['Due list', 'Verified', 'var(--teal)'], ['Vendor coverage', 'In place', 'var(--tx-2)'], ['AD status', 'Current', 'var(--teal)']] } }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function widget(w) {
    let body = '';
    if (w.type === 'events') body = w.rows.map(r => `<div class="w-ev"><span class="t">${esc(r[0])}</span><div><div class="e">${esc(r[1])}</div><div class="d">${esc(r[2])}</div></div></div>`).join('');
    else body = w.rows.map(r => `<div class="w-row"><span class="k">${esc(r[0])}</span><span class="v" style="color:${r[2]}">${esc(r[1])}</span></div>`).join('');
    return `<div class="widget"><div class="w-head"><span class="t">${esc(w.title)}</span><span class="s" style="color:${w.color}"><i aria-hidden="true"></i>${esc(w.status)}</span></div>${body}</div>`;
  }
  const panels = $('#panels');
  panels.innerHTML = Object.entries(data).map(([k, d]) => `
    <div class="panel" id="panel-${k}" role="tabpanel" aria-labelledby="tab-${k}" tabindex="0" ${k === 'manage' ? '' : 'hidden'}>
      <div>
        <p class="cap-tag micro">${esc(d.tag)}</p>
        <h3 class="d3">${esc(d.title)}</h3>
        <p class="cap-lead">${esc(d.lead)}</p>
        <div class="feats">${d.feats.map(f => `<div class="feat"><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div>`).join('')}</div>
        <a class="cap-cta${d.cta[2] ? ' aog' : ''}" href="${d.cta[1]}">${esc(d.cta[0])}</a>
      </div>
      ${widget(d.w)}
    </div>`).join('');
  const tabs = $$('[role="tab"]');
  function select(tab, focus = true) {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !on; });
    if (focus) tab.focus();
    const key = tab.id.replace('tab-', '');
    if (key !== 'manage' || location.hash.startsWith('#services-')) history.replaceState(null, '', '#services-' + key);
  }
  // deep links: #services-aog etc. select the tab and scroll to the section
  function fromHash() {
    const m = location.hash.match(/^#services-(manage|aog|technical|consult)$/);
    if (!m) return false;
    const tab = $('#tab-' + m[1]); if (!tab) return false;
    select(tab, false);
    $('#services').scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    return true;
  }
  addEventListener('hashchange', fromHash);
  document.addEventListener('click', e => { const a = e.target.closest('a[href^="#services-"]'); if (a) { e.preventDefault(); history.pushState(null, '', a.getAttribute('href')); fromHash(); } });
  if (location.hash.startsWith('#services-')) setTimeout(fromHash, 50);
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t, false));
    t.addEventListener('keydown', e => {
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: -Infinity, End: Infinity };
      if (!(e.key in map)) return; e.preventDefault();
      const n = map[e.key] === -Infinity ? 0 : map[e.key] === Infinity ? tabs.length - 1 : (i + map[e.key] + tabs.length) % tabs.length;
      select(tabs[n]);
    });
  });

  /* ---------- reveal ----------
     IntersectionObserver is the primary trigger. A throttled scroll/resize
     sweep backs it up so a fast fling can never leave a section unrevealed. */
  let pending = $$('.rv');
  const show = el => { el.classList.add('in'); pending = pending.filter(x => x !== el); };
  if (reduced || !('IntersectionObserver' in window)) pending.slice().forEach(show);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    pending.forEach(el => io.observe(el));
    let tick = false;
    const sweep = () => {
      tick = false;
      if (!pending.length) return;
      const line = window.innerHeight * 0.94;
      pending.slice().forEach(el => { if (el.getBoundingClientRect().top < line) { show(el); io.unobserve(el); } });
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(sweep); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', sweep);
  }

  /* ---------- nav current section ---------- */
  const navLinks = $$('.nav a[href^="#"]');
  const sections = $$('main > section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        // Sections without a nav link (hero, contact) clear the current marker.
        navLinks.forEach(a => { if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(t => so.observe(t));
  }

  /* ---------- form ---------- */
  const form = $('#rfq'), msg = $('#formMsg');
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
    payload._honey = ''; // FormSubmit honeypot
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
})();
