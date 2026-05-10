// js/main.js

document.addEventListener('DOMContentLoaded', () => {

  /* -- NAVBAR SCROLL SHRINK -- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* -- MOBILE NAV TOGGLE -- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      const spans = toggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* -- ACTIVE NAV LINK -- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* -- ANIMATED NUMBER COUNTERS -- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const easeOut = t => t * (2 - t);
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const val = target * easeOut(p);
        el.textContent = prefix + Math.floor(val) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.animated) {
          e.target.dataset.animated = 'true';
          animateCounter(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  /* -- SCROLL REVEAL -- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => ro.observe(el));
  }

  /* -- CONTACT FORM -- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = 'Sent!';
      btn.style.background = '#6FBF9A';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; contactForm.reset(); }, 3000);
    });
  }

});
