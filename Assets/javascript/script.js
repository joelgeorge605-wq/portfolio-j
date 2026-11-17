/* ============================================================
   JOELLABS PORTFOLIO — Shared JavaScript
   Handles: footer year, cursor light, scroll progress,
   condensed navbar, card reveal, pointer tilt,
   mobile nav auto-close, active nav link by pathname.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Feature detection --------------------------------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Mark <html> so CSS can gate initial card states */
  document.documentElement.classList.add('js');

  /* ---- Footer year --------------------------------------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Cursor light (fine pointer only) ------------------ */
  var light = document.getElementById('cursorLight');
  if (light && fine) {
    window.addEventListener('pointermove', function (e) {
      light.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    }, { passive: true });
  }

  /* ---- Scroll progress bar + condensed navbar ------------ */
  var bar = null;
  if (!reduce) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
  }
  var nav = document.querySelector('.navbar-custom');
  var ticking = false;
  function onScroll() {
    var y   = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    if (nav) nav.classList.toggle('is-scrolled', y > 24);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- Active nav link by pathname ----------------------- */
  var currentPage = (window.location.pathname.split('/').pop().toLowerCase()) || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var linkPage = href.split('/').pop().toLowerCase();
    link.classList.remove('active');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Mobile nav auto-close on link click --------------- */
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var menu = document.getElementById('navbarMenu');
      if (menu && menu.classList.contains('show')) {
        if (typeof bootstrap !== 'undefined') {
          bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      }
    });
  });

  /* ---- Card-group reveal with IntersectionObserver ------- */
  var groups = document.querySelectorAll('.reveal');
  /* Assign stagger index --k to each tiltable child */
  groups.forEach(function (g) {
    g.querySelectorAll('[data-tilt], .project-card, .card3d').forEach(function (c, i) {
      c.style.setProperty('--k', i);
    });
  });
  function enableTilt(g) {
    g.querySelectorAll('[data-tilt], .project-card, .card3d').forEach(function (c) {
      c.classList.add('tilting');
    });
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
        setTimeout(function () { enableTilt(en.target); }, 1400);
      });
    }, { threshold: 0.1 });
    groups.forEach(function (g) { io.observe(g); });
  } else {
    groups.forEach(function (g) { g.classList.add('in'); enableTilt(g); });
  }

  /* ---- Pointer tilt on [data-tilt] cards ----------------- */
  if (reduce || !fine) return;
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    var k = parseFloat(card.getAttribute('data-tilt')) || 1;
    card.addEventListener('pointermove', function (e) {
      var b = card.getBoundingClientRect();
      var x = (e.clientX - b.left) / b.width  - .5;
      var y = (e.clientY - b.top)  / b.height - .5;
      card.classList.add('tilting');
      card.style.transform = 'rotateX(' + (-y * 11 * k) + 'deg) rotateY(' + (x * 13 * k) + 'deg) translateZ(8px)';
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });

})();
