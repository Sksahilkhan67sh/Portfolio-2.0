/* ════════════════════════════════════════════════════════
   SAHIL KHAN — 3D Portfolio JS
   ∙ Particle canvas with mouse repulsion
   ∙ Custom cursor with lag ring
   ∙ Parallax 3D tilt on cards
   ∙ Typing animation
   ∙ Scroll reveal
   ∙ Navbar / scroll-top
   ════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Particle Canvas ────────────────────────────── */
  const canvas  = document.getElementById('bg-canvas');
  const ctx     = canvas.getContext('2d');
  let W, H, mouse = { x: -9999, y: -9999 };

  const COLORS = ['#00f0ff','#bf5fff','#ff3cac','#39ff14','#ffd700','#0088ff'];
  const NUM    = 120;
  const particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : H + 10;
      this.vx  = (Math.random() - 0.5) * 0.4;
      this.vy  = -(Math.random() * 0.6 + 0.2);
      this.r   = Math.random() * 2 + 0.5;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life  = 0;
      this.maxL  = Math.random() * 300 + 200;
    }
    update() {
      // mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 1.5;
        this.vx += (dx / dist) * force * 0.08;
        this.vy += (dy / dist) * force * 0.08;
      }
      this.vx *= 0.98; this.vy *= 0.98;
      this.x  += this.vx; this.y  += this.vy;
      this.life++;
      if (this.life > this.maxL || this.y < -20) this.reset(false);
    }
    draw() {
      const prog = this.life / this.maxL;
      const a = prog < 0.1 ? prog * 10 : prog > 0.85 ? (1 - prog) / 0.15 : 1;
      ctx.save();
      ctx.globalAlpha = this.alpha * a;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col;
      ctx.shadowColor = this.col;
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  // Draw connection lines between nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.strokeStyle = particles[i].col;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* ── 2. Custom Cursor ──────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
  });

  (function lagRing() {
    rx += (mouse.x - rx) * 0.12;
    ry += (mouse.y - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lagRing);
  })();

  // Cursor hover effect
  document.querySelectorAll('a, button, .project-card, .skill-card, .exp-item, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ── 3. 3D Tilt on Cards ───────────────────────────── */
  const tiltCards = document.querySelectorAll(
    '.project-card, .skill-card, .exp-item, .edu-card, .stat-card, .avatar-box, .extra-card, .contact-form'
  );

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = (e.clientX - cx) / (rect.width  / 2);
      const dy      = (e.clientY - cy) / (rect.height / 2);
      const rotX    = -dy * 10;
      const rotY    =  dx * 10;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
      card.style.boxShadow = `
        ${-dx * 20}px ${-dy * 20}px 40px rgba(0,240,255,0.12),
        0 8px 60px rgba(0,240,255,0.06)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });

  /* ── 4. Parallax on Mouse Move ─────────────────────── */
  document.addEventListener('mousemove', e => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;

    // Hero name subtle movement
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
      heroName.style.transform = `translate(${nx * 6}px, ${ny * 4}px)`;
    }

    // Aurora blobs respond to mouse
    document.querySelectorAll('.aurora-blob').forEach((b, i) => {
      const depth = (i + 1) * 0.3;
      b.style.transform = `translate(${nx * 20 * depth}px, ${ny * 15 * depth}px)`;
    });
  });

  /* ── 5. Typing Animation ───────────────────────────── */
  const roles  = ['Full Stack Developer', 'Backend Engineer', 'Python Specialist', 'API Architect', 'ML Enthusiast'];
  const typer  = document.getElementById('typing-text');
  let ri = 0, ci = 0, del = false;

  function type() {
    const cur = roles[ri];
    if (!del) {
      typer.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(type, 1800); return; }
    } else {
      typer.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, del ? 55 : 95);
  }
  if (typer) type();

  /* ── 6. Scroll Reveal ──────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── 7. Navbar scroll ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 400);
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 8. Mobile Menu ────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  /* ── 9. Contact Form ───────────────────────────────── */
  const form = document.getElementById('contact-form');
  const msg  = document.getElementById('form-msg');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res  = await fetch('/contact', { method:'POST', body: data });
      const json = await res.json();
      msg.textContent = json.message || json.error;
      msg.className   = 'form-msg ' + (json.success ? 'success' : 'error');
      if (json.success) form.reset();
    } catch {
      msg.textContent = 'Something went wrong. Try again.';
      msg.className   = 'form-msg error';
    }
  });

  /* ── 10. Copy Email ────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      navigator.clipboard.writeText(el.dataset.copy).then(() => {
        const orig = el.textContent;
        el.textContent = 'Copied!';
        setTimeout(() => el.textContent = orig, 1500);
      });
    });
  });

  /* ── 11. Ripple on Buttons ─────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const rip  = document.createElement('span');
      rip.style.cssText = `
        position:absolute; border-radius:50%;
        width:4px; height:4px;
        background:rgba(255,255,255,0.4);
        left:${e.clientX - rect.left - 2}px;
        top:${e.clientY - rect.top - 2}px;
        transform:scale(0);
        animation:ripple 0.6s linear;
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(rip);
      setTimeout(() => rip.remove(), 700);
    });
  });

  // Ripple keyframe (inject once)
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple{to{transform:scale(80);opacity:0;}}';
    document.head.appendChild(s);
  }

  /* ── 12. Active Nav Link ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const secObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => secObserver.observe(s));

});
