// Reagan Wokorach — Portfolio site behavior

// ── Interactive hero image — subtle 3D tilt + spotlight, follows cursor ──
// A restrained, professional micro-interaction: the photo tilts slightly
// toward the cursor and a soft highlight tracks its position. Disabled on
// touch devices (no meaningful cursor position) and respects users who
// have asked for reduced motion.
const imageFrame = document.querySelector('.image-frame');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (imageFrame && !prefersReducedMotion && !isTouchDevice) {
  const maxTilt = 8; // degrees — kept subtle, not gimmicky

  imageFrame.addEventListener('mousemove', (e) => {
    const rect = imageFrame.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0 → 1
    const y = (e.clientY - rect.top) / rect.height;    // 0 → 1

    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;

    imageFrame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    imageFrame.style.setProperty('--spot-x', `${x * 100}%`);
    imageFrame.style.setProperty('--spot-y', `${y * 100}%`);
  });

  imageFrame.addEventListener('mouseleave', () => {
    imageFrame.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// ── Navbar scroll effect ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile nav toggle ─────────────────────────────────────────────────
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  toggle.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('active');
  });
});

// ── Smooth active nav highlighting ────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => sectionObserver.observe(s));

// ── Scroll reveal ─────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.learning-card, .project-card, .edu-card, .timeline-item, .skill-group')
  .forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

// ── Contact form — submits to Netlify Forms ────────────────────────────
// This site is deployed on Netlify, which captures any form with
// data-netlify="true" automatically — no backend needed. Sending it via
// fetch here, instead of a normal page-reload submit, keeps the user on
// the page and lets us show a real success/error message instead of just
// assuming it worked.
function encodeForm(data) {
  return Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const msg = document.getElementById('formMsg');
    const btn = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());

    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Submission failed');
        msg.textContent = '✓ Message sent! Reagan will get back to you soon.';
        msg.style.color = 'var(--green)';
        form.reset();
      })
      .catch(() => {
        msg.textContent = 'Something went wrong — please email wokorachreagan5030@gmail.com directly instead.';
        msg.style.color = '#ff6b6b';
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = 'Send Message →';
      });
  });
}
