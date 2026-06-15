/* =====================================================================
   BARELY WORN — main.js
   Self-contained interactions + progressive enhancement with
   GSAP / ScrollTrigger / Lenis (loaded via CDN when available).
   Works fully without any external library (graceful in previews).
   ===================================================================== */
(function () {
  'use strict';

  /* flag that JS is running (enables hidden initial reveal states) */
  document.documentElement.classList.add('js');

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  var hasLenis = typeof window.Lenis !== 'undefined';

  /* ----------------------------------------------------------------
     Lenis smooth scroll  (+ bridge to ScrollTrigger)
  ---------------------------------------------------------------- */
  var lenis = null;
  if (hasLenis && !prefersReduced) {
    try {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        smoothTouch: false
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);

      if (hasST) {
        lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      }
    } catch (e) { lenis = null; }
  }

  /* anchor links → smooth scroll via Lenis (or native) */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) { lenis.scrollTo(target, { offset: -10 }); }
      else { target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' }); }
    });
  });

  /* ----------------------------------------------------------------
     Header scroll state
  ---------------------------------------------------------------- */
  var header = document.querySelector('.header');
  var lastY = 0;
  function onScrollHeader() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ----------------------------------------------------------------
     Mobile menu
  ---------------------------------------------------------------- */
  var burger = document.querySelector('.burger');
  var body = document.body;
  if (burger) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('menu-open');
      body.style.overflow = open ? 'hidden' : '';
      if (open && lenis) lenis.stop(); else if (lenis) lenis.start();
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        body.classList.remove('menu-open');
        body.style.overflow = '';
        if (lenis) lenis.start();
      });
    });
  }

  /* ----------------------------------------------------------------
     Reveal on scroll (IntersectionObserver) + stagger
  ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale, .mask-trigger');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          /* assign a stagger delay based on siblings with same data-stagger group */
          if (!el.style.getPropertyValue('--d')) {
            el.style.setProperty('--d', (parseInt(el.dataset.delay || '0', 10)) + 'ms');
          }
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) {
      /* light stagger for grids: use index within parent */
      var parent = el.parentElement;
      if (parent && parent.dataset.stagger) {
        var sibs = Array.prototype.filter.call(parent.children, function (c) {
          return c.matches('.reveal, .reveal-scale');
        });
        var idx = sibs.indexOf(el);
        el.style.setProperty('--d', (idx * 70) + 'ms');
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------------------
     Parallax engine — uses GSAP/ScrollTrigger if present,
     otherwise a lightweight rAF scroll handler.
  ---------------------------------------------------------------- */
  if (!prefersReduced) {

    /* --- Hero masthead drift --- */
    var wBarely = document.querySelector('.hero__word--b');
    var wWorn = document.querySelector('.hero__word--w');
    var hero = document.querySelector('.hero');
    var heroMedia = document.querySelector('.hero__media');

    if (hasST && hero) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      if (wBarely) {
        window.gsap.to(wBarely, {
          xPercent: -14, yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 }
        });
      }
      if (wWorn) {
        window.gsap.to(wWorn, {
          xPercent: 16, yPercent: 9, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 }
        });
      }
      if (heroMedia) {
        window.gsap.to(heroMedia, {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 }
        });
      }
    } else if (hero) {
      /* rAF fallback */
      var ticking = false;
      function heroParallax() {
        var h = hero.offsetHeight || window.innerHeight;
        var p = Math.min(1, Math.max(0, window.scrollY / h));
        if (wBarely) wBarely.style.transform = 'translate(' + (-14 * p) + 'vw,' + (-8 * p) + 'vh)';
        if (wWorn) wWorn.style.transform = 'translate(' + (16 * p) + 'vw,' + (9 * p) + 'vh)';
        if (heroMedia) heroMedia.style.transform = 'translateY(' + (12 * p) + 'vh)';
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) { requestAnimationFrame(heroParallax); ticking = true; }
      }, { passive: true });
      heroParallax();
    }

    /* --- Depth parallax for [data-speed] elements (ghost words, images, cards) --- */
    var depthEls = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
    if (depthEls.length) {
      if (hasST) {
        depthEls.forEach(function (el) {
          var speed = parseFloat(el.dataset.speed) || 0;
          window.gsap.fromTo(el, { y: -speed * 40 }, {
            y: speed * 40, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
          });
        });
      } else if (canHover) {
        var dTicking = false;
        function depthTick() {
          var vh = window.innerHeight;
          depthEls.forEach(function (el) {
            var speed = parseFloat(el.dataset.speed) || 0;
            var r = el.getBoundingClientRect();
            var center = r.top + r.height / 2;
            var prog = (center - vh / 2) / vh; /* -1 (below) .. +1 (above) */
            el.style.transform = 'translate3d(0,' + (-prog * speed * 48) + 'px,0)';
          });
          dTicking = false;
        }
        window.addEventListener('scroll', function () {
          if (!dTicking) { requestAnimationFrame(depthTick); dTicking = true; }
        }, { passive: true });
        depthTick();
        window.addEventListener('resize', depthTick);
      }
    }
  }

  /* ----------------------------------------------------------------
     Showroom category filter
  ---------------------------------------------------------------- */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var buttons = filterBar.querySelectorAll('.filter');
    var items = document.querySelectorAll('[data-category]');
    var countEl = filterBar.querySelector('[data-count]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.dataset.filter;
        var shown = 0;
        items.forEach(function (it) {
          var match = (cat === 'all' || it.dataset.category === cat);
          it.hidden = !match;
          if (match) shown++;
        });
        if (countEl) countEl.textContent = '[ ' + String(shown).padStart(2, '0') + ' / ' + items.length + ' ]';
      });
    });
  }

  /* ----------------------------------------------------------------
     Footer year
  ---------------------------------------------------------------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------
     Theme toggle  (dark = default ⇄ light/peach via [data-theme="light"])
  ---------------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    var root = document.documentElement;
    function isLight() { return root.getAttribute('data-theme') === 'light'; }
    function syncToggle() { themeToggle.setAttribute('aria-pressed', String(!isLight())); }
    syncToggle();

    themeToggle.addEventListener('click', function () {
      root.classList.add('theme-transitioning');
      setTimeout(function () { root.classList.remove('theme-transitioning'); }, 650);
      if (isLight()) {
        root.removeAttribute('data-theme');
        try { localStorage.setItem('bw-theme', 'dark'); } catch (e) {}
      } else {
        root.setAttribute('data-theme', 'light');
        try { localStorage.setItem('bw-theme', 'light'); } catch (e) {}
      }
      syncToggle();
    });

    /* keep the choice in sync across open tabs */
    window.addEventListener('storage', function (e) {
      if (e.key !== 'bw-theme') return;
      if (e.newValue === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
      syncToggle();
    });
  }

})();
