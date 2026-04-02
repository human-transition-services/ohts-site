// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Mark active nav link
  var path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  if (path === '' || path === 'index.html') path = 'index';
  var links = document.querySelectorAll('nav a');
  links.forEach(function (link) {
    var href = link.getAttribute('href').replace('.html', '').replace('./', '').replace(/\/$/, '');
    if (href === '' || href === 'index') href = 'index';
    if (href === path) link.classList.add('active');
  });
});
