// rhizomatica — minimal UI interactions (no dependencies)
(function () {
  'use strict';

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

  // Close the menu after tapping a link
  var links = mobileNav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  }
})();
