/* JNIT Inc — Header, dropdown and mobile menu */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var body = document.body;

  /* Sticky header state */
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Services dropdown (hover on pointer devices, click + keyboard everywhere) */
  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var trigger = item.querySelector('.dd-trigger');
    var menu = item.querySelector('.dropdown');
    var closeTimer;

    function open() { clearTimeout(closeTimer); item.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
    function close() { item.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      item.classList.contains('is-open') ? close() : open();
    });

    if (window.matchMedia('(hover: hover)').matches) {
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', function () { closeTimer = setTimeout(close, 160); });
    }

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); trigger.focus(); }
      if (e.key === 'ArrowDown' && document.activeElement === trigger) {
        e.preventDefault(); open();
        var first = menu.querySelector('a'); if (first) first.focus();
      }
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) close();
    });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) close(); });
  });

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('mobile-menu');

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.setAttribute('aria-hidden', String(!open));
    if ('inert' in panel) panel.inert = !open;
    if (open) {
      var first = panel.querySelector('a, button');
      setTimeout(function () { if (first) first.focus(); }, 300);
    }
  }

  if (toggle && panel) {
    panel.querySelectorAll('nav > ul > li').forEach(function (li, i) { li.style.setProperty('--i', i); });
    if ('inert' in panel) panel.inert = true;
    toggle.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1120 && body.classList.contains('menu-open')) setMenu(false);
    });

    /* Services accordion inside mobile menu */
    panel.querySelectorAll('.mm-toggle').forEach(function (btn) {
      var sub = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        sub.classList.toggle('is-open', !expanded);
      });
    });
  }
})();
