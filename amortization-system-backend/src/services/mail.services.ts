import nodemailer from 'nodemailer';

// Servicio para enviar email
export const sendEmail = async (to: string, mailMessage: string,) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: {
                name: 'ChaskiPass',
                address: process.env.EMAIL_USER || 'default@example.com'
            },
            to: to,
            subject: 'Bienvenido a ChaskiPass',
            html: mailMessage
        });
        return { success: true, info: info };
    } catch (error) {
        // algo falló al enviar
        return { success: false, error };
    }
};