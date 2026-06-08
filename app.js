/* =============================================
   PORTFOLIO APP.JS – Phan Anh Tuấn
   ============================================= */

/* ===== NAVIGATION ===== */
function navigateTo(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll(`.nav-link[data-section="${sectionId}"]`).forEach(l => l.classList.add('active'));

  if (sectionId === 'summary') startCounters();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== TYPING ANIMATION ===== */
const phrases = [
  'Sinh viên Khoa học Máy tính 💻',
  'Đại học Việt Nhật – VJU 🎓',
  'Đam mê AI & Lập trình 🤖',
  'MSSV: 25112120 🪪',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeLoop() {
  if (!typingEl) return;
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typingEl.textContent = current.slice(0, --charIndex);
  } else {
    typingEl.textContent = current.slice(0, ++charIndex);
  }

  let delay = isDeleting ? 50 : 90;
  if (!isDeleting && charIndex === current.length) { delay = 2000; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 300; }

  setTimeout(typeLoop, delay);
}
typeLoop();

/* ===== PARTICLE / STAR BACKGROUND ===== */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const EMOJIS = ['✦','✧','⋆','·','✿','❀','♡','☆'];

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 10 + 4,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.4 + 0.1,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    pulse: Math.random() * Math.PI * 2,
  };
}

for (let i = 0; i < 40; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += 0.02;
    const op = p.opacity + Math.sin(p.pulse) * 0.08;

    if (p.x < -20) p.x = canvas.width + 20;
    if (p.x > canvas.width + 20) p.x = -20;
    if (p.y < -20) p.y = canvas.height + 20;
    if (p.y > canvas.height + 20) p.y = -20;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, op));
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.emoji, p.x, p.y);
    ctx.restore();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ===== SCROLL FADE IN ===== */
function observeFadeIns() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
observeFadeIns();

/* ===== COUNTER ANIMATION ===== */
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  document.querySelectorAll('.stat-num').forEach(el => {
    const raw   = el.textContent.trim();
    const isPercent = raw.endsWith('%');
    const target = parseInt(raw);
    if (isNaN(target)) return;

    let current = 0;
    const step  = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (isPercent ? '%' : '');
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

/* ===== SPARKLE ON HOVER ===== */
function addSparkle(e) {
  const el = document.createElement('div');
  el.className = 'sparkle';
  el.textContent = ['✨','⭐','💫','✦'][Math.floor(Math.random() * 4)];
  el.style.cssText = `
    left: ${e.offsetX}px;
    top:  ${e.offsetY}px;
    font-size: ${12 + Math.random() * 10}px;
    position: absolute;
    pointer-events: none;
    z-index: 10;
  `;
  e.currentTarget.style.position = 'relative';
  e.currentTarget.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

document.querySelectorAll('.goal-card, .stat-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', addSparkle);
});

/* ===== SMOOTH PAGE HASH LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    if (['home','projects','summary'].includes(id)) navigateTo(id);
  });
});

/* ===== BÀI 1 GALLERY & LIGHTBOX ===== */
document.addEventListener('DOMContentLoaded', () => {
  const thumbItems = document.querySelectorAll('.thumb-item');
  const activeImg = document.getElementById('activeGalleryImage');
  const activeBadge = document.getElementById('activeStepBadge');
  const activeTitle = document.getElementById('activeStepTitle');
  const activeDesc = document.getElementById('activeStepDesc');
  const activeContainer = document.querySelector('.active-image-container');

  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxStep = document.getElementById('lightboxStep');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function updateActiveImage(index) {
    currentIndex = parseInt(index);
    thumbItems.forEach((item, idx) => {
      if (idx === currentIndex) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        item.classList.remove('active');
      }
    });

    const activeItem = thumbItems[currentIndex];
    if (activeItem) {
      const src = activeItem.getAttribute('data-src');
      const title = activeItem.getAttribute('data-title');
      const desc = activeItem.getAttribute('data-desc');

      if (activeImg) {
        activeImg.style.opacity = '0';
        setTimeout(() => {
          activeImg.src = src;
          activeImg.style.opacity = '1';
        }, 150);
      }

      if (activeBadge) activeBadge.textContent = `Bước ${currentIndex + 1} / ${thumbItems.length}`;
      if (activeTitle) activeTitle.textContent = title;
      if (activeDesc) activeDesc.textContent = desc;
    }
  }

  thumbItems.forEach(item => {
    item.addEventListener('click', () => {
      updateActiveImage(item.getAttribute('data-index'));
    });
  });

  function openLightbox() {
    const activeItem = thumbItems[currentIndex];
    if (activeItem && lightbox) {
      if (lightboxImg) lightboxImg.src = activeItem.getAttribute('data-src');
      if (lightboxStep) lightboxStep.textContent = `Bước ${currentIndex + 1} / ${thumbItems.length}`;
      if (lightboxTitle) lightboxTitle.textContent = activeItem.getAttribute('data-title');
      if (lightboxDesc) lightboxDesc.textContent = activeItem.getAttribute('data-desc');
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % thumbItems.length;
    updateActiveImage(currentIndex);
    if (lightbox && lightbox.classList.contains('open')) {
      const activeItem = thumbItems[currentIndex];
      if (lightboxImg) lightboxImg.src = activeItem.getAttribute('data-src');
      if (lightboxStep) lightboxStep.textContent = `Bước ${currentIndex + 1} / ${thumbItems.length}`;
      if (lightboxTitle) lightboxTitle.textContent = activeItem.getAttribute('data-title');
      if (lightboxDesc) lightboxDesc.textContent = activeItem.getAttribute('data-desc');
    }
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + thumbItems.length) % thumbItems.length;
    updateActiveImage(currentIndex);
    if (lightbox && lightbox.classList.contains('open')) {
      const activeItem = thumbItems[currentIndex];
      if (lightboxImg) lightboxImg.src = activeItem.getAttribute('data-src');
      if (lightboxStep) lightboxStep.textContent = `Bước ${currentIndex + 1} / ${thumbItems.length}`;
      if (lightboxTitle) lightboxTitle.textContent = activeItem.getAttribute('data-title');
      if (lightboxDesc) lightboxDesc.textContent = activeItem.getAttribute('data-desc');
    }
  }

  if (activeContainer) activeContainer.addEventListener('click', openLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
});

/* ===== ACTIVE NAV ON LOAD ===== */
navigateTo('home');

