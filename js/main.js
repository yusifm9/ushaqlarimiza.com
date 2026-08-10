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

  /* -- TEAM PHOTO FALLBACKS -- */
  document.querySelectorAll('.team-photo img').forEach(img => {
    const hideBroken = () => {
      if (img.complete && img.naturalWidth === 0) img.remove();
    };
    img.addEventListener('error', () => img.remove());
    hideBroken();
  });

  /* -- PARTNER LOGO MARQUEE -- */
  document.querySelectorAll('[data-partner-marquee]').forEach(marquee => {
    if (marquee.dataset.partnerMarqueeReady === 'true') return;
    marquee.dataset.partnerMarqueeReady = 'true';

    const viewport = marquee.querySelector('[data-partner-viewport]');
    const track = marquee.querySelector('[data-partner-track]');
    const prev = marquee.querySelector('[data-partner-prev]');
    const next = marquee.querySelector('[data-partner-next]');
    if (!viewport || !track) return;

    Array.from(track.children).forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    let singleWidth = 0;
    let pauseUntil = 0;
    const defaultDirection = -1;
    let direction = defaultDirection;
    const speed = 1.15;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measure = () => {
      singleWidth = track.scrollWidth / 2;
      if (singleWidth > 0 && viewport.scrollLeft === 0) viewport.scrollLeft = singleWidth;
    };

    const wrap = () => {
      if (!singleWidth) return;
      if (viewport.scrollLeft <= 0) viewport.scrollLeft += singleWidth;
      if (viewport.scrollLeft >= singleWidth) viewport.scrollLeft -= singleWidth;
    };

    const nudge = sign => {
      measure();
      const distance = Math.min(380, Math.max(220, viewport.clientWidth * 0.45));
      if (sign < 0 && viewport.scrollLeft < distance) viewport.scrollLeft += singleWidth;
      if (sign > 0 && viewport.scrollLeft > singleWidth - distance) viewport.scrollLeft -= singleWidth;
      direction = sign;
      pauseUntil = performance.now() + 850;
      viewport.scrollBy({ left: sign * distance, behavior: 'smooth' });
      window.setTimeout(() => {
        wrap();
        direction = defaultDirection;
      }, 900);
    };

    prev?.addEventListener('click', () => nudge(-1));
    next?.addEventListener('click', () => nudge(1));
    window.addEventListener('resize', measure, { passive: true });

    measure();
    if (!reduceMotion) {
      const animate = time => {
        if (time > pauseUntil) {
          viewport.scrollLeft += direction * speed;
          wrap();
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  });

  /* -- CONTACT FORM -- */
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(contactForm => {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const name = contactForm.querySelector('input[type="text"]')?.value.trim() || '';
      const email = contactForm.querySelector('input[type="email"]')?.value.trim() || '';
      const message = contactForm.querySelector('textarea')?.value.trim() || '';
      const orig = btn.textContent;
      const subject = encodeURIComponent(name ? `Website inquiry from ${name}` : 'Website inquiry for UO');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      btn.textContent = 'Opening email...';
      btn.style.background = '#6FBF9A';
      window.location.href = `mailto:ushaqlarimizaoyredek@gmail.com?subject=${subject}&body=${body}`;
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; contactForm.reset(); }, 3000);
    });
  });

});
