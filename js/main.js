// rhizomatica — minimal UI interactions (no dependencies)
(function () {
  'use strict';

  // Site root, derived from where this script lives (works for / and /repo/).
  var scriptSrc = document.currentScript ? document.currentScript.src : '';
  var base = scriptSrc ? scriptSrc.replace(/\/js\/main\.js(\?.*)?$/, '') : '';

  // ---- Helpers -----------------------------------------------------------

  function isExternal(url) {
    return !url ||
      url.charAt(0) === '#' ||
      url.indexOf('//') === 0 ||
      /^https?:/i.test(url) ||
      url.indexOf('mailto:') === 0 ||
      url.indexOf('tel:') === 0 ||
      url.indexOf('data:') === 0;
  }

  function toAbsolute(url) {
    if (isExternal(url)) {
      return url;
    }
    if (url.charAt(0) === '/') {
      return base + url;
    }
    return base + '/' + url;
  }

  // Rewrite relative links inside an injected partial so they point at the
  // site root rather than the current page's directory.
  function fixPartialLinks(root) {
    var links = root.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (!isExternal(href)) {
        links[i].setAttribute('href', toAbsolute(href));
      }
    }
  }

  function loadPartial(url, target, onDone) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        target.innerHTML = xhr.responseText;
        fixPartialLinks(target);
        if (onDone) {
          onDone();
        }
      }
    };

    xhr.open('GET', url, true);
    xhr.send();
  }

  // ---- Mobile navigation (initialized after the navbar is injected) ------

  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var mobileNav = document.getElementById('mobileNav');

    if (!hamburger || !mobileNav) {
      return;
    }

    function toggleMenu() {
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    hamburger.addEventListener('click', toggleMenu);

    var links = mobileNav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // ---- Highlight the current page in the navigation ----------------------

  function setActiveNav() {
    var page = location.pathname.split('/').pop() || 'index.html';

    // Sub-pages highlight their parent section
    if (page === 'videos-hf.html') {
      page = 'resources.html';
    }

    // Individual blog posts highlight the Blog section
    if (document.body.classList.contains('page-blog') && page !== 'blog.html') {
      page = 'blog.html';
    }

    var links = document.querySelectorAll('.primary-nav a, .mobile-nav a');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      if (href.split('/').pop() === page) {
        links[i].parentNode.classList.add('active');
      }
    }
  }

  // ---- Collapsible resource groups (accordion) ---------------------------

  function initAccordion() {
    var accordionItems = document.querySelectorAll('.accordion__item');

    for (var j = 0; j < accordionItems.length; j++) {
      (function (item) {
        var header = item.querySelector('.accordion__header');

        if (!header) {
          return;
        }

        header.addEventListener('click', function () {
          var isOpen = item.classList.toggle('is-open');
          header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      })(accordionItems[j]);
    }
  }

  // ---- Inject shared partials --------------------------------------------

  var navbarEl = document.getElementById('site-navbar');
  var footerEl = document.getElementById('site-footer');

  // The mobile menu depends on the navbar, so initialize it after injection.
  if (navbarEl) {
    loadPartial(base + '/navbar.html', navbarEl, function () {
      initMobileMenu();
      setActiveNav();
    });
  }

  if (footerEl) {
    loadPartial(base + '/footer.html', footerEl);
  }

  // Accordion items live in the static page content, so init immediately.
  initAccordion();
})();
