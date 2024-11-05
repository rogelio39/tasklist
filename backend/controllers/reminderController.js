import schedule from 'node-schedule';
import { resend } from '../config/resend.js';

export const scheduleEmailReminder = async (req, res) => {
    const { email, task } = req.body;

    try {
        // Obtén la fecha de la tarea y ajusta la hora a las 00:01 del día anterior
        const taskDate = new Date(task.dueDate);
        taskDate.setDate(taskDate.getDate() - 1); // Resta un día
        taskDate.setHours(0, 1, 0, 0); // Establece la hora a 00:01

        // Programar el envío de correo en la fecha y hora específicas
        schedule.scheduleJob(taskDate, async () => {
            const { data, error } = await resend.emails.send({
                from: 'Acme <bandadelriosali@revista-urbana.com>',
                to: [`${email}`],
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
        });

        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        res.status(500).json({ error: 'Error al programar el recordatorio' });
    }
};
