/* JNIT Inc — Page transitions and page-level interactions */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Page transitions: fade out, then navigate ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank' || a.hasAttribute('download')) return;
    if (/^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;
    if (href.split('#')[0] === '' ) return;
    if (reduce) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function () { window.location.href = a.href; }, 220);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) document.body.classList.remove('is-leaving');
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Blog: search + category filter ---------- */
  var blogGrid = document.querySelector('[data-blog-grid]');
  if (blogGrid) {
    var search = document.getElementById('blog-search');
    var chips = document.querySelectorAll('[data-filter]');
    var empty = document.querySelector('[data-empty]');
    var active = 'all';

    function apply() {
      var q = (search && search.value || '').trim().toLowerCase();
      var shown = 0;
      blogGrid.querySelectorAll('.post-card').forEach(function (card) {
        var matchCat = active === 'all' || card.dataset.category === active;
        var matchText = !q || card.textContent.toLowerCase().indexOf(q) > -1;
        var show = matchCat && matchText;
        card.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        active = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
    document.querySelectorAll('[data-tag]').forEach(function (t) {
      t.addEventListener('click', function () { if (search) { search.value = t.dataset.tag; apply(); search.focus(); } });
    });
  }

  /* ---------- Careers: filter + job modal ---------- */
  var jobList = document.querySelector('[data-job-list]');
  if (jobList) {
    var jobChips = document.querySelectorAll('[data-job-filter]');
    jobChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.dataset.jobFilter;
        jobChips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        jobList.querySelectorAll('.job-card').forEach(function (card) {
          card.hidden = !(f === 'all' || card.dataset.type === f);
        });
      });
    });

    var modal = document.getElementById('job-modal');
    if (modal) {
      jobList.querySelectorAll('[data-job-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var card = btn.closest('.job-card');
          var tpl = card.querySelector('template');
          modal.querySelector('[data-m-title]').textContent = card.querySelector('h3').textContent;
          modal.querySelector('[data-m-dept]').textContent = card.querySelector('.job-dept').textContent;
          var pills = modal.querySelector('[data-m-pills]');
          pills.innerHTML = '';
          card.querySelectorAll('.job-meta strong').forEach(function (m) {
            var s = document.createElement('span'); s.className = 'pill'; s.textContent = m.textContent; pills.appendChild(s);
          });
          var bodyEl = modal.querySelector('[data-m-body]');
          bodyEl.innerHTML = '';
          if (tpl) bodyEl.appendChild(tpl.content.cloneNode(true));
          if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
        });
      });
      modal.querySelectorAll('[data-m-close]').forEach(function (b) {
        b.addEventListener('click', function () { modal.close ? modal.close() : modal.removeAttribute('open'); });
      });
      modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
    }
  }

  /* ---------- Recruiter on Demand: interactive capacity visual ---------- */
  var range = document.getElementById('recruiter-range');
  if (range) {
    var out = document.getElementById('recruiter-out');
    var label = document.getElementById('recruiter-label');
    var labels = {
      1: 'A single dedicated recruiter embedded with your hiring team.',
      2: 'A small pod covering parallel requisitions.',
      3: 'A focused team for a hiring sprint across several roles.',
      4: 'An extended team for a larger ramp-up.',
      5: 'A scaled team for high-volume or multi-location hiring.',
      6: 'Full-capacity support, scaled back down when you are done.'
    };
    function renderRecruiters() {
      var n = parseInt(range.value, 10);
      out.textContent = n;
      label.textContent = labels[n];
      range.setAttribute('aria-valuetext', n + (n === 1 ? ' recruiter' : ' recruiters'));
      document.querySelectorAll('.rv-recruiter').forEach(function (el, i) { el.classList.toggle('on', i < n); });
      document.querySelectorAll('.rv-link').forEach(function (el) {
        el.classList.toggle('on', parseInt(el.dataset.r, 10) < n);
      });
    }
    range.addEventListener('input', renderRecruiters);
    renderRecruiters();
  }

  /* ---------- Blog detail: copy link ---------- */
  document.querySelectorAll('[data-copy-link]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var done = function () { btn.setAttribute('aria-label', 'Link copied'); btn.title = 'Link copied'; };
      if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).then(done, done); else done();
    });
  });
})();
