import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "duongthanhnghe12071996@gmail.com",
        pass: "ehoegyzdvuexthep"
    }
});
export const sendResetPasswordEmail = async (to, resetLink) => {
    const mailOptions = {
        from: 'duongthanhnghe12071996@gmail.com',
        to,
        subject: 'Khôi phục mật khẩu',
        html: `
      <p>Chào bạn,</p>
      <p>Nhấn vào liên kết dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
    `
    };
    await transporter.sendMail(mailOptions);
};
//# sourceMappingURL=mailer.js.map