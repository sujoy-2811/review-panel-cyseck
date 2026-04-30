import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@mail.sujoymanna.in'

export async function sendWelcomeEmail({ name, email, token }) {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`

  const { data, error } = await resend.emails.send({
    from: `Review Panel <${FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to Review Panel — Set Your Password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111827;">
        <h2 style="color:#1d4ed8;margin-bottom:4px;">Welcome to Review Panel, ${name}!</h2>
        <p style="color:#6b7280;margin-top:0;">Your account has been created by an administrator.</p>
        <p>To get started, you need to set a password for your account. Click the button below — the link is valid for <strong>24 hours</strong>.</p>
        <a href="${resetLink}"
           style="display:inline-block;margin:20px 0;padding:12px 28px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          Set My Password
        </a>
        <p style="color:#6b7280;font-size:13px;">If you don't see this email in your inbox, please check your <strong>spam or junk folder</strong> and mark it as "Not Spam".</p>
        <p style="color:#6b7280;font-size:13px;">If you weren't expecting this email, someone may have added you by mistake — you can safely ignore it.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">Review Panel · This is an automated message, please do not reply.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send welcome email:', error)
  } else {
    console.log('Welcome email sent:', data.id)
  }
}

export async function sendPasswordResetSuccessEmail({ email }) {
  const { data, error } = await resend.emails.send({
    from: `Review Panel <${FROM_EMAIL}>`,
    to: email,
    subject: 'Your Review Panel Password Has Been Changed',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111827;">
        <h2 style="color:#1d4ed8;margin-bottom:4px;">Password Changed Successfully</h2>
        <p style="color:#6b7280;margin-top:0;">This is a confirmation that the password for your account was just changed.</p>
        <p>If you made this change, no further action is needed.</p>
        <p style="color:#dc2626;font-size:13px;">If you did <strong>not</strong> make this change, please contact your administrator immediately.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">Review Panel · This is an automated message, please do not reply.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send password reset success email:', error)
  } else {
    console.log('Password reset success email sent:', data.id)
  }
}

export async function sendPasswordResetEmail({ email, token }) {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`

  const { data, error } = await resend.emails.send({
    from: `Review Panel <${FROM_EMAIL}>`,
    to: email,
    subject: 'Reset Your Review Panel Password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111827;">
        <h2 style="color:#1d4ed8;margin-bottom:4px;">Password Reset Request</h2>
        <p style="color:#6b7280;margin-top:0;">We received a request to reset the password for this account.</p>
        <p>Click the button below to choose a new password. This link will expire in <strong>1 hour</strong>.</p>
        <a href="${resetLink}"
           style="display:inline-block;margin:20px 0;padding:12px 28px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          Reset My Password
        </a>
        <p style="color:#374151;font-size:13px;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size:12px;color:#6b7280;word-break:break-all;">${resetLink}</p>
        <p style="color:#6b7280;font-size:13px;">If you don't see this email in your inbox, please check your <strong>spam or junk folder</strong> and mark it as "Not Spam".</p>
        <p style="color:#6b7280;font-size:13px;">If you didn't request a password reset, you can ignore this email — your password will not change.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">Review Panel · This is an automated message, please do not reply.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send password reset email:', error)
  } else {
    console.log('Password reset email sent:', data.id)
  }
}
