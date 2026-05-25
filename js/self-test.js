/* ============================================================
   DigiLab — self-test.js
   Gaming Addiction Self-Test
   Berdasarkan: IGD-20 (Pontes et al., 2014), DSM-5 IGD,
                WHO ICD-11 Gaming Disorder (6C51)
   ============================================================ */
'use strict';

const QUESTIONS = [
  { domain: 0, text: "Saya sering memikirkan game saat sedang melakukan aktivitas lain (belajar, makan, bekerja, dll.)." },
  { domain: 0, text: "Saya merencanakan kapan akan bermain game berikutnya sepanjang hari." },
  { domain: 0, text: "Game online adalah salah satu hal pertama yang ada di pikiran saya saat bangun tidur atau sebelum tidur." },
  { domain: 0, text: "Saya merasa tidak sabar dan terus-menerus ingin segera bisa bermain game lagi." },
  { domain: 1, text: "Saya merasa gelisah, cemas, atau mudah marah ketika tidak bisa bermain game." },
  { domain: 1, text: "Saya merasa ada sesuatu yang kurang atau tidak nyaman jika tidak bermain game seharian penuh." },
  { domain: 1, text: "Saya membutuhkan waktu bermain yang semakin lama agar mendapatkan kepuasan yang sama seperti dulu." },
  { domain: 1, text: "Durasi total bermain game saya cenderung terus bertambah dari waktu ke waktu tanpa saya sadari sepenuhnya." },
  { domain: 2, text: "Saya sering bermain game jauh lebih lama dari yang saya rencanakan sebelumnya." },
  { domain: 2, text: "Saya sudah pernah mencoba mengurangi atau berhenti bermain game, namun selalu gagal." },
  { domain: 2, text: "Saya kesulitan menghentikan sesi bermain meski tahu harus melakukan hal lain yang lebih penting." },
  { domain: 2, text: "Saya mengabaikan tugas, pekerjaan, atau kewajiban penting demi bisa bermain game." },
  { domain: 3, text: "Saya bermain game terutama untuk melupakan masalah atau tekanan dalam kehidupan sehari-hari." },
  { domain: 3, text: "Bermain game membuat saya merasa jauh lebih baik saat sedang sedih, cemas, atau stres." },
  { domain: 3, text: "Ketika menghadapi masalah atau emosi negatif, dorongan pertama saya adalah membuka game." },
  { domain: 3, text: "Dunia game terasa jauh lebih nyaman dan memuaskan dibandingkan kehidupan nyata saya." },
  { domain: 4, text: "Prestasi akademik atau performa kerja saya menurun akibat kebiasaan bermain game." },
  { domain: 4, text: "Hubungan saya dengan keluarga atau teman dekat terganggu akibat kebiasaan bermain game." },
  { domain: 4, text: "Saya tetap terus bermain game meskipun sudah menyadari dampak negatifnya bagi diri sendiri." },
  { domain: 4, text: "Saya pernah berbohong atau menyembunyikan seberapa lama saya bermain game dari orang-orang sekitar." },
];

const DOMAIN_NAMES   = ['Preokupasi', 'Withdrawal & Toleransi', 'Kehilangan Kontrol', 'Escapism', 'Dampak Negatif'];
const DOMAIN_COLORS  = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
const SCALE_LABELS   = ['Tidak Pernah', 'Jarang', 'Kadang-Kadang', 'Sering', 'Selalu'];

let state = {
  current: 0,
  answers: new Array(20).fill(null),
};

function getTotalScore() {
  return state.answers.reduce((s, a) => s + (a || 0), 0);
}

function getDomainScores() {
  const scores = [0, 0, 0, 0, 0];
  QUESTIONS.forEach((q, i) => { if (state.answers[i] !== null) scores[q.domain] += state.answers[i]; });
  return scores;
}

function getLevel(score) {
  if (score <= 36) return {
    level: 1, name: 'Gamer Kasual', nameEN: 'Casual Gamer',
    colorClass: 'badge-1', badge: '🎮', ringColor: '#22c55e',
    desc: 'Kamu bermain game dengan cara yang sehat dan terkontrol. Game menjadi hiburan positif tanpa mengganggu kehidupan sehari-hari secara signifikan.',
    clinical: 'Di bawah ambang batas klinis. Tidak memenuhi kriteria Gaming Disorder (WHO ICD-11 6C51) maupun Internet Gaming Disorder (DSM-5).',
    recs: [
      'Pertahankan pola bermain sehat yang sudah kamu miliki saat ini.',
      'Tetap jaga keseimbangan antara game, studi/kerja, dan kehidupan sosial.',
      'Kenali tanda-tanda awal jika pola bermain mulai berubah ke arah berlebihan.',
      'Bagikan kesadaran tentang gaming addiction kepada teman-temanmu.',
    ],
  };
  if (score <= 52) return {
    level: 2, name: 'Gamer Aktif', nameEN: 'Engaged Gamer',
    colorClass: 'badge-2', badge: '🕹️', ringColor: '#3b82f6',
    desc: 'Kamu bermain game cukup intens dan game sudah memakan porsi waktu yang signifikan. Beberapa tanda awal perlu diwaspadai agar tidak berkembang lebih jauh.',
    clinical: 'Fase Perhatian Dini. Belum memenuhi kriteria klinis Gaming Disorder, namun beberapa pola perilaku mulai perlu dipantau secara berkala.',
    recs: [
      'Tetapkan jadwal bermain yang terstruktur dan patuhi batas waktu tersebut.',
      'Terapkan "game-free zone": waktu makan, belajar, dan sebelum tidur.',
      'Aktifkan pelacak screen time di perangkatmu dan review setiap minggu.',
      'Pastikan hobi dan aktivitas sosial di luar game tetap terjaga dengan baik.',
      'Ulangi self-test ini dalam 1 bulan untuk memantau perkembangan polamu.',
    ],
  };
  if (score <= 68) return {
    level: 3, name: 'Gamer Berisiko', nameEN: 'At-Risk Gamer',
    colorClass: 'badge-3', badge: '⚠️', ringColor: '#eab308',
    desc: 'Pola bermain gamemu menunjukkan beberapa tanda peringatan serius yang perlu ditangani. Dampak pada kehidupan sehari-hari sudah mulai terasa nyata.',
    clinical: 'Zona Berisiko Tinggi. Memenuhi sebagian kriteria Internet Gaming Disorder (DSM-5). Intervensi dini sangat dianjurkan sebelum berkembang menjadi gangguan klinis penuh.',
    recs: [
      'Konsultasikan dengan konselor atau psikolog untuk evaluasi dan panduan lebih lanjut.',
      'Terapkan teknik Self-Regulation ketat: jadwal bermain tertulis, alarm pengingat, game-free days.',
      'Identifikasi pemicu utama bermain berlebih dan cari aktivitas alternatif yang sehat.',
      'Libatkan orang terpercaya (keluarga/teman) sebagai sistem pendukung dan akuntabilitas.',
      'Ikuti webinar DigiLab untuk strategi pengelolaan yang lebih mendalam dan terstruktur.',
    ],
  };
  if (score <= 84) return {
    level: 4, name: 'Problem Gamer', nameEN: 'Problem Gamer',
    colorClass: 'badge-4', badge: '🚨', ringColor: '#f97316',
    desc: 'Game sudah berdampak nyata dan signifikan pada berbagai area hidupmu—akademik, pekerjaan, atau relasi sosial. Bantuan profesional sangat direkomendasikan.',
    clinical: 'Gangguan Bermakna Klinis. Memenuhi mayoritas kriteria Internet Gaming Disorder (DSM-5) dan mendekati kriteria penuh Gaming Disorder WHO ICD-11 kode 6C51.',
    recs: [
      'Segera konsultasikan kondisi ini dengan psikolog klinis atau psikiater yang berpengalaman.',
      'Pertimbangkan Cognitive-Behavioral Therapy (CBT) yang terbukti efektif untuk adiksi behavioral.',
      'Hindari mencoba berhenti total secara tiba-tiba tanpa pendampingan profesional.',
      'Hubungi Student Advisory Center UBM atau Into The Light Indonesia untuk dukungan awal.',
      'Beritahu dan ajak serta orang terpercaya di sekitarmu dalam proses pemulihan.',
    ],
  };
  return {
    level: 5, name: 'Gaming Disorder', nameEN: 'Gaming Disorder',
    colorClass: 'badge-5', badge: '🆘', ringColor: '#ef4444',
    desc: 'Pola bermain gamemu sudah mencapai tahap yang memerlukan penanganan profesional segera. Ini adalah kondisi medis yang dapat ditangani—kamu tidak sendirian dalam menghadapinya.',
    clinical: 'Memenuhi kriteria Gaming Disorder WHO ICD-11 (2019) kode 6C51 dan Internet Gaming Disorder DSM-5. Penanganan profesional kesehatan mental diperlukan sesegera mungkin.',
    recs: [
      'Hubungi profesional kesehatan mental (psikolog/psikiater) sesegera mungkin.',
      'Mintalah bantuan orang terpercaya untuk membatasi akses perangkat gaming sementara.',
      'Tanyakan kepada dokter tentang program rehabilitasi atau terapi intensif yang tersedia.',
      'Hotline Into The Light Indonesia: (021) 7884-5555 — tersedia untuk dukungan awal.',
      'Ingat: Gaming Disorder adalah gangguan medis yang diakui WHO dan bisa ditangani dengan tepat.',
    ],
  };
}

function getType(domainScores) {
  const maxIdx = domainScores.indexOf(Math.max(...domainScores));
  const TYPES = [
    {
      icon: '🧠', nameEN: 'The Preoccupied', nameID: 'Tipe Terobsesi',
      desc: 'Pikiranmu hampir selalu tertuju pada game, bahkan saat tidak sedang bermain. Preokupasi kognitif ini adalah tanda klasik adiksi otak terus memproses game sebagai prioritas utama di atas aktivitas lainnya.',
    },
    {
      icon: '🔗', nameEN: 'The Dependent', nameID: 'Tipe Dependen',
      desc: 'Kamu mengalami gejala withdrawal dan peningkatan toleransi yang signifikan. Tubuh dan pikiranmu sudah bergantung pada game untuk merasa "normal" sebuah pola yang sangat mirip dengan mekanisme adiksi zat.',
    },
    {
      icon: '🌀', nameEN: 'The Compulsive', nameID: 'Tipe Kompulsif',
      desc: 'Kehilangan kendali atas durasi dan frekuensi bermain adalah pola dominanmu. Kamu mungkin tahu bahwa harus berhenti, namun dorongan untuk terus bermain selalu terasa jauh lebih kuat dari niat tersebut.',
    },
    {
      icon: '🚀', nameEN: 'The Escapist', nameID: 'Tipe Pelarian',
      desc: 'Game menjadi mekanisme koping utamamu dari stres, masalah, dan emosi negatif. Motivasi escapism ini membuat adiksi sangat sulit dilepas karena game "berfungsi nyata" menghilangkan rasa tidak nyaman.',
    },
    {
      icon: '📉', nameEN: 'The Neglectful', nameID: 'Tipe Lalai',
      desc: 'Dampak nyata pada akademik, pekerjaan, dan hubungan sosial sudah terasa dan terlihat jelas. Kamu mungkin menyadari konsekuensi ini, namun belum mampu mengubah pola bermain secara mandiri.',
    },
  ];
  return TYPES[maxIdx];
}

/* ══════════════════════════════════════════════════════════
   RENDERING — PERTANYAAN
   ══════════════════════════════════════════════════════════ */
function render() {
  const q       = QUESTIONS[state.current];
  const saved   = state.answers[state.current];
  const pct     = Math.round((state.current / 20) * 100);
  const isLast  = state.current === 19;

  const fill = document.getElementById('stProgressFill');
  const ctr  = document.getElementById('stCounter');
  const prev = document.getElementById('stPrevBtn');
  const next = document.getElementById('stNextBtn');

  if (fill) fill.style.width = pct + '%';
  if (ctr)  ctr.textContent  = `${state.current + 1} / 20`;
  if (prev) prev.style.visibility = state.current > 0 ? 'visible' : 'hidden';
  if (next) {
    next.textContent = isLast ? '🎯 Lihat Hasil' : 'Selanjutnya →';
    next.onclick     = isLast ? showResult : stNext;
  }

  const container = document.getElementById('stContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="st-card" role="group" aria-labelledby="qText">
      <div class="st-domain-tag">
        <span class="domain-dot" style="background:${DOMAIN_COLORS[q.domain]}"></span>
        ${DOMAIN_NAMES[q.domain]}
        <span class="st-qnum-pill">Pernyataan ${state.current + 1} dari 20</span>
      </div>
      <p class="st-question" id="qText">${q.text}</p>
      <div class="st-scale-wrap">
        <div class="likert-header">
          <span class="likert-ep">Tidak Pernah</span>
          <span class="likert-ep">Selalu</span>
        </div>
        <div class="likert-scale" role="radiogroup" aria-label="Pilih jawaban">
          ${SCALE_LABELS.map((label, i) => {
            const val = i + 1;
            const sel = saved === val;
            return `
              <button class="likert-opt ${sel ? 'selected' : ''}"
                      onclick="selectAnswer(${val})"
                      aria-pressed="${sel}"
                      aria-label="${label} (${val})">
                <span class="likert-num">${val}</span>
                <span class="likert-label">${label}</span>
              </button>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

function selectAnswer(val) {
  state.answers[state.current] = val;
  document.querySelectorAll('.likert-opt').forEach((btn, i) => {
    const isSelected = (i + 1 === val);
    btn.classList.toggle('selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected);
  });
  // Update tombol di soal terakhir agar berubah jadi "Lihat Hasil"
  if (state.current === 19) {
    const next = document.getElementById('stNextBtn');
    if (next) { next.textContent = '🎯 Lihat Hasil'; next.onclick = showResult; }
  }
}

function stPrev() {
  if (state.current > 0) { state.current--; render(); }
}

function stNext() {
  if (state.answers[state.current] === null) { highlightUnanswered(); return; }
  if (state.current < 19) { state.current++; render(); }
  else showResult();
}

function highlightUnanswered() {
  const scale = document.querySelector('.likert-scale');
  if (!scale) return;
  scale.classList.add('shake-hint');
  setTimeout(() => scale.classList.remove('shake-hint'), 600);
}

/* ══════════════════════════════════════════════════════════
   HASIL
   ══════════════════════════════════════════════════════════ */
function showResult() {
  const blank = state.answers.indexOf(null);
  if (blank !== -1) {
    state.current = blank;
    render();
    document.getElementById('stContainer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    highlightUnanswered();
    return;
  }

  const total        = getTotalScore();
  const domainScores = getDomainScores();
  const level        = getLevel(total);
  const type         = getType(domainScores);
  const scorePct     = Math.round(((total - 20) / 80) * 100);

  ['stHeaderBar', 'stContainer', 'stNavBar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const resultEl = document.getElementById('stResult');
  if (!resultEl) return;
  resultEl.innerHTML = buildResultHTML(total, scorePct, level, type, domainScores);
  resultEl.classList.add('show');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => animateRing(scorePct, level.ringColor), 150);
  setTimeout(() => animateDomainBars(domainScores), 400);
}

function buildResultHTML(total, scorePct, level, type, domainScores) {
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const domainBarsHTML = DOMAIN_NAMES.map((name, i) => {
    const score = domainScores[i];
    const pct   = Math.round(((score - 4) / 16) * 100);
    return `
      <div class="domain-bar-row">
        <div class="domain-bar-header">
          <span class="domain-bar-label">
            <span class="domain-dot-sm" style="background:${DOMAIN_COLORS[i]}"></span>
            ${name}
          </span>
          <span class="domain-bar-val">${score}<span style="color:var(--text-4);font-weight:400">/20</span></span>
        </div>
        <div class="domain-bar-track">
          <div class="domain-bar-fill" id="bar${i}" style="width:0%;background:${DOMAIN_COLORS[i]}"></div>
        </div>
        <div class="domain-bar-pct" id="barpct${i}" style="color:${DOMAIN_COLORS[i]}">0%</div>
      </div>`;
  }).join('');

  const recsHTML = level.recs.map(r => `<li>${r}</li>`).join('');
  const circumference = 2 * Math.PI * 52;

  return `
    <div class="result-main-card">
      <div class="result-meta">${dateStr} · DigiLab Gaming Addiction Self-Test</div>
      <div class="result-score-ring">
        <svg viewBox="0 0 120 120" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
          <circle class="ring-bg" cx="60" cy="60" r="52"/>
          <circle id="ringFill" cx="60" cy="60" r="52"
            fill="none" stroke="${level.ringColor}" stroke-width="8"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"
            transform="rotate(-90 60 60)"/>
        </svg>
        <div class="ring-score-text">
          <span class="ring-score-num" style="color:${level.ringColor}" id="scoreCounter">20</span>
          <span class="ring-score-max">/ 100</span>
        </div>
      </div>
      <div class="result-level-badge ${level.colorClass}">${level.badge} ${level.name}</div>
      <h2 class="result-title">${level.nameEN}</h2>
      <p class="result-desc">${level.desc}</p>
      <div class="clinical-note">
        🔬 <strong>Catatan Klinis:</strong> ${level.clinical}
      </div>
      <div class="result-type-card">
        <div class="type-icon">${type.icon}</div>
        <div class="type-info">
          <div class="type-label">Profil Dominan Kamu</div>
          <h3 class="type-name">${type.nameEN} <span class="type-name-id">— ${type.nameID}</span></h3>
          <p class="type-desc">${type.desc}</p>
        </div>
      </div>
      <div class="result-section">
        <h4 class="section-heading">Skor per Domain <span style="font-weight:400;color:var(--text-4)">(maks. 20/domain)</span></h4>
        <div class="domain-bars">${domainBarsHTML}</div>
      </div>
      <div class="result-section recs-section">
        <h4 class="section-heading">💡 Rekomendasi untuk Kamu</h4>
        <ul class="recs-list">${recsHTML}</ul>
      </div>
      <div class="result-actions">
        <button class="btn btn-ghost" onclick="stReset()">Ulangi Test</button>
        <button class="btn btn-primary" onclick="downloadPDF()" id="pdfBtn">
          <span id="pdfBtnText">📄 Unduh Hasil PDF</span>
        </button>
      </div>
      <p class="result-ref">
        Referensi: Pontes et al. (2014) IGD-20 Test; DSM-5 Internet Gaming Disorder;
        WHO ICD-11 Gaming Disorder (6C51, 2019).
      </p>
    </div>`;
}

function animateRing(pct, color) {
  const ring = document.getElementById('ringFill');
  if (!ring) return;
  const circumference = 2 * Math.PI * 52;
  ring.style.transition      = 'stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)';
  ring.style.strokeDashoffset = circumference - (pct / 100) * circumference;

  const total   = getTotalScore();
  const counter = document.getElementById('scoreCounter');
  if (!counter) return;
  let current   = 20;
  const steps   = 60;
  const increment = (total - 20) / steps;
  let step      = 0;
  const timer   = setInterval(() => {
    step++;
    current += increment;
    counter.textContent = Math.round(Math.min(current, total));
    if (step >= steps) { counter.textContent = total; clearInterval(timer); }
  }, 1600 / steps);
}

function animateDomainBars(domainScores) {
  domainScores.forEach((score, i) => {
    const pct   = Math.round(((score - 4) / 16) * 100);
    const bar   = document.getElementById('bar' + i);
    const label = document.getElementById('barpct' + i);
    if (bar) { bar.style.transition = `width 1s ease ${i * 0.12}s`; bar.style.width = pct + '%'; }
    if (label) setTimeout(() => { label.textContent = pct + '%'; }, i * 120 + 200);
  });
}

/* ══════════════════════════════════════════════════════════
   PDF — Helper konversi logo ke base64
   ══════════════════════════════════════════════════════════ */
function getBase64Image(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/* ══════════════════════════════════════════════════════════
   PDF — Download (async, memuat logo dulu)
   ══════════════════════════════════════════════════════════ */
async function downloadPDF() {
  const btn     = document.getElementById('pdfBtnText');
  const btnWrap = document.getElementById('pdfBtn');

  if (btn) btn.textContent = '⏳ Menyiapkan PDF...';
  if (btnWrap) btnWrap.disabled = true;

  // Pastikan jsPDF tersedia
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script   = document.createElement('script');
      script.src     = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload  = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }).catch(() => {
      alert('Gagal memuat library PDF. Pastikan koneksi internet aktif dan coba lagi.');
      if (btn) btn.textContent = '📄 Unduh Hasil PDF';
      if (btnWrap) btnWrap.disabled = false;
      return;
    });
  }

  // Muat logo terlebih dahulu
  const logoData = await getBase64Image('img/DigiLab_Logo.png');

  generatePDF(logoData);

  if (btn) btn.textContent = '📄 Unduh Hasil PDF';
  if (btnWrap) btnWrap.disabled = false;
}

/* ══════════════════════════════════════════════════════════
   PDF — Generate
   ══════════════════════════════════════════════════════════ */
function generatePDF(logoData) {
  const { jsPDF }    = window.jspdf;
  const doc          = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const total        = getTotalScore();
  const domainScores = getDomainScores();
  const level        = getLevel(total);
  const type         = getType(domainScores);
  const dateStr      = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const pageW  = 210;
  const margin = 18;
  const cW     = pageW - margin * 2;
  let y        = 0;

  /* ── HEADER — Putih bersih, logo di kiri ── */
  const headerH = 46;

  // Background putih
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, headerH, 'F');

  // Garis pemisah bawah header (abu tipis)
  doc.setDrawColor(220, 227, 235);
  doc.setLineWidth(0.5);
  doc.line(0, headerH, pageW, headerH);

  const logoH = 16;                        // tinggi logo di PDF (mm)
  const logoY = (headerH - logoH) / 2;    // vertikal center

  if (logoData) {
    // Hitung lebar proporsional
    const tmpImg = new Image();
    tmpImg.src   = logoData;
    const aspect = (tmpImg.naturalWidth && tmpImg.naturalHeight)
      ? tmpImg.naturalWidth / tmpImg.naturalHeight
      : 3.2;                               // fallback rasio jika belum decode
    const logoW  = logoH * aspect;

    doc.addImage(logoData, 'PNG', margin, logoY, logoW, logoH);

    // Teks meta di sebelah kanan logo
    const textX = margin + logoW + 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Your Digital Wellness Laboratory', textX, logoY + 5);
    doc.text('Gaming Addiction Self-Test — Laporan Hasil', textX, logoY + 10.5);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Tanggal: ${dateStr}   |   Anonim & Rahasia`, textX, logoY + 15.5);
  } else {
    // Fallback teks jika logo gagal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text('DigiLab', margin, logoY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Your Digital Wellness Laboratory', margin, logoY + 16);
    doc.text('Gaming Addiction Self-Test — Laporan Hasil', margin, logoY + 21.5);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Tanggal: ${dateStr}   |   Anonim & Rahasia`, margin, logoY + 27);
  }

  y = headerH + 10;

  /* ── Skor utama ── */
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, y, cW, 36, 4, 4, 'F');
  doc.setDrawColor(209, 226, 255);
  doc.roundedRect(margin, y, cW, 36, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(37, 99, 235);
  doc.text(`${total}`, margin + 8, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('/ 100', margin + 26, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(level.name, margin + 55, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const clinLines = doc.splitTextToSize(level.clinical, cW - 60);
  doc.text(clinLines, margin + 55, y + 19);
  y += 44;

  /* ── Deskripsi level ── */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Interpretasi Hasil:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(level.desc, cW);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.5 + 6;

  /* ── Profil dominan ── */
  doc.setFillColor(248, 250, 252);
  const typeBoxH = 26;
  doc.roundedRect(margin, y, cW, typeBoxH, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PROFIL DOMINAN', margin + 4, y + 7);
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${type.nameEN}  —  ${type.nameID}`, margin + 4, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const typeLines = doc.splitTextToSize(type.desc, cW - 8);
  doc.text(typeLines, margin + 4, y + 20);
  y += Math.max(typeBoxH + 4, 20 + typeLines.length * 4 + 4);

  /* ── Domain breakdown ── */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Skor per Domain (Maks. 20/domain):', margin, y);
  y += 5;

  DOMAIN_NAMES.forEach((name, i) => {
    const score = domainScores[i];
    const pct   = Math.round(((score - 4) / 16) * 100);
    const clamp = Math.max(0, Math.min(100, pct));

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(name, margin, y + 4);
    doc.text(`${score}/20`, pageW - margin, y + 4, { align: 'right' });

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin + 52, y + 1, cW - 63, 5, 2, 2, 'F');

    if (clamp > 0) {
      const hex = DOMAIN_COLORS[i];
      doc.setFillColor(
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16)
      );
      doc.roundedRect(margin + 52, y + 1, Math.max(2, (cW - 63) * clamp / 100), 5, 2, 2, 'F');
    }
    y += 10;
  });
  y += 4;

  /* ── Rekomendasi ── */
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Rekomendasi:', margin, y);
  y += 5;

  level.recs.forEach((rec, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(`${idx + 1}. ${rec}`, cW - 4);
    if (y + lines.length * 4.5 > 270) { doc.addPage(); y = 20; }
    doc.text(lines, margin + 2, y);
    y += lines.length * 4.5 + 2;
  });
  y += 5;

  /* ── Disclaimer ── */
  if (y > 255) { doc.addPage(); y = 20; }
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(253, 224, 71);
  const discH = 24;
  doc.roundedRect(margin, y, cW, discH, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(161, 98, 7);
  doc.text('CATATAN PENTING', margin + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const disc = 'Self-test ini bersifat edukatif dan BUKAN pengganti diagnosis klinis profesional. Hasil didasarkan pada instrumen IGD-20 (Pontes et al., 2014), kriteria DSM-5 IGD, dan WHO ICD-11 Gaming Disorder. Jika membutuhkan bantuan, hubungi psikolog atau konselor terdekat.';
  const dLines = doc.splitTextToSize(disc, cW - 8);
  doc.text(dLines, margin + 4, y + 13);

  /* ── Footer tiap halaman ── */
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'DigiLab — Your Digital Wellness Laboratory  |  Sumber: WHO ICD-11, DSM-5, IGD-20 Test (Pontes et al., 2014)',
      pageW / 2, 290, { align: 'center' }
    );
    doc.text(`Halaman ${p} dari ${pages}`, pageW - margin, 290, { align: 'right' });
  }

  doc.save('DigiLab-Self-Test-Hasil.pdf');
}

/* ══════════════════════════════════════════════════════════
   RESET
   ══════════════════════════════════════════════════════════ */
function stReset() {
  state = { current: 0, answers: new Array(20).fill(null) };
  ['stHeaderBar', 'stContainer', 'stNavBar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
  const res = document.getElementById('stResult');
  if (res) { res.classList.remove('show'); res.innerHTML = ''; }
  render();
  document.querySelector('.st-wrap')?.scrollIntoView({ behavior: 'smooth' });
}

/* ══════════════════════════════════════════════════════════
   NAVBAR TOGGLE
   ══════════════════════════════════════════════════════════ */
(function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.textContent = open ? '✕' : '☰';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { menu.classList.remove('open'); toggle.textContent = '☰'; });
  });
})();

/* ══════════════════════════════════════════════════════════
   FADE-IN ON SCROLL
   ══════════════════════════════════════════════════════════ */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stContainer')) render();
});