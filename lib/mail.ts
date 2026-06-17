import { Resend } from "resend";

const FROM = "ASTİM Ticaret Merkezi <noreply@astimticaretmerkezi.com>";

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  });

  if (error) throw new Error(`Mail gönderilemedi: ${error.message}`);
  return data;
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function welcomeMailHtml({
  name,
  email,
  password,
  atolyeId,
}: {
  name: string;
  email: string;
  password: string;
  atolyeId: string | null;
}) {
  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F3F0;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F3F0;padding:40px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#F4F3F0;border:2px solid #111111;max-width:520px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:24px 32px">
            <p style="margin:0;color:#FF4A00;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700">
              ASTİM TİCARET MERKEZİ
            </p>
            <h1 style="margin:8px 0 0;color:#F4F3F0;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em">
              HOŞ GELDİNİZ
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 24px;font-size:15px;color:#111111;line-height:1.6">
              Merhaba <strong>${name}</strong>,<br>
              ASTİM Atölye Paneli'ne hoş geldiniz. Aşağıdaki bilgilerle giriş yapabilirsiniz.
            </p>

            <!-- Credentials box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #111111;margin-bottom:24px">
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #111111;background:#EFEEEB">
                  <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#747878">E-POSTA</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#111111;font-family:monospace">${email}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #111111;background:#EFEEEB">
                  <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#747878">ŞİFRE</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#111111;font-family:monospace">${password}</p>
                </td>
              </tr>
              ${atolyeId ? `<tr>
                <td style="padding:12px 16px;background:#EFEEEB">
                  <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#747878">ATÖLYE</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#111111;font-family:monospace">${atolyeId}</p>
                </td>
              </tr>` : ""}
            </table>

            <p style="margin:0 0 24px;font-size:13px;color:#747878;line-height:1.6">
              Güvenliğiniz için ilk girişten sonra şifrenizi değiştirmenizi öneririz.
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#111111">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://astimticaretmerkezi.com"}/giris"
                     style="display:inline-block;padding:14px 32px;color:#F4F3F0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none">
                    PANELE GİRİŞ YAP →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #111111">
            <p style="margin:0;font-size:11px;color:#747878;text-transform:uppercase;letter-spacing:0.1em">
              ASTİM Ticaret Merkezi — Atölye Yönetim Sistemi
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
