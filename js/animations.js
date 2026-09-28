/* JNIT Inc — Motion system (IntersectionObserver + rAF, transform/opacity only) */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Freeze SMIL particle motion for reduced-motion users */
  if (reduce) document.querySelectorAll('svg').forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });

  /* ---------- Stagger indices ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', i);
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', group.dataset.stagger || '');
    });
  });
  document.querySelectorAll('.reveal-lines').forEach(function (h) {
    h.querySelectorAll('.line').forEach(function (l, i) { l.style.setProperty('--i', i); });
  });

  /* SVG draw-in: measure path lengths */
  document.querySelectorAll('.draw-in').forEach(function (svg) {
    svg.querySelectorAll('path, line, polyline').forEach(function (p) {
      try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch (e) { /* noop */ }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal], .reveal-lines, .draw-in, [data-count], [data-sequence], .impact-grid');
  if (!hasIO || reduce) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.hasAttribute('data-count')) countUp(entry.target);
        if (entry.target.hasAttribute('data-sequence')) startSequence(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) {
      /* Above-the-fold hero content animates in immediately on load */
      if (el.closest('.home-hero, .page-hero, .article-hero, .auth')) {
        el.classList.add('is-visible');
        if (el.hasAttribute('data-count')) countUp(el);
        if (el.hasAttribute('data-sequence')) startSequence(el);
        return;
      }
      io.observe(el);
    });
  }

  /* ---------- Counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var pad = el.dataset.pad ? parseInt(el.dataset.pad, 10) : 0;
    var dur = 1600, start = null;
    function fmt(v) { var s = String(Math.round(v)); while (s.length < pad) s = '0' + s; return s + suffix; }
    if (reduce) { el.textContent = fmt(target); return; }
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (reduce || !hasIO) document.querySelectorAll('[data-count]').forEach(countUp);

  /* ---------- Sequenced infographics (journeys, pipelines, funnels) ---------- */
  function startSequence(root) {
    if (root._seq) return;
    var steps = root.querySelectorAll('[data-seq-step]');
    var links = root.querySelectorAll('.seq-link');
    if (!steps.length) return;
    var loop = root.dataset.sequence === 'loop';
    var i = 0;
    function render() {
      steps.forEach(function (s, k) {
        s.classList.toggle('active', k === i);
        s.classList.toggle('done', k < i);
        if (root.classList.contains('funnel')) s.classList.toggle('active', k <= i);
      });
      links.forEach(function (l, k) { l.classList.toggle('active', k < i); });
    }
    if (reduce) { i = steps.length - 1; render(); return; }
    render();
    root._seq = setInterval(function () {
      i++;
      if (i >= steps.length) {
        if (!loop) { clearInterval(root._seq); return; }
        i = 0;
      }
      render();
    }, parseInt(root.dataset.interval || 1100, 10));
  }
  if (reduce || !hasIO) document.querySelectorAll('[data-sequence]').forEach(startSequence);

  /* ---------- Story flow (home) ---------- */
  var flow = document.querySelector('.story-flow');
  if (flow && !reduce) {
    var fSteps = flow.querySelectorAll('.sf-step'), fi = 0;
    setInterval(function () {
      fSteps.forEach(function (s, k) { s.classList.toggle('active', k === fi); });
      fi = (fi + 1) % fSteps.length;
    }, 1400);
  }

  /* ---------- Scroll-linked progress: process tracks, timelines, reading bar ---------- */
  var tracks = document.querySelectorAll('.process, .vtimeline');
  var reading = document.querySelector('.reading-progress');
  var article = document.querySelector('.article-body');
  var parallax = document.querySelectorAll('[data-parallax]');
  var ticking = false;

  function progressFor(el, startFactor, endFactor) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * startFactor, end = vh * endFactor;
    var total = r.height + (start - end);
    return Math.max(0, Math.min(1, (start - r.top) / total));
  }

  function onScroll() {
    ticking = false;
    tracks.forEach(function (t) {
      var p = progressFor(t, 0.85, 0.45);
      t.style.setProperty('--progress', p.toFixed(3));
      var items = t.querySelectorAll('.step, .vt-item');
      items.forEach(function (it, k) {
        var threshold = items.length > 1 ? k / (items.length - 1) : 0;
        it.classList.toggle('is-lit', p >= threshold * 0.92 + 0.02 || reduce);
      });
      var fill = t.querySelector('.process-track i');
      if (fill) fill.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    });
    if (reading && article) {
      var pr = progressFor(article, 0.2, 0.8);
      reading.style.setProperty('--progress', pr.toFixed(3));
    }
    if (!reduce) {
      parallax.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0.15;
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = 'translate3d(0,' + (center * -speed).toFixed(1) + 'px,0)';
      });
    }
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  /* ---------- Pointer effects (fine pointers only) ---------- */
  if (finePointer && !reduce) {
    /* Magnetic buttons */
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });

    /* Spotlight cards */
    document.querySelectorAll('.svc-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* Depth layers inside hero visuals */
    document.querySelectorAll('[data-depth-scene]').forEach(function (scene) {
      var layers = scene.querySelectorAll('[data-depth]');
      var raf = null, tx = 0, ty = 0;
      scene.addEventListener('mousemove', function (e) {
        var r = scene.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      scene.addEventListener('mouseleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
      function apply() {
        raf = null;
        layers.forEach(function (l) {
          var d = parseFloat(l.dataset.depth) || 10;
          l.style.translate = (tx * d).toFixed(1) + 'px ' + (ty * d).toFixed(1) + 'px';
        });
      }
    });
  }

  /* ---------- Pause decorative animation when off-screen ---------- */
  if (hasIO) {
    var pauseIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-paused', !en.isIntersecting); });
    }, { rootMargin: '100px' });
    document.querySelectorAll('.hero-visual, .visual-frame, .cta-band, .location-map, .rv-stage, .bridge-center').forEach(function (el) { pauseIO.observe(el); });
  }

  /* ---------- Home hero constellation canvas ---------- */
  var canvas = document.querySelector('.hero-canvas');
  if (canvas && !reduce && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pts = [], w = 0, h = 0, running = true, mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, (w * h) / 22000));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 });
      }
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 16000) {
            ctx.strokeStyle = 'rgba(95,227,255,' + (0.14 * (1 - d / 16000)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        var md = (p.x - mouse.x) * (p.x - mouse.x) + (p.y - mouse.y) * (p.y - mouse.y);
        ctx.fillStyle = md < 14000 ? 'rgba(95,227,255,.95)' : 'rgba(170,190,255,.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, md < 14000 ? p.r + 1 : p.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener('resize', resize);
    canvas.parentElement.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    if (hasIO) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; requestAnimationFrame(frame); }
        running = vis;
      }).observe(canvas);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Article table of contents highlight ---------- */
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && hasIO) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var tocIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var link = map[en.target.id]; if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) tocIO.observe(el); });
  }
})();
