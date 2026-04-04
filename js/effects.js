/* ========================================
   Standout Design Effects
   Custom cursor, magnetic buttons, text reveals,
   scroll progress, and enhanced animations
   ======================================== */

(function() {
  'use strict';

  // Skip custom cursor on touch devices
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // --- Custom Cursor ---
  if (!isTouch) {
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    var cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    var cursorX = 0, cursorY = 0;
    var dotX = 0, dotY = 0;
    var cursorVisible = false;

    document.addEventListener('mousemove', function(e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
      if (!cursorVisible) {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        cursorVisible = true;
      }
    });

    document.addEventListener('mouseleave', function() {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
      cursorVisible = false;
    });

    // Smooth follow for outer ring
    function animateCursor() {
      dotX += (cursorX - dotX) * 0.15;
      dotY += (cursorY - dotY) * 0.15;
      cursor.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px)';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand cursor on interactive elements
    var interactives = 'a, button, .adventure-card, .skill-card, .contact-btn, .tech-tags span, .nav-toggle';
    document.addEventListener('mouseover', function(e) {
      if (e.target.closest(interactives)) {
        cursor.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.closest(interactives)) {
        cursor.classList.remove('cursor-hover');
      }
    });
  }

  // --- Scroll Progress Bar ---
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // --- Hero Text Split Animation ---
  var heroName = document.querySelector('.hero-name');
  if (heroName) {
    var text = heroName.textContent;
    heroName.innerHTML = '';
    heroName.classList.add('hero-text-reveal');
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'hero-char';
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.style.animationDelay = (0.05 * i + 0.3) + 's';
      heroName.appendChild(span);
    }
  }

  // --- Hero Tagline Fade ---
  var heroTagline = document.querySelector('.hero-tagline');
  if (heroTagline) {
    heroTagline.classList.add('hero-tagline-reveal');
  }

  // --- Magnetic Buttons ---
  if (!isTouch) {
    var magneticEls = document.querySelectorAll('.contact-btn, .nav-logo');
    magneticEls.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });
      el.addEventListener('mouseleave', function() {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      el.addEventListener('mouseenter', function() {
        el.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  // --- Section Title Reveal (clip-path wipe) ---
  var sectionTitles = document.querySelectorAll('.section-title');
  var titleObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('title-visible');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  sectionTitles.forEach(function(title) {
    title.classList.add('title-reveal');
    titleObserver.observe(title);
  });

  // --- Skill card tilt on hover ---
  if (!isTouch) {
    var skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-4px) perspective(600px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'translateY(0) perspective(600px) rotateX(0) rotateY(0)';
      });
    });
  }

  // --- Stat number count-up animation ---
  var stats = document.querySelectorAll('.stat-number');
  var statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var text = el.textContent;
        var match = text.match(/^(\d+)/);
        if (match) {
          var target = parseInt(match[1]);
          var suffix = text.replace(match[1], '');
          var start = 0;
          var duration = 1500;
          var startTime = null;
          function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(function(s) { statObserver.observe(s); });

})();
