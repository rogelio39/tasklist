// mailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio que estés utilizando
    auth: {
        user: 'rogeliosuleta@gmail.com',
        pass: process.env.PASSWORD_NODEMAILER// Usa OAuth2 o variables de entorno para mayor seguridad
    }
});

export const sendReminderEmail = (email, task) => {
    const mailOptions = {
        from: 'rogeliosuleta@gmail.com',
        to: email,
        subject: 'Recordatorio de Tarea',
        text: `Tienes una tarea pendiente: ${task.title}\nDescripción: ${task.description}`
    };

    return transporter.sendMail(mailOptions);
};
