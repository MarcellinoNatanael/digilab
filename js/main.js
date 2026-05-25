/* ============================================================
   BREAK THE LOOP — main.js
   Quiz 20 soal | Artikel CRUD | Registrasi | Countdown GMeet
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════
   ⚙️  KONFIGURASI EVENT — EDIT DARI SINI DI VSCODE
   ══════════════════════════════════════════════════════ */
const EVENT_CONFIG = {
  // Tanggal & jam acara — format: YYYY-MM-DDTHH:MM:SS
  tanggal: new Date('2026-05-30T19:00:00'),

  // Link Google Meet — ganti setelah kamu buat meeting
  gmeetLink: 'https://meet.google.com/xxx-xxxx-xxx',

  // Batas akhir pendaftaran
  batasDaftar: new Date('2026-05-30T18:00:00'),

  // Kuota maksimal peserta — ganti sesuai kebutuhan
  kuota: 10,

  // Info webinar — bisa diedit langsung dari sini
  judul:         'Break the Loop: Cegah Kecanduan dalam Permainan Daring',
  deskripsi:     'Webinar edukasi interaktif tentang bahaya gaming addiction, cara mengenali tanda-tandanya, dan strategi gaming yang sehat berbasis pendekatan psikologi digital.',
  pic:           'Marcellino Natanael - Mahasiswa SI, Universitas Bunda Mulia',
  jenisKegiatan: 'Webinar Online Gratis',
  durasi:        '60 Menit',
};
/* ══════════════════════════════════════════════════════ */


/* ── NAVBAR ─────────────────────────────────────────────── */
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


/* ── SCROLL ANIMATIONS ──────────────────────────────────── */
(function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
})();


/* ── FAQ ────────────────────────────────────────────────── */
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}


/* ══════════════════════════════════════════════════════════
   QUIZ — 20 SOAL (15 PG × 4 + 5 ESAI × 8 = 100)
   ══════════════════════════════════════════════════════════ */
const QUIZ_DATA = {
  mc: [
    {
      q: "Menurut WHO ICD-11 (2019), Gaming Disorder diklasifikasikan sebagai apa?",
      opts: ["Gangguan kepribadian", "Gangguan mental resmi (ICD-11)", "Kebiasaan tidak sehat biasa", "Gangguan fisik"],
      answer: 1
    },
    {
      q: "Berapa lama minimal gejala harus berlangsung agar seseorang dapat didiagnosis Gaming Disorder menurut WHO?",
      opts: ["3 bulan", "6 bulan", "12 bulan", "24 bulan"],
      answer: 2
    },
    {
      q: "Apa yang dimaksud dengan 'Preoccupation' dalam kriteria Internet Gaming Disorder (IGD)?",
      opts: ["Bermain game terlalu lama", "Pikiran terus-menerus tertuju pada game meski tidak sedang bermain", "Tidak bisa berhenti bermain saat sudah mulai", "Berbohong tentang waktu bermain"],
      answer: 1
    },
    {
      q: "Teori psikologi apa yang menjelaskan mengapa seseorang bisa kehilangan kesadaran waktu saat bermain game?",
      opts: ["Social Learning Theory", "Online Flow State Theory", "Cognitive Dissonance Theory", "Attachment Theory"],
      answer: 1
    },
    {
      q: "Neurotransmitter apa yang dilepaskan otak saat seseorang menang atau naik level dalam game?",
      opts: ["Serotonin", "Cortisol", "Dopamin", "Adrenalin"],
      answer: 2
    },
    {
      q: "'Withdrawal' dalam konteks gaming addiction mengacu pada apa?",
      opts: ["Kebutuhan bermain semakin lama", "Rasa cemas atau marah saat tidak bisa bermain game", "Berbohong tentang durasi bermain", "Mengorbankan kegiatan lain untuk game"],
      answer: 1
    },
    {
      q: "Berapa kriteria IGD minimal yang harus terpenuhi dalam 12 bulan untuk diagnosis Gaming Disorder (DSM-5)?",
      opts: ["3 kriteria", "5 kriteria", "7 kriteria", "9 kriteria"],
      answer: 1
    },
    {
      q: "Apa yang dimaksud dengan 'Tolerance' dalam kriteria IGD?",
      opts: ["Kemampuan menerima kekalahan dalam game", "Perlu bermain semakin lama untuk mendapat kepuasan yang sama", "Tetap bermain meski ada dampak negatif", "Menghindari masalah nyata dengan bermain game"],
      answer: 1
    },
    {
      q: "Berdasarkan Uses & Gratifications Theory, seseorang bermain game terutama untuk memenuhi kebutuhan apa?",
      opts: ["Hanya untuk hiburan semata", "Achievement, social connection, dan escapism", "Meningkatkan kecerdasan", "Mengisi waktu luang saja"],
      answer: 1
    },
    {
      q: "Dampak psikologis apa yang paling umum terjadi pada gamer dengan Gaming Disorder?",
      opts: ["Peningkatan kemampuan kognitif", "Kecemasan, depresi, dan isolasi sosial", "Peningkatan kreativitas", "Kemampuan multitasking lebih baik"],
      answer: 1
    },
    {
      q: "Self-Regulation Theory (Baumeister, 1996) menjelaskan bahwa kecanduan game terjadi karena apa?",
      opts: ["Game terlalu menarik", "Ego depletion melemahkan kemampuan kontrol diri", "Kurangnya aktivitas lain", "Pengaruh teman sebaya"],
      answer: 1
    },
    {
      q: "Apa yang dimaksud dengan 'Escape / Mood Modification' dalam kriteria IGD?",
      opts: ["Bermain game untuk bersantai sejenak", "Bermain game untuk menghindari masalah nyata atau menghilangkan emosi negatif", "Berhenti bermain saat mood buruk", "Memilih genre game berdasarkan suasana hati"],
      answer: 1
    },
    {
      q: "Berapa persentase gamer global yang terdiagnosis Gaming Disorder secara klinis menurut WHO (2022)?",
      opts: ["Sekitar 1%", "Sekitar 3%", "Sekitar 10%", "Sekitar 20%"],
      answer: 1
    },
    {
      q: "Cahaya biru dari layar game berdampak pada kesehatan karena apa?",
      opts: ["Meningkatkan produksi melatonin", "Menekan produksi melatonin sehingga mengganggu tidur", "Tidak berpengaruh pada kesehatan", "Meningkatkan konsentrasi"],
      answer: 1
    },
    {
      q: "Dalam Game-Smart Habits berbasis Self-Regulation Theory, strategi mana yang paling efektif untuk mengurangi adiksi game?",
      opts: ["Langsung berhenti total bermain game", "Jadwal bermain terstruktur, game-free zone, dan monitoring screen time", "Hanya bermain game yang tidak adiktif", "Meminta orang tua menyita perangkat"],
      answer: 1
    }
  ],
  essay: [
    {
      q: "Jelaskan dengan kata-katamu sendiri apa yang dimaksud dengan 'Online Flow State' dan bagaimana kondisi ini berkaitan dengan adiksi game online.",
      hint: "Jelaskan definisi flow state, ciri-cirinya, dan hubungannya dengan gaming addiction (min. 50 kata)"
    },
    {
      q: "Bagaimana Self-Regulation Theory (Baumeister) dapat diterapkan untuk membantu seseorang mengatasi adiksi game? Berikan contoh konkret.",
      hint: "Hubungkan teori dengan strategi nyata yang bisa diterapkan (min. 50 kata)"
    },
    {
      q: "Jika kamu mengetahui seseorang di sekitarmu menunjukkan 5+ kriteria Internet Gaming Disorder, langkah apa yang akan kamu ambil untuk membantunya? Jelaskan alasannya.",
      hint: "Tuliskan langkah konkret dan empati (min. 50 kata)"
    },
    {
      q: "Menurut pendapatmu, mengapa edukasi tentang gaming addiction penting untuk kelompok usia 15–25 tahun? Hubungkan dengan dampak psikologis yang telah kamu pelajari.",
      hint: "Berikan argumen yang kuat dengan referensi ke materi edukasi (min. 50 kata)"
    },
    {
      q: "Bagaimana menurutmu peran orang tua, sekolah/kampus, dan platform game itu sendiri dalam mencegah gaming addiction pada remaja? Jelaskan peran masing-masing.",
      hint: "Bahas 3 pihak: orang tua, institusi, dan platform game (min. 60 kata)"
    }
  ]
};

let quizState = {
  phase: 'mc',       // 'mc' | 'essay' | 'done'
  mcIndex: 0,
  essayIndex: 0,
  mcAnswers: new Array(15).fill(null),
  essayAnswers: new Array(5).fill(''),
  mcScore: 0,
  essayScore: 0,
};

function quizInit() {
  if (!document.getElementById('quizContainer')) return;
  quizRenderCurrent();
}

function quizRenderCurrent() {
  const container = document.getElementById('quizContainer');
  const { phase, mcIndex, essayIndex } = quizState;

  // Update progress
  const total = 20;
  const current = phase === 'mc' ? mcIndex : (15 + essayIndex);
  const pct = Math.round((current / total) * 100);
  const fill = document.getElementById('progressFill');
  const counter = document.getElementById('quizCounterText');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (fill) fill.style.width = pct + '%';
  if (counter) counter.textContent = `Soal ${current + 1} dari ${total}`;
  if (prevBtn) prevBtn.style.visibility = current > 0 ? 'visible' : 'hidden';

  if (phase === 'mc') {
    const q = QUIZ_DATA.mc[mcIndex];
    const saved = quizState.mcAnswers[mcIndex];
    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-type-label">
          Pilihan Ganda <span class="quiz-pts">4 poin</span>
        </div>
        <div class="quiz-question-text">${mcIndex + 1}. ${q.q}</div>
        <div class="quiz-options" id="optionsContainer">
          ${q.opts.map((opt, i) => `
            <div class="quiz-opt ${saved === i ? 'selected' : ''}" onclick="mcSelect(${i})" data-idx="${i}">
              <div class="opt-radio"></div>
              <span class="opt-text">${String.fromCharCode(65 + i)}. ${opt}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (nextBtn) {
      nextBtn.textContent = mcIndex === 14 ? 'Lanjut ke Soal Esai →' : 'Selanjutnya →';
      nextBtn.onclick = quizNext;
    }
  } else if (phase === 'essay') {
    const q = QUIZ_DATA.essay[essayIndex];
    const saved = quizState.essayAnswers[essayIndex] || '';
    const essayNum = essayIndex + 1;
    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-type-label">
          Soal Esai ${essayNum} <span class="quiz-pts">8 poin</span>
          <span style="margin-left:auto;font-size:0.68rem;color:var(--text-4)">Min. 50 karakter untuk poin penuh</span>
        </div>
        <div class="quiz-question-text">${15 + essayIndex + 1}. ${q.q}</div>
        <div class="quiz-essay">
          <textarea id="essayInput" placeholder="Tulis jawabanmu di sini..." oninput="essaySave()">${saved}</textarea>
          <div class="essay-hint">💡 ${q.hint}</div>
          <div class="char-count" id="charCount">${saved.length} karakter</div>
        </div>
      </div>
    `;
    if (nextBtn) {
      nextBtn.textContent = essayIndex === 4 ? '🎯 Lihat Hasil' : 'Selanjutnya →';
      nextBtn.onclick = essayIndex === 4 ? quizFinish : quizNext;
    }
  }
}

function mcSelect(idx) {
  quizState.mcAnswers[quizState.mcIndex] = idx;
  document.querySelectorAll('.quiz-opt').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
}

function essaySave() {
  const ta = document.getElementById('essayInput');
  if (!ta) return;
  quizState.essayAnswers[quizState.essayIndex] = ta.value;
  const cc = document.getElementById('charCount');
  if (cc) {
    const len = ta.value.length;
    cc.textContent = len + ' karakter';
    cc.style.color = len >= 50 ? 'var(--success)' : 'var(--text-4)';
  }
}

function quizNext() {
  const { phase, mcIndex, essayIndex } = quizState;
  if (phase === 'mc') {
    if (quizState.mcAnswers[mcIndex] === null) { alert('Pilih salah satu jawaban dulu!'); return; }
    if (mcIndex < 14) { quizState.mcIndex++; }
    else { quizState.phase = 'essay'; quizState.essayIndex = 0; }
  } else if (phase === 'essay') {
    const ans = quizState.essayAnswers[essayIndex];
    if (!ans || ans.trim().length < 10) { alert('Tulis jawabanmu dulu! (minimal 10 karakter)'); return; }
    if (essayIndex < 4) { quizState.essayIndex++; }
  }
  quizRenderCurrent();
  document.getElementById('quizContainer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function quizPrev() {
  const { phase, mcIndex, essayIndex } = quizState;
  if (phase === 'essay' && essayIndex > 0) { quizState.essayIndex--; }
  else if (phase === 'essay' && essayIndex === 0) { quizState.phase = 'mc'; quizState.mcIndex = 14; }
  else if (phase === 'mc' && mcIndex > 0) { quizState.mcIndex--; }
  quizRenderCurrent();
}

function quizFinish() {
  const ans = quizState.essayAnswers[quizState.essayIndex];
  if (!ans || ans.trim().length < 10) { alert('Tulis jawabanmu dulu!'); return; }

  // Calculate MC score
  let mcScore = 0;
  quizState.mcAnswers.forEach((a, i) => {
    if (a === QUIZ_DATA.mc[i].answer) mcScore += 4;
  });

  // Calculate Essay score (≥50 chars = 8 pts, 20-49 = 4 pts, <20 = 0)
  let essayScore = 0;
  quizState.essayAnswers.forEach(ans => {
    const len = (ans || '').trim().length;
    if (len >= 50) essayScore += 8;
    else if (len >= 20) essayScore += 4;
  });

  quizState.mcScore    = mcScore;
  quizState.essayScore = essayScore;
  const total = mcScore + essayScore;

  // Hide quiz UI
  document.getElementById('quizHeaderBar').style.display    = 'none';
  document.getElementById('quizContainer').style.display    = 'none';
  document.getElementById('quizNavBar').style.display       = 'none';
  document.getElementById('scoreBoard').style.display       = 'none';

  // Determine level
  let emoji, title, levelClass, levelText, desc, recs;
  if (total >= 85) {
    emoji = '🏆'; levelText = 'Excellent — Sangat Paham'; levelClass = 'level-a';
    title = 'Luar Biasa! Pemahamanmu Sangat Baik!';
    desc = 'Kamu memiliki pemahaman yang mendalam tentang gaming addiction, teori psikologi, dan strategi mengatasinya. Kamu siap membantu orang lain di sekitarmu.';
    recs = ['Bagikan pengetahuan ini ke teman-temanmu', 'Pertimbangkan jadi peer educator di kampus', 'Ikut webinar untuk memperdalam diskusi', 'Tetap terapkan Game-Smart Habits setiap hari'];
  } else if (total >= 65) {
    emoji = '✅'; levelText = 'Good — Cukup Paham'; levelClass = 'level-a';
    title = 'Bagus! Pemahaman Kamu Sudah Solid';
    desc = 'Kamu sudah memahami sebagian besar konsep gaming addiction dengan baik. Ada beberapa area yang bisa diperdalam lagi.';
    recs = ['Review kembali materi yang masih belum yakin', 'Ikut webinar untuk klarifikasi pemahaman', 'Coba terapkan Game-Smart Habits di kehidupan nyata', 'Baca artikel tambahan untuk memperluas wawasan'];
  } else if (total >= 45) {
    emoji = '📚'; levelText = 'Fair — Perlu Belajar Lebih'; levelClass = 'level-b';
    title = 'Ada Ruang untuk Berkembang';
    desc = 'Kamu sudah punya dasar pemahaman yang baik, tapi ada beberapa konsep penting yang perlu diperdalam lebih lanjut.';
    recs = ['Baca ulang halaman Edukasi dengan teliti', 'Perhatikan 9 kriteria IGD secara khusus', 'Pelajari Flow State dan Self-Regulation Theory', 'Ikut webinar — sesi tanya jawab akan sangat membantu'];
  } else {
    emoji = '💡'; levelText = 'Needs Improvement'; levelClass = 'level-c';
    title = 'Yuk, Pelajari Lebih Dalam Lagi!';
    desc = 'Jangan menyerah! Ini adalah kesempatan untuk belajar lebih banyak tentang topik yang sangat penting ini.';
    recs = ['Mulai dari halaman Edukasi dari awal', 'Tonton video atau baca artikel seputar gaming addiction', 'Ikut webinar — dijelaskan step-by-step oleh tim', 'Ulangi quiz setelah belajar untuk cek progress'];
  }

  const correctCount = quizState.mcAnswers.filter((a, i) => a === QUIZ_DATA.mc[i].answer).length;
  const essayCount   = quizState.essayAnswers.filter(a => (a||'').trim().length >= 20).length;

  document.getElementById('rEmoji').textContent  = emoji;
  document.getElementById('rTitle').textContent  = title;
  document.getElementById('rScore').textContent  = total + ' / 100';
  document.getElementById('rScore').style.color  = total >= 65 ? 'var(--success)' : total >= 45 ? 'var(--warning)' : 'var(--danger)';
  const lvlEl = document.getElementById('rLevel');
  lvlEl.textContent = levelText;
  lvlEl.className   = 'result-level ' + levelClass;
  document.getElementById('rDesc').textContent        = desc;
  document.getElementById('rMC').textContent          = mcScore + ' / 60';
  document.getElementById('rEssay').textContent       = essayScore + ' / 40';
  document.getElementById('rCorrect').textContent     = correctCount + ' dari 15';
  document.getElementById('rEssayCount').textContent  = essayCount + ' dari 5';
  document.getElementById('rRecommendation').innerHTML = `
    <h4 style="margin-bottom:.75rem;color:var(--text)">Rekomendasi untuk Kamu:</h4>
    <ul style="display:flex;flex-direction:column;gap:.4rem">
      ${recs.map(r => `<li style="color:var(--text-2);font-size:.875rem;padding-left:1.1rem;position:relative"><span style="position:absolute;left:0;color:var(--blue)">→</span>${r}</li>`).join('')}
    </ul>
  `;

  const result = document.getElementById('quizResult');
  result.classList.add('show');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function quizReset() {
  quizState = { phase: 'mc', mcIndex: 0, essayIndex: 0, mcAnswers: new Array(15).fill(null), essayAnswers: new Array(5).fill(''), mcScore: 0, essayScore: 0 };
  document.getElementById('quizHeaderBar').style.display = '';
  document.getElementById('quizContainer').style.display = '';
  document.getElementById('quizNavBar').style.display    = '';
  document.getElementById('quizResult').classList.remove('show');
  quizRenderCurrent();
  document.querySelector('.quiz-wrap')?.scrollIntoView({ behavior: 'smooth' });
}


/* ══════════════════════════════════════════════════════════
   ARTIKEL CRUD — localStorage
   ══════════════════════════════════════════════════════════ */
const DEFAULT_ARTICLES = [
  {
    id: 1,
    title: 'Kenapa Game Online Bikin Nagih? Ini Penjelasan Ilmiahnya',
    category: 'Edukasi',
    readTime: '5',
    image: 'img/Article_1.png',                       // ← fallback kalau foto tidak ada
    color: '#EFF6FF',
    date: '2025-01-15',
    url: 'article_1.html',
    excerpt: 'Ada mekanisme psikologis kompleks di balik desain game yang membuatmu terus kembali bermain. Ini penjelasan ilmiahnya.',
    content: `...`  // isi konten tetap sama
  },
  {
    id: 2,
    title: 'Flow State: Saat Kamu Lupa Waktu Karena Game',
    category: 'Psikologi',
    readTime: '4',
    image: 'img/artikel/artikel2.jpg',
    color: '#F0FDF4',
    date: '2025-01-22',
    excerpt: '...',
    content: `...`
  },
  {
    id: 3,
    title: '5 Cara Detox Digital yang Terbukti Efektif',
    category: 'Digital Wellness',
    readTime: '6',
    image: 'img/artikel/artikel3.jpg',
    color: '#FEFCE8',
    date: '2025-02-01',
    excerpt: '...',
    content: `...`
  }
];

function artikelGetAll() {
  const VERSION = '2';  // ← naikkan angka ini setiap kamu ubah DEFAULT_ARTICLES
  if (localStorage.getItem('btl_articles_version') !== VERSION) {
    localStorage.removeItem('btl_articles');
    localStorage.setItem('btl_articles_version', VERSION);
  }
  try {
    const stored = localStorage.getItem('btl_articles');
    if (stored) return JSON.parse(stored);
    const defaults = JSON.parse(JSON.stringify(DEFAULT_ARTICLES));
    localStorage.setItem('btl_articles', JSON.stringify(defaults));
    return defaults;
  } catch { return JSON.parse(JSON.stringify(DEFAULT_ARTICLES)); }
}

function artikelSaveAll(arr) {
  try { localStorage.setItem('btl_articles', JSON.stringify(arr)); } catch {}
}

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
    <div class="art-thumb" style="overflow:hidden;background:#f1f5f9">
      <img src="${a.image || ''}" alt="${a.title}"
        style="width:100%;height:100%;object-fit:cover;display:block;"
        onerror="this.parentElement.style.background='#EFF6FF';this.style.display='none';">
    </div>
    <div class="art-body">
      <div class="art-cat">${a.category}</div>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
      <div class="art-footer">
        <span>⏱ ${a.readTime} menit baca</span>
        <a href="${a.url || '#'}" class="art-btn art-btn-read">
          Selengkapnya &rsaquo;
        </a>
      </div>
    </div>
  </div>
`).join('');
}

function artikelView(id) {
  const articles = artikelGetAll();
  const a = articles.find(x => x.id === id);
  if (!a) return;
  const grid  = document.getElementById('artikelGrid');
  const full  = document.getElementById('artFull');
  const content = document.getElementById('artFullContent');
  if (!full || !content) return;

  if (grid) grid.style.display = 'none';
  document.querySelector('.artikel-toolbar')?.style && (document.querySelector('.artikel-toolbar').style.display = 'none');
  content.innerHTML = `
    <span class="tag tag-blue" style="margin-bottom:.75rem">${a.category}</span>
    <h2 style="margin-top:.5rem;margin-bottom:.4rem">${a.title}</h2>
    <p class="text-small" style="margin-bottom:1.75rem">📅 ${a.date || ''} &nbsp;·&nbsp; ⏱ ${a.readTime} menit baca</p>
    <div class="art-full-content">${artikelParseContent(a.content)}</div>
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
  const toolbar = document.querySelector('.artikel-toolbar');
  if (toolbar) toolbar.style.display = '';
  if (full) full.classList.remove('show');
  grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let editingId = null;
function artikelOpenAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Tambah Artikel Baru';
  document.getElementById('artTitle').value    = '';
  document.getElementById('artCategory').value = 'Edukasi';
  document.getElementById('artReadTime').value = '5';
  document.getElementById('artEmoji').value    = '📝';
  document.getElementById('artColor').value    = '#EFF6FF';
  document.getElementById('artDate').value     = new Date().toISOString().split('T')[0];
  document.getElementById('artExcerpt').value  = '';
  document.getElementById('artContent').value  = '';
  document.getElementById('artikelModal').classList.add('show');
}

function artikelOpenEdit(id) {
  const articles = artikelGetAll();
  const a = articles.find(x => x.id === id);
  if (!a) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Artikel';
  document.getElementById('artTitle').value    = a.title;
  document.getElementById('artCategory').value = a.category;
  document.getElementById('artReadTime').value = a.readTime;
  document.getElementById('artEmoji').value    = a.emoji;
  document.getElementById('artColor').value    = a.color || '#EFF6FF';
  document.getElementById('artDate').value     = a.date || '';
  document.getElementById('artExcerpt').value  = a.excerpt;
  document.getElementById('artContent').value  = a.content;
  document.getElementById('artikelModal').classList.add('show');
}

function artikelSave() {
  const title    = document.getElementById('artTitle').value.trim();
  const excerpt  = document.getElementById('artExcerpt').value.trim();
  const content  = document.getElementById('artContent').value.trim();
  if (!title || !excerpt || !content) { alert('Judul, ringkasan, dan konten wajib diisi!'); return; }

  const articles = artikelGetAll();
  const newData  = {
    id:       editingId || (articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1),
    title,
    category: document.getElementById('artCategory').value,
    readTime: document.getElementById('artReadTime').value,
    emoji:    document.getElementById('artEmoji').value || '📝',
    color:    document.getElementById('artColor').value,
    date:     document.getElementById('artDate').value,
    excerpt,
    content
  };

  if (editingId) {
    const idx = articles.findIndex(a => a.id === editingId);
    if (idx >= 0) articles[idx] = newData;
  } else {
    articles.push(newData);
  }

  artikelSaveAll(articles);
  artikelCloseModal();
  artikelRender();
}

function artikelDelete(id) {
  if (!confirm('Hapus artikel ini? Tindakan tidak dapat dibatalkan.')) return;
  let articles = artikelGetAll();
  articles = articles.filter(a => a.id !== id);
  artikelSaveAll(articles);
  artikelRender();
}

function artikelCloseModal() {
  document.getElementById('artikelModal')?.classList.remove('show');
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('artikelModal');
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) artikelCloseModal(); });
  }
});


/* ══════════════════════════════════════════════════════════
   REGISTRASI WEBINAR — localStorage
   ══════════════════════════════════════════════════════════ */
function submitRegistrasi() {
  const nama  = (document.getElementById('regNama')?.value || '').trim();
  const nim   = (document.getElementById('regNIM')?.value  || '').trim();
  const email = (document.getElementById('regEmail')?.value || '').trim();

  const errEl = document.getElementById('regError');
  const errMsg = document.getElementById('regErrorMsg');
  const sucEl  = document.getElementById('regSuccess');

  if (errEl) errEl.classList.remove('show');
  if (sucEl) sucEl.classList.remove('show');

  // Validation
  if (!nama || !nim || !email) {
    if (errMsg) errMsg.textContent = 'Semua field wajib diisi!';
    if (errEl) errEl.classList.add('show');
    return;
  }
  if (!email.includes('@')) {
    if (errMsg) errMsg.textContent = 'Format email tidak valid!';
    if (errEl) errEl.classList.add('show');
    return;
  }

  // Check duplicate NIM
  const regs = regGetAll();
  if (regs.find(r => r.nim === nim)) {
    if (errMsg) errMsg.textContent = `NIM ${nim} sudah terdaftar!`;
    if (errEl) errEl.classList.add('show');
    return;
  }

  // Save
  const entry = { nama, nim, email, timestamp: new Date().toISOString() };
  regs.push(entry);
  regSaveAll(regs);

  // Success
  if (sucEl) sucEl.classList.add('show');
  if (document.getElementById('regNama')) document.getElementById('regNama').value = '';
  if (document.getElementById('regNIM'))  document.getElementById('regNIM').value  = '';
  if (document.getElementById('regEmail')) document.getElementById('regEmail').value = '';

  regRenderList();
}

function regGetAll() {
  try { return JSON.parse(localStorage.getItem('btl_registrations') || '[]'); }
  catch { return []; }
}

function regSaveAll(arr) {
  try { localStorage.setItem('btl_registrations', JSON.stringify(arr)); } catch {}
}

function regRenderList() {
  const listEl  = document.getElementById('participantsList');
  const countEl = document.getElementById('participantCount');
  const emptyEl = document.getElementById('participantsEmpty');
  if (!listEl) return;

  const regs = regGetAll();
  if (countEl) countEl.textContent = regs.length + ' peserta';

  if (regs.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  const items = regs.slice(-20).reverse().map(r => {
    const initials = r.nama.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
    const date = new Date(r.timestamp);
    const timeStr = date.toLocaleDateString('id-ID', { day:'numeric', month:'short' }) + ', ' + date.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
    return `
      <div class="participant-item">
        <div class="p-avatar">${initials}</div>
        <div>
          <div class="p-name">${r.nama}</div>
          <div class="p-nim">NIM: ${r.nim}</div>
        </div>
        <div class="p-time">${timeStr}</div>
      </div>
    `;
  }).join('');

  // Keep empty el in DOM, fill rest
  listEl.innerHTML = `<div class="participants-empty" id="participantsEmpty" style="display:none"></div>` + items;
}


/* ══════════════════════════════════════════════════════════
   COUNTDOWN + GMEET (2 KONDISI: daftar + waktu)
   ══════════════════════════════════════════════════════════ */
function initCountdown() {
  const cdDays    = document.getElementById('cdDays');
  if (!cdDays) return;

  const cfg = EVENT_CONFIG;

  // Isi hero & detail acara dari config
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('heroJudul',      cfg.judul);
  set('heroDeskripsi',  cfg.deskripsi);
  set('detailJudul',    cfg.judul);
  set('detailDeskripsi',cfg.deskripsi);
  set('detailJenis',    cfg.jenisKegiatan);
  set('detailPIC',      cfg.pic);
  set('detailBatas',    cfg.batasDaftar.toLocaleDateString('id-ID', {weekday:'long',day:'numeric',month:'long',year:'numeric'}) + ', ' + cfg.batasDaftar.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) + ' WIB');

  updateKuotaDisplay();
  updateGmeetButton();
  checkRegistrationDeadline();

  function tick() {
    const now  = new Date();
    const diff = cfg.tanggal - now;

    if (diff <= 0) {
      document.getElementById('cdLabel').textContent = 'Webinar sedang berlangsung! 🟢';
      ['cdDays','cdHours','cdMinutes','cdSeconds'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '00'; });
      updateGmeetButton();
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2,'0');
    set('cdDays', pad(d)); set('cdHours', pad(h));
    set('cdMinutes', pad(m)); set('cdSeconds', pad(s));
    updateGmeetButton();
    setTimeout(tick, 1000);
  }
  tick();
}

function updateGmeetButton() {
  const btn    = document.getElementById('gmeetBtn');
  const status = document.getElementById('gmeetStatus');
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
    // Kedua kondisi terpenuhi: sudah daftar + acara sudah mulai
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
  const regs      = regGetAll();
  const terisi    = regs.length;
  const kuota     = EVENT_CONFIG.kuota;
  const sisa      = kuota - terisi;
  const pct       = Math.min(100, Math.round((terisi / kuota) * 100));
  const fill      = document.getElementById('kuotaBarFill');
  const badge     = document.getElementById('kuotaBadge');
  const detail    = document.getElementById('detailKuota');

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
  const regBtn  = document.getElementById('regBtn');
  const fullNotice = document.getElementById('regFullNotice');
  const formWrapper = document.getElementById('regFormWrapper');
  if (sisa <= 0) {
    if (regBtn) { regBtn.disabled = true; regBtn.textContent = 'Kuota Penuh'; regBtn.style.opacity = '0.5'; }
    if (fullNotice) fullNotice.classList.add('show');
    if (formWrapper) formWrapper.style.opacity = '0.5';
  }
}

function checkRegistrationDeadline() {
  const now = new Date();
  if (now > EVENT_CONFIG.batasDaftar) {
    const notice = document.getElementById('regDeadlineNotice');
    const regBtn = document.getElementById('regBtn');
    if (notice) notice.style.display = 'flex';
    if (regBtn) { regBtn.disabled = true; regBtn.textContent = 'Batas Pendaftaran Sudah Berakhir'; regBtn.style.opacity = '0.5'; }
  }
}

/* ══════════════════════════════════════════════════════════
   REGISTRASI WEBINAR
   ══════════════════════════════════════════════════════════ */
function submitRegistrasi() {
  const nama  = (document.getElementById('regNama')?.value  || '').trim();
  const nim   = (document.getElementById('regNIM')?.value   || '').trim();
  const email = (document.getElementById('regEmail')?.value || '').trim();

  const errEl  = document.getElementById('regError');
  const errMsg = document.getElementById('regErrorMsg');
  const sucEl  = document.getElementById('regSuccess');
  if (errEl) errEl.classList.remove('show');
  if (sucEl) sucEl.classList.remove('show');

  // Validasi
  if (!nama || !nim || !email) {
    if (errMsg) errMsg.textContent = 'Semua field wajib diisi!';
    if (errEl) errEl.classList.add('show'); return;
  }
  if (!email.includes('@')) {
    if (errMsg) errMsg.textContent = 'Format email tidak valid!';
    if (errEl) errEl.classList.add('show'); return;
  }

  // Cek kuota
  const regs = regGetAll();
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

  // Tampilkan sukses
  if (sucEl) sucEl.classList.add('show');
  ['regNama','regNIM','regEmail'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  regRenderList();
  updateKuotaDisplay();
  updateGmeetButton();
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Quiz
  if (document.getElementById('quizContainer')) quizInit();

  // Artikel
  if (document.getElementById('artikelGrid')) artikelRender();

  // Registrasi & Countdown
  if (document.getElementById('participantsList')) regRenderList();
  if (document.getElementById('cdDays')) initCountdown();
});
