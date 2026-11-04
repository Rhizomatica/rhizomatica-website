// rhizomatica — minimal UI interactions (no dependencies)
(function () {
  'use strict';

  // ---- Helpers -----------------------------------------------------------

  function loadPartial(url, target, onDone) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        target.innerHTML = xhr.responseText;
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

    var links = document.querySelectorAll('.primary-nav a, .mobile-nav a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === page) {
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
    loadPartial('navbar.html', navbarEl, function () {
      initMobileMenu();
      setActiveNav();
    });
  }

  if (footerEl) {
    loadPartial('footer.html', footerEl);
  }

  // Accordion items live in the static page content, so init immediately.
  initAccordion();
})();
