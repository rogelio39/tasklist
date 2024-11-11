import schedule from 'node-schedule';
import { resend } from '../config/resend.js';

// Objeto para almacenar los trabajos programados
const scheduledJobs = {};

export const scheduleEmailReminder = async (req, res) => {
    const { email, task } = req.body;
    const jobKey = `${email}-${task.dueDate}`; // Crea una clave única para el trabajo

    try {
        // Configurar la fecha para el inicio del día (00:01) de la fecha de vencimiento
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 1, 0, 0); // 00:01 del día de vencimiento

        // Si ya hay un trabajo programado para esta tarea y usuario, cancélalo antes de crear uno nuevo
        if (scheduledJobs[jobKey]) {
            scheduledJobs[jobKey].cancel();
        }

        // Programar el nuevo trabajo
        scheduledJobs[jobKey] = schedule.scheduleJob(taskDate, async () => {
            const { data, error } = await resend.emails.send({
                from: 'Acme <bandadelriosali@revista-urbana.com>',
                to: [email],
                subject: `Tarea: ${task.title} - Prioridad: ${task.priority}`,
                html: `<strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <p>${task.notes}</p>`,
            });

            if (error) {
                console.log("Error en resend", { error });
            } else {
                console.log("Correo enviado con éxito", { data });
            }

            // Elimina el trabajo de la lista después de enviarlo
            delete scheduledJobs[jobKey];
        });

        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        res.status(500).json({ error: 'Error al programar el recordatorio' });
    }
};
