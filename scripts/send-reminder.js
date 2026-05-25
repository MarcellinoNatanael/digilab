// ============================================================
//  DigiLab — scripts/send-reminder.js
//  Dijalankan otomatis oleh GitHub Actions
//  Ambil semua peserta dari Supabase → kirim email via Resend
// ============================================================

const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_KEY;
const RESEND_KEY    = process.env.RESEND_API_KEY;

// Deteksi apakah ini H-1 atau 2 jam sebelum (berdasarkan jam UTC sekarang)
const jamUTC  = new Date().getUTCHours();
const tglUTC  = new Date().getUTCDate();
const isH1    = tglUTC === 31; // 31 Mei = H-1
const label   = isH1 ? 'H-1 (Besok!)' : '2 Jam Lagi!';

// ── Ambil semua peserta dari Supabase ────────────────────────
async function getPeserta() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/peserta?select=nama,email&order=created_at.asc`,
    {
      headers: {
        'apikey'       : SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal ambil peserta: ${err}`);
  }

  return await res.json();
}

// ── Kirim 1 email via Resend ─────────────────────────────────
async function kirimEmail(nama, email) {
  const res = await fetch('https://api.resend.com/emails', {
    method : 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({
      from   : 'DigiLab Webinar <onboarding@resend.dev>', // ← ganti setelah verify domain
      to     : [email],
      subject: isH1
        ? '🎮 Reminder H-1: Webinar "Break the Loop" Besok Malam!'
        : '⏰ 2 Jam Lagi! Webinar "Break the Loop" Segera Dimulai',
      html   : emailTemplate(nama, isH1),
    }),
  });

  return res.status;
}

// ── Template Email ────────────────────────────────────────────
function emailTemplate(nama, isH1) {
  const headline = isH1
    ? '📅 Webinar kamu <strong style="color:#fff;">besok malam</strong>!'
    : '⚡ Webinar dimulai <strong style="color:#fff;">2 jam lagi!</strong>';

  const tipsTambahan = isH1
    ? 'Pastikan kamu sudah ingat jadwalnya ya. Simpan halaman webinar di browser sekarang!'
    : 'Segera buka halaman DigiLab dan siapkan koneksi internet yang stabil. Tombol Google Meet akan aktif tepat jam 19.00 WIB!';

  return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0f0f13;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid #2a2a4a;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6c63ff,#a78bfa);padding:36px 32px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:8px;">${isH1 ? '🎮' : '⚡'}</div>
      <h1 style="margin:0;color:#fff;font-size:1.5rem;font-weight:700;">Break the Loop</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:0.9rem;">
        Webinar Online Gratis — DigiLab
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="color:#c4b5fd;font-size:1rem;margin:0 0 8px;">
        Hai, <strong style="color:#fff;">${nama}</strong> 👋
      </p>
      <p style="color:#a0a0c0;font-size:0.9rem;line-height:1.6;margin:0 0 6px;">
        ${headline}
      </p>
      <p style="color:#a0a0c0;font-size:0.9rem;line-height:1.6;margin:0 0 24px;">
        ${tipsTambahan}
      </p>

      <!-- Detail Box -->
      <div style="background:#0f0f1a;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #2a2a4a;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6c63ff;font-size:0.85rem;width:38%;">📌 Judul</td>
            <td style="padding:8px 0;color:#e0e0f0;font-size:0.85rem;">
              Break the Loop: Cegah Kecanduan dalam Permainan Daring
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6c63ff;font-size:0.85rem;">📅 Tanggal</td>
            <td style="padding:8px 0;color:#e0e0f0;font-size:0.85rem;">Senin, 1 Juni 2026</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6c63ff;font-size:0.85rem;">⏰ Waktu</td>
            <td style="padding:8px 0;color:#e0e0f0;font-size:0.85rem;">19.00 – 20.00 WIB</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6c63ff;font-size:0.85rem;">💻 Platform</td>
            <td style="padding:8px 0;color:#e0e0f0;font-size:0.85rem;">
              Google Meet (link aktif di website tepat jam 19.00)
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="https://marcellinonatanael.github.io/digilab/daftar.html"
           style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#a78bfa);
                  color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;
                  font-weight:600;font-size:0.95rem;">
          Buka Halaman Webinar →
        </a>
      </div>

      <p style="color:#6060a0;font-size:0.8rem;line-height:1.6;margin:0;">
        💡 <strong style="color:#a0a0c0;">Cara bergabung:</strong> Buka halaman webinar DigiLab
        tepat jam 19.00 WIB → klik tombol Google Meet yang akan aktif otomatis.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid #2a2a4a;text-align:center;">
      <p style="color:#404060;font-size:0.75rem;margin:0;">
        © 2026 DigiLab — Your Digital Wellness Laboratory<br/>
        Email ini dikirim karena kamu mendaftar webinar DigiLab.
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('====================================');
  console.log(`DigiLab — Kirim Email Reminder ${label}`);
  console.log('====================================');

  if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_KEY) {
    console.error('❌ ERROR: Secrets belum diset di GitHub!');
    console.error('   Cek: SUPABASE_URL, SUPABASE_KEY, RESEND_API_KEY');
    process.exit(1);
  }

  const peserta = await getPeserta();
  console.log(`✅ Ditemukan ${peserta.length} peserta terdaftar\n`);

  if (peserta.length === 0) {
    console.log('ℹ️  Tidak ada peserta, tidak ada email yang dikirim.');
    return;
  }

  let berhasil = 0;
  let gagal    = 0;

  for (const p of peserta) {
    try {
      const status = await kirimEmail(p.nama, p.email);
      if (status === 200 || status === 201) {
        console.log(`✅ Terkirim → ${p.email}`);
        berhasil++;
      } else {
        console.log(`⚠️  Status ${status} → ${p.email}`);
        gagal++;
      }
    } catch (err) {
      console.log(`❌ Gagal → ${p.email}: ${err.message}`);
      gagal++;
    }

    // Jeda 200ms antar email supaya tidak kena rate limit Resend
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n====================================');
  console.log(`📧 Selesai: ${berhasil} berhasil, ${gagal} gagal`);
  console.log('====================================');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});