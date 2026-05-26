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
  kuota        : 50,
  judul        : 'Break the Loop: Cegah Kecanduan dalam Permainan Online',
  deskripsi    : 'Webinar edukasi yang membahas tentang bahaya gaming addiction, cara mengenali tanda-tandanya, dan strategi gaming yang sehat berbasis pendekatan psikologi digital.',
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
    return await res.json();
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
    const range = res.headers.get('Content-Range') || '0-0/0';
    return parseInt(range.split('/')[1]) || 0;
  },

  // Cek apakah email sudah terdaftar di database
  async emailExists(email) {
    const res = await fetch(
      EVENT_CONFIG.supabaseUrl + '/rest/v1/peserta?email=eq.' + encodeURIComponent(email) + '&select=id',
      { headers: db.headers() }
    );
    const data = await res.json();
    return Array.isArray(data) && data.length > 0;
  },

  // Cek apakah NIM sudah terdaftar (hanya jika NIM diisi)
  async nimExists(nim) {
    const res = await fetch(
      EVENT_CONFIG.supabaseUrl + '/rest/v1/peserta?nim=eq.' + encodeURIComponent(nim) + '&select=id',
      { headers: db.headers() }
    );
    const data = await res.json();
    return Array.isArray(data) && data.length > 0;
  },

  // Insert peserta baru
  // ⚠️ Pastikan kolom `status` dan `alasan` sudah dibuat di tabel Supabase kamu:
  //    ALTER TABLE peserta ADD COLUMN status TEXT;
  //    ALTER TABLE peserta ADD COLUMN alasan TEXT;
  async insert(nama, nim, email, status, alasan) {
    const res = await fetch(
      EVENT_CONFIG.supabaseUrl + '/rest/v1/peserta',
      {
        method : 'POST',
        headers: db.headers(),
        body   : JSON.stringify({
          nama,
          nim   : nim    || null,
          email,
          status: status || null,
          alasan: alasan || null,
        }),
      }
    );

    if (res.status === 409) {
      throw new Error('Email ' + email + ' sudah terdaftar!');
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
  const nama   = (document.getElementById('regNama')?.value   || '').trim();
  const nim    = (document.getElementById('regNIM')?.value    || '').trim();
  const email  = (document.getElementById('regEmail')?.value  || '').trim();
  const status = (document.getElementById('regStatus')?.value || '').trim();
  const alasan = (document.getElementById('regAlasan')?.value || '').trim();

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
  if (!nama)                return showError('Nama lengkap wajib diisi!');
  if (!email)               return showError('Email wajib diisi!');
  if (!email.includes('@')) return showError('Format email tidak valid!');
  if (!status)              return showError('Pilih status kamu terlebih dahulu!');
  if (new Date() > EVENT_CONFIG.batasDaftar) return showError('Batas pendaftaran sudah berakhir!');

  // ── Loading state ────────────────────────────────────────
  if (regBtn) { regBtn.disabled = true; regBtn.textContent = 'Mendaftarkan...'; regBtn.style.opacity = '0.7'; }

  try {
    // Cek kuota
    const total = await db.count();
    if (total >= EVENT_CONFIG.kuota) {
      return showError('Maaf, kuota sudah penuh!');
    }

    // Cek duplikat email
    const emailSudahAda = await db.emailExists(email);
    if (emailSudahAda) {
      return showError('Email ini sudah terdaftar! Gunakan email lain.');
    }

    // Cek duplikat NIM (hanya jika NIM diisi)
    if (nim) {
      const nimSudahAda = await db.nimExists(nim);
      if (nimSudahAda) {
        return showError('NIM ' + nim + ' sudah terdaftar!');
      }
    }

    // Insert ke Supabase
    await db.insert(nama, nim, email, status, alasan);

    // Simpan email di localStorage sebagai tanda sudah terdaftar
    localStorage.setItem('btl_registered_email', email);

    // Tampilkan sukses & sembunyikan otomatis setelah 5 detik
    sucEl?.classList.add('show');
    setTimeout(() => sucEl?.classList.remove('show'), 5000);
    ['regNama', 'regNIM', 'regEmail', 'regAlasan'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const statusEl = document.getElementById('regStatus');
    if (statusEl) statusEl.value = '';

    await regRenderList();
    await updateGmeetButton();

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

    const statusIcon = { Mahasiswa: '🎓', Siswa: '📚', Pekerja: '💼' };

    listEl.innerHTML = regs.slice(0, 20).map(r => {
      const initials = r.nama.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
      const date     = new Date(r.created_at);
      const timeStr  = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                     + ', '
                     + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const icon     = statusIcon[r.status] || '👤';
      const subInfo  = r.nim
        ? 'NIM: ' + r.nim + (r.status ? ' · ' + r.status : '')
        : (r.status || '');
      return `
        <div class="participant-item">
          <div class="p-avatar">${initials}</div>
          <div style="flex:1;min-width:0">
            <div class="p-name">${icon} ${r.nama}</div>
            <div class="p-nim">${subInfo}</div>
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
  updateFeedbackLink();
  checkRegistrationDeadline();

  function tick() {
    const now  = new Date();
    const diff = cfg.tanggal - now;

    if (diff <= 0) {
      set('cdLabel', 'Webinar sedang berlangsung! 🟢');
      ['cdDays', 'cdHours', 'cdMinutes', 'cdSeconds'].forEach(id => set(id, '00'));
      updateGmeetButton();
      updateFeedbackLink();
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

/* ─────────────────────────────────────────────────────────
   updateGmeetButton — verifikasi ke database Supabase
   agar link HANYA bisa diakses peserta yang benar-benar
   terdaftar di database, bukan sekadar manipulasi localStorage
   ───────────────────────────────────────────────────────── */
async function updateGmeetButton() {
  const btn = document.getElementById('gmeetBtn');
  if (!btn) return;

  const now              = new Date();
  const eventStarted     = now >= EVENT_CONFIG.tanggal;
  const registeredEmail  = localStorage.getItem('btl_registered_email');

  // ── Acara belum mulai ─────────────────────────────────
  if (!eventStarted) {
    if (!registeredEmail) {
      btn.className = 'gmeet-btn locked'; btn.disabled = true;
      btn.innerHTML = '🔒 Link Google Meet (Aktif saat acara dimulai)';
      showGmeetStatus('', '');
    } else {
      btn.className = 'gmeet-btn locked'; btn.disabled = true;
      btn.innerHTML = '🔒 Kamu sudah terdaftar — tunggu hingga acara dimulai';
      showGmeetStatus('info', '✅ Pendaftaran berhasil. Link aktif tepat pukul 19.00 WIB, 1 Juni 2026.');
    }
    return;
  }

  // ── Acara sudah mulai ─────────────────────────────────
  if (!registeredEmail) {
    // Tidak ada email di localStorage → pasti belum daftar
    btn.className = 'gmeet-btn locked'; btn.disabled = true;
    btn.innerHTML = '🔒 Acara sudah dimulai — kamu belum mendaftar';
    showGmeetStatus('error', '❌ Kamu belum mendaftar. Link hanya tersedia bagi peserta terdaftar.');
    return;
  }

  // Ada email di localStorage → verifikasi ke database
  btn.className = 'gmeet-btn locked'; btn.disabled = true;
  btn.innerHTML = '⏳ Memverifikasi pendaftaran...';
  showGmeetStatus('', '');

  try {
    const verified = await db.emailExists(registeredEmail);

    if (verified) {
      // ✅ Terdaftar di database → buka link
      btn.className = 'gmeet-btn unlocked'; btn.disabled = false;
      btn.innerHTML = '🟢 Bergabung Google Meet — Klik Sekarang!';
      showGmeetStatus('info', '✅ Selamat! Pendaftaran terverifikasi. Acara sedang berlangsung.');
    } else {
      // ❌ Email ada di localStorage tapi tidak ada di DB
      // (mungkin data dihapus admin atau localStorage dimanipulasi)
      localStorage.removeItem('btl_registered_email');
      btn.className = 'gmeet-btn locked'; btn.disabled = true;
      btn.innerHTML = '🔒 Pendaftaran tidak ditemukan di database';
      showGmeetStatus('error', '❌ Data pendaftaranmu tidak ditemukan. Silakan daftar ulang atau hubungi panitia.');
    }
  } catch (err) {
    // Gagal koneksi ke Supabase
    btn.className = 'gmeet-btn locked'; btn.disabled = true;
    btn.innerHTML = '⚠️ Gagal memverifikasi — coba refresh';
    showGmeetStatus('error', '⚠️ Koneksi ke server gagal. Refresh halaman dan coba lagi.');
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

function updateFeedbackLink() {
  const open = document.getElementById('feedbackOpen');
  const soon = document.getElementById('feedbackSoon');
  if (!open || !soon) return;

  const now            = new Date();
  const feedbackBuka   = new Date(EVENT_CONFIG.tanggal.getTime() + 60 * 60 * 1000); // +1 jam
  const webinarMulai   = now >= EVENT_CONFIG.tanggal;

  if (now >= feedbackBuka) {
    open.style.display = 'block';
    soon.style.display = 'none';
  } else if (webinarMulai) {
    open.style.display = 'none';
    soon.style.display = 'block';
  } else {
    open.style.display = 'none';
    soon.style.display = 'none';
  }
}

/* ── Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initCountdown();
  await regRenderList();
});