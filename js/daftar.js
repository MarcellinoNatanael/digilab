/* ============================================================
   DigiLab — daftar.js  (versi Supabase / PostgreSQL)
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════
   ⚙️  KONFIGURASI — EDIT BAGIAN INI
   ══════════════════════════════════════════════════════ */
const EVENT_CONFIG = {
  tanggal      : new Date('2026-06-01T19:00:00'),
  gmeetLink    : 'https://meet.google.com/zdd-xoiv-zcp',
  batasDaftar  : new Date('2026-05-31T23:59:00'),
  kuota        : 10,
  judul        : 'Break the Loop: Cegah Kecanduan dalam Permainan Daring',
  deskripsi    : 'Webinar edukasi interaktif tentang bahaya gaming addiction, cara mengenali tanda-tandanya, dan strategi gaming yang sehat berbasis pendekatan psikologi digital.',
  pic          : 'Marcellino Natanael - Mahasiswa SI, Universitas Bunda Mulia',
  jenisKegiatan: 'Webinar Online Gratis',
  durasi       : '60 Menit',

  // ✏️ Isi dengan data project Supabase kamu
  // Ambil di: Supabase > Project Settings > API
  supabaseUrl : 'https://wzsqtpnvkjbgndymdjci.supabase.co',
  supabaseKey : 'sb_publishable_BPAM_GRlDKiSp-Z1FxyrEw_TVn685ez',
};
/* ══════════════════════════════════════════════════════ */


/* ── Supabase REST Helper ──────────────────────────────────── */
const db = {
  headers: () => ({
    'apikey'       : EVENT_CONFIG.supabaseKey,
    'Authorization': 'Bearer ' + EVENT_CONFIG.supabaseKey,
    'Content-Type' : 'application/json',
    'Prefer'       : 'return=representation',
  }),

  // Ambil semua peserta, urut dari terbaru
  async getAll() {
    const res = await fetch(
      EVENT_CONFIG.supabaseUrl + '/rest/v1/peserta?select=*&order=created_at.desc',
      { headers: db.headers() }
    );
    if (!res.ok) throw new Error('Gagal mengambil data peserta');
    return await res.json(); // array of rows
  },

  // Hitung total peserta
  async count() {
    const res = await fetch(
      EVENT_CONFIG.supabaseUrl + '/rest/v1/peserta?select=id',
      {
        headers: {
          ...db.headers(),
          'Prefer': 'count=exact',
          'Range' : '0-0',
        }
      }
    );
    // Supabase kirim total di header Content-Range: 0-0/TOTAL
    const range = res.headers.get('Content-Range') || '0-0/0';
    return parseInt(range.split('/')[1]) || 0;
  },

  // Cek apakah NIM sudah terdaftar
  async nimExists(nim) {
    const res = await fetch(
      EVENT_CONFIG.supabaseUrl + '/rest/v1/peserta?nim=eq.' + encodeURIComponent(nim) + '&select=id',
      { headers: db.headers() }
    );
    const data = await res.json();
    return Array.isArray(data) && data.length > 0;
  },

  // Insert peserta baru
  async insert(nama, nim, email) {
    const res = await fetch(
      EVENT_CONFIG.supabaseUrl + '/rest/v1/peserta',
      {
        method : 'POST',
        headers: db.headers(),
        body   : JSON.stringify({ nama, nim, email }),
      }
    );

    if (res.status === 409) {
      // 409 Conflict = UNIQUE violation (NIM sudah ada)
      throw new Error('NIM ' + nim + ' sudah terdaftar!');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Gagal menyimpan data.');
    }
    return await res.json();
  },
};


/* ══════════════════════════════════════════════════════════
   FORM PENDAFTARAN
   ══════════════════════════════════════════════════════════ */
async function submitRegistrasi() {
  const nama  = (document.getElementById('regNama')?.value  || '').trim();
  const nim   = (document.getElementById('regNIM')?.value   || '').trim();
  const email = (document.getElementById('regEmail')?.value || '').trim();

  const errEl  = document.getElementById('regError');
  const errMsg = document.getElementById('regErrorMsg');
  const sucEl  = document.getElementById('regSuccess');
  const regBtn = document.getElementById('regBtn');

  errEl?.classList.remove('show');
  sucEl?.classList.remove('show');

  function showError(msg) {
    if (errMsg) errMsg.textContent = msg;
    errEl?.classList.add('show');
    if (regBtn) {
      regBtn.disabled    = false;
      regBtn.textContent = 'Daftar Webinar Sekarang';
      regBtn.style.opacity = '1';
    }
  }

  // ── Validasi sisi klien ──────────────────────────────────
  if (!nama || !nim || !email)        return showError('Semua field wajib diisi!');
  if (!email.includes('@'))           return showError('Format email tidak valid!');
  if (new Date() > EVENT_CONFIG.batasDaftar) return showError('Batas pendaftaran sudah berakhir!');

  // ── Loading state ────────────────────────────────────────
  if (regBtn) { regBtn.disabled = true; regBtn.textContent = 'Mendaftarkan...'; }

  try {
    // Cek kuota
    const total = await db.count();
    if (total >= EVENT_CONFIG.kuota) {
      return showError('Maaf, kuota sudah penuh!');
    }

    // Insert ke Supabase (duplikat NIM ditangani oleh UNIQUE constraint)
    await db.insert(nama, nim, email);

    // Simpan NIM di localStorage supaya tombol GMeet bisa aktif di browser ini
    localStorage.setItem('btl_my_nim', nim);

    // Tampilkan sukses
    sucEl?.classList.add('show');
    ['regNama', 'regNIM', 'regEmail'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    await regRenderList();
    updateGmeetButton();

  } catch (err) {
    showError(err.message || 'Terjadi kesalahan. Coba lagi.');
  }
}


/* ══════════════════════════════════════════════════════════
   RENDER DAFTAR PESERTA
   ══════════════════════════════════════════════════════════ */
async function regRenderList() {
  const listEl  = document.getElementById('participantsList');
  const countEl = document.getElementById('participantCount');
  if (!listEl) return;

  listEl.innerHTML = `
    <div style="padding:1.25rem;text-align:center;color:var(--text-3)">
      ⏳ Memuat daftar peserta...
    </div>`;

  try {
    const regs = await db.getAll();

    if (countEl) countEl.textContent = regs.length + ' peserta';
    updateKuotaDisplay(regs.length);

    if (regs.length === 0) {
      listEl.innerHTML = `
        <div class="participants-empty">
          Belum ada peserta terdaftar. Jadilah yang pertama! 🎉
        </div>`;
      return;
    }

    listEl.innerHTML = regs.slice(0, 20).map(r => {
      const initials = r.nama.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
      const date     = new Date(r.created_at);
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

  } catch (err) {
    listEl.innerHTML = `
      <div style="padding:1rem;color:var(--danger);text-align:center">
        ⚠️ Gagal memuat peserta. Refresh halaman.
      </div>`;
  }
}


/* ══════════════════════════════════════════════════════════
   KUOTA DISPLAY
   ══════════════════════════════════════════════════════════ */
function updateKuotaDisplay(terisi) {
  const kuota = EVENT_CONFIG.kuota;
  const sisa  = kuota - terisi;
  const pct   = Math.min(100, Math.round((terisi / kuota) * 100));

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
      badge.className = 'kuota-badge kuota-ok';  badge.textContent = 'Tersedia';
    }
  }

  if (sisa <= 0) {
    const regBtn      = document.getElementById('regBtn');
    const fullNotice  = document.getElementById('regFullNotice');
    const formWrapper = document.getElementById('regFormWrapper');
    if (regBtn)      { regBtn.disabled = true; regBtn.textContent = 'Kuota Penuh'; regBtn.style.opacity = '0.5'; }
    if (fullNotice)  fullNotice.classList.add('show');
    if (formWrapper) formWrapper.style.opacity = '0.5';
  }
}


/* ══════════════════════════════════════════════════════════
   COUNTDOWN + GMEET
   ══════════════════════════════════════════════════════════ */
function initCountdown() {
  if (!document.getElementById('cdDays')) return;

  const cfg = EVENT_CONFIG;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('heroJudul',       cfg.judul);
  set('heroDeskripsi',   cfg.deskripsi);
  set('detailJudul',     cfg.judul);
  set('detailDeskripsi', cfg.deskripsi);
  set('detailJenis',     cfg.jenisKegiatan);
  set('detailPIC',       cfg.pic);
  set('detailBatas',
    cfg.batasDaftar.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }) + ', ' +
    cfg.batasDaftar.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
  );

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
    set('cdMinutes', pad(Math.floor((diff % 3600000)  / 60000)));
    set('cdSeconds', pad(Math.floor((diff % 60000)    / 1000)));
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
  el.className   = 'gmeet-status show ' + type;
  el.textContent = msg;
}

function joinMeet() {
  const btn = document.getElementById('gmeetBtn');
  if (!btn || btn.disabled) return;
  window.open(EVENT_CONFIG.gmeetLink, '_blank');
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


/* ── Navbar Toggle ─────────────────────────────────────── */
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


/* ── Fade-in on Scroll ─────────────────────────────────── */
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


/* ── FAQ Toggle ────────────────────────────────────────── */
function toggleFaq(el) {
  const item   = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}


/* ── Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initCountdown();
  await regRenderList();
});