/* ============================================================
   DigiLab — artikel.js
   JavaScript khusus halaman Artikel (artikel.html)
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════
   DATA ARTIKEL — edit image dan url di sini
   ══════════════════════════════════════════════════════════ */
const DEFAULT_ARTICLES = [
  {
    id: 1,
    title: 'Kenapa Game Online Bikin Nagih? Ini Penjelasan Ilmiahnya',
    category: 'Edukasi',
    readTime: '7',
    image: 'img/Gaming.png',       // ← ganti path gambar artikel 1
    date: '25 Mei 2026',
    url: 'artikel_1.html',            // ← ganti href artikel 1
    excerpt: 'Ada mekanisme psikologis kompleks di balik desain game yang membuatmu terus kembali bermain. WHO bahkan sudah mengakuinya sebagai gangguan mental resmi.'
  },
  {
    id: 2,
    title: 'Bagaimana cara bijak dalam bermain online untuk mencegah kecanduan',
    category: 'Psikologi',
    readTime: '4',
    image: 'img/Article_2.png',       // ← ganti path gambar artikel 2
    date: '26 Mei 2025',
    url: 'artikel_2.html',                          // ← isi dengan 'article-2.html' jika sudah ada
    excerpt: 'Kalian pernah mengalami stress saat bermain game online, lakukan hal ini agar tidak terus menerus kecanduan dalam bermain game online.'
  },
  {
    id: 3,
    title: '5 Cara Detox Digital yang Terbukti Efektif',
    category: 'Digital Wellness',
    readTime: '6',
    image: 'img/Article_3.png',       // ← ganti path gambar artikel 3
    date: '1 Februari 2025',
    url: 'artikel_3.html',                          // ← isi dengan 'article-3.html' jika sudah ada
    excerpt: 'Digital detox tidak harus ekstrem. Ada cara lebih realistis dan terbukti ilmiah untuk mengembalikan keseimbangan antara dunia digital dan kehidupan nyata.'
  }
];

/* Naikkan VERSION setiap kali kamu mengubah DEFAULT_ARTICLES
   agar localStorage diperbarui otomatis di browser pengunjung */
const ARTICLES_VERSION = '4';

/* ── Data helpers ─────────────────────────────────────────── */
function artikelGetAll() {
  if (localStorage.getItem('btl_articles_version') !== ARTICLES_VERSION) {
    localStorage.removeItem('btl_articles');
    localStorage.setItem('btl_articles_version', ARTICLES_VERSION);
  }
  try {
    const stored = localStorage.getItem('btl_articles');
    if (stored) return JSON.parse(stored);
    const defaults = JSON.parse(JSON.stringify(DEFAULT_ARTICLES));
    localStorage.setItem('btl_articles', JSON.stringify(defaults));
    return defaults;
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_ARTICLES));
  }
}

function artikelSaveAll(arr) {
  try { localStorage.setItem('btl_articles', JSON.stringify(arr)); } catch {}
}

/* Konversi teks markdown sederhana ke HTML (untuk inline view) */
function artikelParseContent(raw) {
  return raw
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 style="color:var(--blue);margin:1.1rem 0 .5rem;font-size:.95rem">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => '<ul>' + m + '</ul>')
    .split('\n\n')
    .map(p => p.trim() && !p.startsWith('<h') && !p.startsWith('<ul') ? `<p>${p}</p>` : p)
    .join('\n');
}

/* ── Render grid artikel ──────────────────────────────────── */
function artikelRender() {
  const grid  = document.getElementById('artikelGrid');
  const empty = document.getElementById('artikelEmpty');
  const full  = document.getElementById('artFull');
  if (!grid) return;

  const articles = artikelGetAll();
  if (full) full.classList.remove('show');

  if (articles.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  grid.innerHTML = articles.map(a => `
    <div class="art-card">
      <div class="art-thumb">
        <img src="${a.image || ''}" alt="${a.title}"
          onerror="this.parentElement.style.background='#EFF6FF';this.style.display='none';">
      </div>
      <div class="art-body">
        <div class="art-cat">${a.category}</div>
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
        <div class="art-footer">
          <span>⏱ ${a.readTime} menit baca</span>
          ${a.url
            ? `<a href="${a.url}" class="art-btn art-btn-read">Selengkapnya &rsaquo;</a>`
            : `<button class="art-btn art-btn-read" onclick="artikelView(${a.id})">Selengkapnya &rsaquo;</button>`
          }
        </div>
      </div>
    </div>
  `).join('');
}

/* ── Inline full view (hanya jika artikel tidak punya url) ── */
function artikelView(id) {
  const articles = artikelGetAll();
  const a = articles.find(x => x.id === id);
  if (!a) return;

  const grid    = document.getElementById('artikelGrid');
  const full    = document.getElementById('artFull');
  const content = document.getElementById('artFullContent');
  if (!full || !content) return;

  if (grid) grid.style.display = 'none';

  content.innerHTML = `
    <span class="tag tag-blue" style="margin-bottom:.75rem">${a.category}</span>
    <h2 style="margin-top:.5rem;margin-bottom:.4rem">${a.title}</h2>
    <p class="text-small" style="margin-bottom:1.75rem">
      📅 ${a.date || ''} &nbsp;·&nbsp; ⏱ ${a.readTime} menit baca
    </p>
    <div class="art-full-content">${artikelParseContent(a.content || '')}</div>
    <div style="margin-top:2rem;display:flex;gap:.75rem;flex-wrap:wrap">
      <a href="quiz.html" class="btn btn-primary btn-sm">Mulai Quiz</a>
      <a href="tips.html" class="btn btn-ghost btn-sm">Lihat Tips</a>
    </div>
  `;

  full.classList.add('show');
  full.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeFullArtikel() {
  const grid = document.getElementById('artikelGrid');
  const full = document.getElementById('artFull');
  if (grid) grid.style.display = '';
  if (full) full.classList.remove('show');
  grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Navbar Toggle ────────────────────────────────────────── */
(function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.textContent = open ? '✕' : '☰';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
})();

/* ── Fade-in on Scroll ────────────────────────────────────── */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  artikelRender();
});