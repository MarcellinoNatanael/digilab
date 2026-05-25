/* ============================================================
   DigiLab — article-1.js
   JavaScript khusus halaman article-1.html
   ============================================================ */

/* ── Reading Progress Bar ─────────────────────────────────── */
function initReadingProgress() {
  const bar = document.getElementById('readProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const doc  = document.documentElement;
    const top  = doc.scrollTop  || document.body.scrollTop;
    const h    = doc.scrollHeight - doc.clientHeight;
    const pct  = h > 0 ? (top / h) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ── Copy Link ────────────────────────────────────────────── */
function copyLink() {
  const url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => showCopyToast());
  } else {
    const el = document.createElement('textarea');
    el.value = url;
    el.style.position = 'fixed';
    el.style.opacity  = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showCopyToast();
  }
}

function showCopyToast() {
  let toast = document.getElementById('copyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.style.cssText = `
      position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%);
      background:#0F172A; color:#fff; padding:0.55rem 1.25rem;
      border-radius:30px; font-size:0.82rem; font-weight:500;
      z-index:9999; pointer-events:none;
      box-shadow:0 4px 16px rgba(0,0,0,0.15);
      transition:opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = 'Link berhasil disalin!';
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

/* ── Smooth Scroll for TOC ────────────────────────────────── */
function initTocScroll() {
  document.querySelectorAll('.toc a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Mobile Nav Toggle (shared, safe to re-declare) ──────── */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
}

/* ── Fade-in on Scroll ────────────────────────────────────── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initTocScroll();
  initNavToggle();
  initFadeIn();
});