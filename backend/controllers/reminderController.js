// reminderController.js
import { sendReminderEmail } from '../services/mailService.js';
import schedule from 'node-schedule';

export const scheduleEmailReminder = async (req, res) => {
    const { email, task } = req.body;
    console.log("email", email)

    try {
        const dateToSend = new Date(task.dueDate);
        dateToSend.setHours(dateToSend.getHours() - 1); // Ajusta para enviar el recordatorio una hora antes

        // Programar el envío de correo en la fecha y hora específicas
        schedule.scheduleJob(dateToSend, async () => {
            await sendReminderEmail(email, task);
            console.log(`Recordatorio enviado a ${email} para la tarea: ${task.title}`);
        });

        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        res.status(500).json({ error: 'Error al programar el recordatorio' });
    }
};
