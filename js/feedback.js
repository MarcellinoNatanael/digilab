/* ============================================================
   DigiLab — feedback.js  (Form Feedback Publik)
   ============================================================ */
'use strict';

const FB_CONFIG = {
  supabaseUrl: 'https://wzsqtpnvkjbgndymdjci.supabase.co',
  supabaseKey: 'sb_publishable_BPAM_GRlDKiSp-Z1FxyrEw_TVn685ez',
};

/* ── DB Helper ──────────────────────────────────────────── */
const fbDB = {
  h: () => ({
    'apikey'       : FB_CONFIG.supabaseKey,
    'Authorization': 'Bearer ' + FB_CONFIG.supabaseKey,
    'Content-Type' : 'application/json',
    'Prefer'       : 'return=representation',
  }),

  async getQuestions() {
    const r = await fetch(
      FB_CONFIG.supabaseUrl + '/rest/v1/feedback_questions?select=*&order=sort_order.asc,id.asc',
      { headers: fbDB.h() }
    );
    if (!r.ok) throw new Error('Gagal');
    return r.json();
  },

  async emailSubmitted(email) {
    const r = await fetch(
      FB_CONFIG.supabaseUrl + '/rest/v1/feedback_responses?respondent_email=eq.' + encodeURIComponent(email) + '&select=id',
      { headers: fbDB.h() }
    );
    const d = await r.json();
    return Array.isArray(d) && d.length > 0;
  },

  async submitFeedback(name, email, answers) {
    const r1 = await fetch(FB_CONFIG.supabaseUrl + '/rest/v1/feedback_responses', {
      method : 'POST',
      headers: fbDB.h(),
      body   : JSON.stringify({ respondent_name: name, respondent_email: email || null }),
    });
    if (!r1.ok) { const e = await r1.json().catch(() => ({})); throw new Error(e.message || 'Gagal'); }
    const [response] = await r1.json();

    if (answers.length > 0) {
      const payload = answers.map(a => ({ ...a, response_id: response.id }));
      const r2 = await fetch(FB_CONFIG.supabaseUrl + '/rest/v1/feedback_answers', {
        method : 'POST',
        headers: fbDB.h(),
        body   : JSON.stringify(payload),
      });
      if (!r2.ok) { const e = await r2.json().catch(() => ({})); throw new Error(e.message || 'Gagal simpan jawaban'); }
    }
    return response;
  },
};

/* ── Scale selector ─────────────────────────────────────── */
function selectScale(btn) {
  const qid = btn.dataset.qid;
  document.querySelectorAll(`.scale-btn[data-qid="${qid}"]`).forEach(b => {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  const input = document.getElementById('q_' + qid);
  if (input) input.value = btn.dataset.val;
}

/* ── Render pertanyaan ──────────────────────────────────── */
function renderQuestions(questions) {
  const container = document.getElementById('fbQuestions');
  if (!container) return;

  if (questions.length === 0) {
    container.innerHTML = `
      <div class="reg-card" style="text-align:center;padding:2.5rem;color:var(--text-3)">
        <div style="font-size:2rem;margin-bottom:0.5rem">📋</div>
        Pertanyaan feedback belum tersedia. Cek kembali nanti.
      </div>`;
    return;
  }

  container.innerHTML = questions.map((q, i) => {
    const req = q.required
      ? '<span style="color:var(--danger)">*</span>'
      : '<span style="color:var(--text-4);font-size:0.75rem;font-weight:400">(opsional)</span>';

    let inputHtml = '';

    switch (q.type) {

      case 'short_text':
        inputHtml = `<input class="form-input" id="q_${q.id}" placeholder="Jawaban kamu..."/>`;
        break;

      case 'long_text':
        inputHtml = `<textarea class="form-input" id="q_${q.id}" rows="4"
          placeholder="Jawaban kamu..."
          style="resize:vertical;min-height:90px;font-family:inherit"></textarea>`;
        break;

      case 'scale': {
        const min  = q.scale_min ?? 1;
        const max  = q.scale_max ?? 5;
        const nums = [];
        for (let n = min; n <= max; n++) nums.push(n);
        const count = max - min + 1;

        // Lebih dari 7 angka → wrap; sisanya scroll horizontal di mobile
        const wrapStyle = count > 7
          ? 'flex-wrap:wrap;'
          : 'flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;';

        inputHtml = `
          <input type="hidden" id="q_${q.id}" value="">
          <div style="display:flex;gap:0.4rem;align-items:center;margin-top:0.5rem;${wrapStyle}padding-bottom:2px;">
            ${q.scale_label_min
              ? `<span style="font-size:0.72rem;color:var(--text-3);white-space:nowrap;flex-shrink:0">${q.scale_label_min}</span>`
              : ''}
            ${nums.map(n =>
              `<div class="scale-btn" data-qid="${q.id}" data-val="${n}" onclick="selectScale(this)">${n}</div>`
            ).join('')}
            ${q.scale_label_max
              ? `<span style="font-size:0.72rem;color:var(--text-3);white-space:nowrap;flex-shrink:0">${q.scale_label_max}</span>`
              : ''}
          </div>`;
        break;
      }

      case 'multiple_choice': {
        const opts = Array.isArray(q.options) ? q.options : [];
        inputHtml = opts.map(opt => `
          <label style="display:flex;align-items:center;gap:0.6rem;padding:0.45rem 0;cursor:pointer">
            <input type="radio" name="q_${q.id}" value="${opt}"
              style="accent-color:var(--primary);width:16px;height:16px;flex-shrink:0">
            <span>${opt}</span>
          </label>`).join('');
        break;
      }

      case 'checkbox': {
        const opts = Array.isArray(q.options) ? q.options : [];
        inputHtml = opts.map(opt => `
          <label style="display:flex;align-items:center;gap:0.6rem;padding:0.45rem 0;cursor:pointer">
            <input type="checkbox" name="q_${q.id}" value="${opt}"
              style="accent-color:var(--primary);width:16px;height:16px;flex-shrink:0">
            <span>${opt}</span>
          </label>`).join('');
        break;
      }

      case 'dropdown': {
        const opts = Array.isArray(q.options) ? q.options : [];
        inputHtml = `
          <select class="form-input" id="q_${q.id}">
            <option value="" disabled selected>— Pilih jawaban —</option>
            ${opts.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>`;
        break;
      }
    }

    return `
      <div class="reg-card fade-in" style="margin-bottom:1.25rem"
           data-qid="${q.id}" data-type="${q.type}" data-required="${q.required}">
        <div style="display:flex;gap:0.5rem;align-items:flex-start;margin-bottom:0.75rem">
          <span style="font-weight:700;color:var(--primary);min-width:1.5rem">${i + 1}.</span>
          <div style="flex:1;min-width:0">
            <span style="font-weight:600;line-height:1.5">${q.question_text}</span>
            <span style="margin-left:0.3rem">${req}</span>
          </div>
        </div>
        <div>${inputHtml}</div>
      </div>`;
  }).join('');

  // Fade in observer
  document.querySelectorAll('.fade-in').forEach(el => {
    if (!('IntersectionObserver' in window)) { el.classList.add('visible'); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

/* ── Validasi & kumpulkan jawaban ───────────────────────── */
function collectAndValidate() {
  const cards   = [...document.querySelectorAll('[data-qid]')];
  const answers = [];

  for (const card of cards) {
    const qid      = card.dataset.qid;
    const type     = card.dataset.type;
    const required = card.dataset.required === 'true';
    let value = '';

    switch (type) {
      case 'short_text':
      case 'long_text':
      case 'dropdown':
      case 'scale':
        value = (document.getElementById('q_' + qid)?.value || '').trim();
        break;
      case 'multiple_choice':
        value = document.querySelector(`input[name="q_${qid}"]:checked`)?.value || '';
        break;
      case 'checkbox':
        value = [...document.querySelectorAll(`input[name="q_${qid}"]:checked`)].map(e => e.value).join(', ');
        break;
    }

    if (required && !value) return { error: 'Harap isi semua pertanyaan yang wajib (*)!' };
    if (value) answers.push({ question_id: parseInt(qid), answer_value: value });
  }

  return { answers };
}

/* ── Submit feedback ────────────────────────────────────── */
async function submitFeedback() {
  const name   = (document.getElementById('fbName')?.value  || '').trim();
  const email  = (document.getElementById('fbEmail')?.value || '').trim();
  const btn    = document.getElementById('fbSubmitBtn');
  const errEl  = document.getElementById('fbError');
  const errMsg = document.getElementById('fbErrorMsg');

  errEl?.classList.remove('show');

  function showError(msg) {
    if (errMsg) errMsg.textContent = msg;
    errEl?.classList.add('show');
    if (btn) { btn.disabled = false; btn.textContent = 'Kirim Feedback 🚀'; btn.style.opacity = '1'; }
    errEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (!name) return showError('Nama wajib diisi!');
  if (email && !email.includes('@')) return showError('Format email tidak valid!');

  const { answers, error } = collectAndValidate();
  if (error) return showError(error);

  if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; btn.style.opacity = '0.7'; }

  try {
    if (email) {
      const sudahKirim = await fbDB.emailSubmitted(email);
      if (sudahKirim) return showError('Email ini sudah pernah mengisi feedback!');
    }

    await fbDB.submitFeedback(name, email, answers);
    localStorage.setItem('btl_feedback_submitted', '1');

    document.getElementById('fbFormSection').style.display = 'none';
    const sucEl = document.getElementById('fbSuccess');
    sucEl?.classList.add('show');
    sucEl?.scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    showError(err.message || 'Terjadi kesalahan. Coba lagi.');
  }
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  // Navbar toggle
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.textContent = open ? '✕' : '☰';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.textContent = '☰';
    }));
  }

  // Cek sudah pernah submit
  if (localStorage.getItem('btl_feedback_submitted')) {
    document.getElementById('fbFormSection').style.display = 'none';
    document.getElementById('fbAlreadySubmitted')?.classList.add('show');
    return;
  }

  // Load pertanyaan dari Supabase
  try {
    const questions = await fbDB.getQuestions();
    renderQuestions(questions);
  } catch (err) {
    document.getElementById('fbQuestions').innerHTML =
      '<div style="padding:1rem;color:var(--danger);text-align:center">⚠️ Gagal memuat pertanyaan. Refresh halaman.</div>';
  }
});