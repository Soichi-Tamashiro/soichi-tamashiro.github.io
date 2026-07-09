(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- scroll reveal ---- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal, .reveal-card'));
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---- scrollspy (homepage nav) ---- */
  var navLinks = [].slice.call(document.querySelectorAll('.nav-links a'));
  if (navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') map[href.slice(1)] = a;
    });
    var secs = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove('active'); });
            if (map[e.target.id]) map[e.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      secs.forEach(function (s) { so.observe(s); });
    }
  }

  /* ---- mobile menu (homepage) ---- */
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav-toggle');
  if (nav && burger) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    navLinks.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false); });
  }

  /* ---- number count-up ---- */
  function setup(el) {
    var text = el.textContent.trim();
    var m = text.match(/^([^\d]*)(\d[\d.]*)(.*)$/);
    if (!m) return null;
    var target = parseFloat(m[2]);
    if (isNaN(target)) return null;
    return { el: el, prefix: m[1], suffix: m[3], target: target, isInt: m[2].indexOf('.') === -1, final: text };
  }
  function run(o) {
    var dur = 850, t0 = null;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = o.target * eased;
      o.el.textContent = o.prefix + (o.isInt ? Math.round(v) : v.toFixed(1)) + o.suffix;
      if (p < 1) requestAnimationFrame(frame); else o.el.textContent = o.final;
    }
    requestAnimationFrame(frame);
  }
  var numEls = [].slice.call(document.querySelectorAll('.stat .n'));
  if (numEls.length && !reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && e.target.__co) { run(e.target.__co); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    numEls.forEach(function (el) {
      var o = setup(el);
      if (o) { el.__co = o; el.textContent = o.prefix + '0' + o.suffix; co.observe(el); }
    });
  }

  /* ---- preferences: theme + font ---- */
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var themeBtns = [].slice.call(document.querySelectorAll('[data-toggle="theme"]'));
  function syncTheme() {
    var light = root.getAttribute('data-theme') === 'light';
    themeBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', light ? 'true' : 'false');
      b.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      b.classList.toggle('on', light);
    });
  }
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      store('theme', next);
      syncTheme();
    });
  });
  syncTheme();

  var fontBtns = [].slice.call(document.querySelectorAll('[data-toggle="font"]'));
  function syncFont() {
    var on = root.getAttribute('data-font') === 'legible';
    fontBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', on ? 'Use the default font' : 'Use a dyslexia-friendly font');
      b.classList.toggle('on', on);
    });
  }
  fontBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      if (root.getAttribute('data-font') === 'legible') { root.removeAttribute('data-font'); store('font', 'default'); }
      else { root.setAttribute('data-font', 'legible'); store('font', 'legible'); }
      syncFont();
    });
  });
  syncFont();
})();
