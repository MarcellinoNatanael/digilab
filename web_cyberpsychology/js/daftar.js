/* ============================================================
   DigiLab — daftar.js
   JavaScript khusus halaman Daftar Webinar (daftar.html)
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════
   ⚙️  KONFIGURASI EVENT — EDIT DARI SINI DI VSCODE
   ══════════════════════════════════════════════════════ */
const EVENT_CONFIG = {
  // Tanggal & jam acara — format: YYYY-MM-DDTHH:MM:SS
  tanggal: new Date('2026-06-01T19:00:00'),

  // Link Google Meet — ganti setelah kamu buat meeting
  gmeetLink: 'https://meet.google.com/zdd-xoiv-zcp',

  // Batas akhir pendaftaran
  batasDaftar: new Date('2026-05-31T23:59:00'),

  // Kuota maksimal peserta
  kuota: 10,

  // Info webinar
  judul:         'Break the Loop: Cegah Kecanduan dalam Permainan Daring',
  deskripsi:     'Webinar edukasi interaktif tentang bahaya gaming addiction, cara mengenali tanda-tandanya, dan strategi gaming yang sehat berbasis pendekatan psikologi digital.',
  pic:           'Marcellino Natanael - Mahasiswa SI, Universitas Bunda Mulia',
  jenisKegiatan: 'Webinar Online Gratis',
  durasi:        '60 Menit',
};
/* ══════════════════════════════════════════════════════ */


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


/* ── FAQ Toggle ───────────────────────────────────────────── */
function toggleFaq(el) {
  const item   = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}


/* ══════════════════════════════════════════════════════════
   REGISTRASI — localStorage
   ══════════════════════════════════════════════════════════ */
function regGetAll() {
  try { return JSON.parse(localStorage.getItem('btl_registrations') || '[]'); }
  catch { return []; }
}

function regSaveAll(arr) {
  try { localStorage.setItem('btl_registrations', JSON.stringify(arr)); } catch {}
}

function submitRegistrasi() {
  const nama  = (document.getElementById('regNama')?.value  || '').trim();
  const nim   = (document.getElementById('regNIM')?.value   || '').trim();
  const email = (document.getElementById('regEmail')?.value || '').trim();

  const errEl  = document.getElementById('regError');
  const errMsg = document.getElementById('regErrorMsg');
  const sucEl  = document.getElementById('regSuccess');
  if (errEl) errEl.classList.remove('show');
  if (sucEl) sucEl.classList.remove('show');

  // Validasi input
  if (!nama || !nim || !email) {
    if (errMsg) errMsg.textContent = 'Semua field wajib diisi!';
    if (errEl) errEl.classList.add('show'); return;
  }
  if (!email.includes('@')) {
    if (errMsg) errMsg.textContent = 'Format email tidak valid!';
    if (errEl) errEl.classList.add('show'); return;
  }

  const regs = regGetAll();

  // Cek kuota
  if (regs.length >= EVENT_CONFIG.kuota) {
    if (errMsg) errMsg.textContent = 'Maaf, kuota sudah penuh!';
    if (errEl) errEl.classList.add('show'); return;
  }

  // Cek batas daftar
  if (new Date() > EVENT_CONFIG.batasDaftar) {
    if (errMsg) errMsg.textContent = 'Batas pendaftaran sudah berakhir!';
    if (errEl) errEl.classList.add('show'); return;
  }

  // Cek duplikat NIM
  if (regs.find(r => r.nim === nim)) {
    if (errMsg) errMsg.textContent = 'NIM ' + nim + ' sudah terdaftar!';
    if (errEl) errEl.classList.add('show'); return;
  }

  // Simpan
  regs.push({ nama, nim, email, timestamp: new Date().toISOString() });
  regSaveAll(regs);

  // Tandai browser ini sudah daftar (untuk akses GMeet)
  localStorage.setItem('btl_my_nim', nim);

  // Tampilkan sukses & reset form
  if (sucEl) sucEl.classList.add('show');
  ['regNama', 'regNIM', 'regEmail'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  regRenderList();
  updateKuotaDisplay();
  updateGmeetButton();
}

function regRenderList() {
  const listEl  = document.getElementById('participantsList');
  const countEl = document.getElementById('participantCount');
  if (!listEl) return;

  const regs = regGetAll();
  if (countEl) countEl.textContent = regs.length + ' peserta';

  if (regs.length === 0) {
    listEl.innerHTML = `
      <div class="participants-empty" id="participantsEmpty">
        Belum ada peserta terdaftar. Jadilah yang pertama! 🎉
      </div>`;
    return;
  }

  const items = regs.slice(-20).reverse().map(r => {
    const initials = r.nama.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const date     = new Date(r.timestamp);
    const timeStr  = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                   + ', '
                   + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="participant-item">
        <div class="p-avatar">${initials}</div>
        <div>
          <div class="p-name">${r.nama}</div>
          <div class="p-nim">NIM: ${r.nim}</div>
        </div>
        <div class="p-time">${timeStr}</div>
      </div>`;
  }).join('');

  listEl.innerHTML = `<div class="participants-empty" id="participantsEmpty" style="display:none"></div>` + items;
}


/* ══════════════════════════════════════════════════════════
   COUNTDOWN + GMEET
   ══════════════════════════════════════════════════════════ */
function initCountdown() {
  if (!document.getElementById('cdDays')) return;

  const cfg = EVENT_CONFIG;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  // Isi teks dinamis dari config
  set('heroJudul',      cfg.judul);
  set('heroDeskripsi',  cfg.deskripsi);
  set('detailJudul',    cfg.judul);
  set('detailDeskripsi',cfg.deskripsi);
  set('detailJenis',    cfg.jenisKegiatan);
  set('detailPIC',      cfg.pic);
  set('detailBatas',
    cfg.batasDaftar.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }) + ', ' +
    cfg.batasDaftar.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
  );

  updateKuotaDisplay();
  updateGmeetButton();
  checkRegistrationDeadline();

  function tick() {
    const now  = new Date();
    const diff = cfg.tanggal - now;

    if (diff <= 0) {
      set('cdLabel', 'Webinar sedang berlangsung! 🟢');
      ['cdDays', 'cdHours', 'cdMinutes', 'cdSeconds'].forEach(id => set(id, '00'));
      updateGmeetButton();
      return;
    }

    const pad = n => String(n).padStart(2, '0');
    set('cdDays',    pad(Math.floor(diff / 86400000)));
    set('cdHours',   pad(Math.floor((diff % 86400000) / 3600000)));
    set('cdMinutes', pad(Math.floor((diff % 3600000) / 60000)));
    set('cdSeconds', pad(Math.floor((diff % 60000) / 1000)));
    updateGmeetButton();
    setTimeout(tick, 1000);
  }
  tick();
}

function updateGmeetButton() {
  const btn = document.getElementById('gmeetBtn');
  if (!btn) return;

  const now          = new Date();
  const eventStarted = now >= EVENT_CONFIG.tanggal;
  const sudahDaftar  = !!localStorage.getItem('btl_my_nim');

  if (!eventStarted && !sudahDaftar) {
    btn.className = 'gmeet-btn locked'; btn.disabled = true;
    btn.innerHTML = '🔒 Link Google Meet (Aktif saat acara dimulai)';
    showGmeetStatus('', '');
  } else if (!eventStarted && sudahDaftar) {
    btn.className = 'gmeet-btn locked'; btn.disabled = true;
    btn.innerHTML = '🔒 Kamu sudah terdaftar — tunggu hingga acara dimulai';
    showGmeetStatus('info', '✅ Pendaftaran berhasil. Link aktif tepat saat acara dimulai.');
  } else if (eventStarted && !sudahDaftar) {
    btn.className = 'gmeet-btn locked'; btn.disabled = true;
    btn.innerHTML = '🔒 Acara sudah dimulai — kamu belum mendaftar';
    showGmeetStatus('error', '❌ Kamu belum mendaftar. Link hanya tersedia bagi peserta terdaftar.');
  } else {
    btn.className = 'gmeet-btn unlocked'; btn.disabled = false;
    btn.innerHTML = '🟢 Bergabung Google Meet — Klik Sekarang!';
    showGmeetStatus('info', '✅ Selamat! Kamu sudah terdaftar dan acara sudah dimulai.');
  }
}

function showGmeetStatus(type, msg) {
  const el = document.getElementById('gmeetStatus');
  if (!el) return;
  if (!type) { el.classList.remove('show'); return; }
  el.className = 'gmeet-status show ' + type;
  el.textContent = msg;
}

function joinMeet() {
  const btn = document.getElementById('gmeetBtn');
  if (!btn || btn.disabled) return;
  window.open(EVENT_CONFIG.gmeetLink, '_blank');
}

function updateKuotaDisplay() {
  const regs   = regGetAll();
  const terisi = regs.length;
  const kuota  = EVENT_CONFIG.kuota;
  const sisa   = kuota - terisi;
  const pct    = Math.min(100, Math.round((terisi / kuota) * 100));

  const fill   = document.getElementById('kuotaBarFill');
  const badge  = document.getElementById('kuotaBadge');
  const detail = document.getElementById('detailKuota');

  if (fill)   fill.style.width = pct + '%';
  if (detail) detail.textContent = terisi + ' / ' + kuota + ' peserta';

  if (badge) {
    if (sisa <= 0) {
      badge.className = 'kuota-badge kuota-full'; badge.textContent = 'Penuh';
    } else if (sisa <= Math.ceil(kuota * 0.2)) {
      badge.className = 'kuota-badge kuota-warn'; badge.textContent = 'Sisa ' + sisa;
    } else {
      badge.className = 'kuota-badge kuota-ok'; badge.textContent = 'Tersedia';
    }
  }

  // Disable form jika penuh
  if (sisa <= 0) {
    const regBtn      = document.getElementById('regBtn');
    const fullNotice  = document.getElementById('regFullNotice');
    const formWrapper = document.getElementById('regFormWrapper');
    if (regBtn)      { regBtn.disabled = true; regBtn.textContent = 'Kuota Penuh'; regBtn.style.opacity = '0.5'; }
    if (fullNotice)  fullNotice.classList.add('show');
    if (formWrapper) formWrapper.style.opacity = '0.5';
  }
}

function checkRegistrationDeadline() {
  if (new Date() > EVENT_CONFIG.batasDaftar) {
    const notice = document.getElementById('regDeadlineNotice');
    const regBtn = document.getElementById('regBtn');
    if (notice) notice.style.display = 'flex';
    if (regBtn) {
      regBtn.disabled    = true;
      regBtn.textContent = 'Batas Pendaftaran Sudah Berakhir';
      regBtn.style.opacity = '0.5';
    }
  }
}


/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  regRenderList();
  initCountdown();
});