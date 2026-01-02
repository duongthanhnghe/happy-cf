import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_NOREPLY_NAME,
    pass: process.env.EMAIL_NOREPLY_APP_KEY,
  }
})

export const sendResetPasswordEmail = async (to: string, resetLink: string) => {
  const mailOptions = {
    from: `${process.env.EMAIL_NOREPLY_NAME}`,
    to,
    subject: 'Khôi phục mật khẩu',
    html: `
      <p>Chào bạn,</p>
      <p>Nhấn vào liên kết dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
    `
  }

  await transporter.sendMail(mailOptions)
}
