/* ============================================================
   Kuje Area Council – Global Animation Enhancements (JS)
   Shared across every page. Loaded at the end of <body>,
   before each page's inline scripts.
   ============================================================ */
(function () {
  'use strict';

  var prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* noop */ }

  function hasIO() {
    return typeof IntersectionObserver !== 'undefined';
  }

  /* ========== ANIMATED COUNTER FOR STATISTICS ========== */
  function animateCounter(element, target, duration) {
    var suffix = element.getAttribute('data-suffix') || '';
    var prefix = element.getAttribute('data-prefix') || '';

    if (prefersReducedMotion || !window.requestAnimationFrame) {
      element.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }

    var start = 0;
    var increment = target / (duration / 16);
    var current = start;

    function updateCounter() {
      current += increment;
      if (current < target) {
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    updateCounter();
  }

  var statCards = document.querySelectorAll('.stat-card .stat-value');
  if (statCards.length) {
    var counterObserver = null;

    function startCounter(statValue) {
      var targetAttr = statValue.getAttribute('data-target');
      if (!targetAttr) return;

      var target = parseInt(targetAttr.replace(/[^0-9]/g, ''), 10);
      if (isNaN(target)) return;

      animateCounter(statValue, target, 2000);

      if (counterObserver) {
        counterObserver.unobserve(statValue);
      }
    }

    if (hasIO()) {
      counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startCounter(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statCards.forEach(function (statValue) {
        counterObserver.observe(statValue);
      });
    } else {
      statCards.forEach(startCounter);
    }
  }

  /* ========== SCROLL REVEAL ANIMATION ==========
     Existing pages already drive `.reveal.active`; this adds the
     `visible` class (and `active` for safety) so the shared
     animation CSS reveals elements consistently everywhere. */
  var revealElements = document.querySelectorAll('.reveal');

  function revealElement(el) {
    if (!el.classList.contains('active')) el.classList.add('active');
    if (!el.classList.contains('visible')) el.classList.add('visible');
  }

  if (revealElements.length) {
    if (hasIO()) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      revealElements.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealElements.forEach(revealElement);
    }
  }

  /* ========== TIMELINE REVEAL (history page) ========== */
  var timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length && !prefersReducedMotion) {
    if (hasIO()) {
      var timelineObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            timelineObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      timelineItems.forEach(function (item) { timelineObserver.observe(item); });
    } else {
      timelineItems.forEach(function (item) { item.classList.add('visible'); });
    }
  }

  /* ========== SUBMIT BUTTON LOADING STATE ==========
     The `.btn-submit.loading::after` spinner (see animations.css)
     is applied when a page adds the `loading` class to its submit
     button. contact.html already shows its own "⏳ Sending..."
     state, so no automatic class toggling is forced here. */

  /* ========== ANCHOR / BACK-TO-TOP SMOOTH SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  console.log('🎞️ Kuje Area Council animations loaded');
})();
