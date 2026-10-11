/* Lens agency — интерактив: появление блоков, шапка, меню, FAQ, формы */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- reveal on scroll ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- sticky header ---------- */
  var header = $('.header');
  var ph = document.createElement('div');
  ph.className = 'header-ph';
  if (header && !header.classList.contains('header--abs')) {
    header.parentNode.insertBefore(ph, header.nextSibling);
  }
  var stuck = false;
  function onScroll() {
    var y = window.pageYOffset;
    var s = y > 140;
    if (header && s !== stuck) {
      stuck = s;
      header.classList.toggle('is-stuck', s);
      if (!header.classList.contains('header--abs')) ph.style.height = s ? '128px' : '0';
      if (!s && !header.classList.contains('header--abs')) ph.style.display = 'none';
      else if (s) ph.style.display = 'block';
    }
    var hero = $('.hero');
    if (hero && y < 1000) hero.style.backgroundPosition = 'center ' + (y * 0.18) + 'px';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- drawer menu ---------- */
  var drawer = $('#drawer'), burger = $('.burger');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setDrawer(true); });
  if (drawer) {
    $('.drawer__bg', drawer).addEventListener('click', function () { setDrawer(false); });
    $('.drawer__close', drawer).addEventListener('click', function () { setDrawer(false); });
    $$('.drawer__nav a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });
  }

  /* ---------- smooth scroll to form ---------- */
  $$('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = $(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---------- FAQ ---------- */
  $$('.faq__i').forEach(function (it) {
    $('.faq__q', it).addEventListener('click', function () {
      var open = it.classList.contains('is-open');
      $$('.faq__i').forEach(function (o) { o.classList.remove('is-open'); });
      if (!open) it.classList.add('is-open');
    });
  });

  /* ---------- phone mask ---------- */
  function fmt(v) {
    var d = v.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    var r = '+7';
    if (d.length > 1) r += ' (' + d.slice(1, 4);
    if (d.length >= 4) r += ')';
    if (d.length > 4) r += ' ' + d.slice(4, 7);
    if (d.length > 7) r += '-' + d.slice(7, 9);
    if (d.length > 9) r += '-' + d.slice(9, 11);
    return r;
  }
  $$('[data-tel]').forEach(function (i) {
    i.addEventListener('focus', function () { if (!i.value) i.value = '+7'; });
    i.addEventListener('input', function () { i.value = fmt(i.value); });
    i.addEventListener('blur', function () { if (i.value === '+7') i.value = ''; });
  });

  /* ---------- forms (demo, без сервера) ---------- */
  $$('[data-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required]', f).forEach(function (i) {
        var wrap = i.closest('.field');
        var v = i.value.trim(), bad = !v;
        if (!bad && i.type === 'email') bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
        if (!bad && i.hasAttribute('data-tel')) bad = v.replace(/\D/g, '').length < 11;
        wrap.classList.toggle('is-bad', bad);
        if (bad) ok = false;
      });
      var btn = $('button[type=submit]', f);
      if (!ok) { btn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
      var t = btn.textContent;
      btn.textContent = 'Заявка отправлена ✓';
      btn.classList.add('is-ok');
      setTimeout(function () { btn.textContent = t; btn.classList.remove('is-ok'); f.reset(); }, 3200);
    });
    $$('input', f).forEach(function (i) {
      i.addEventListener('input', function () { var w = i.closest('.field'); if (w) w.classList.remove('is-bad'); });
    });
  });
})();
