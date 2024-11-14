import schedule from 'node-schedule';
import { resend } from '../config/resend.js';

// Objeto para almacenar los trabajos programados
const scheduledJobs = {};

export const scheduleEmailReminder = async (req, res) => {
    const { email, task } = req.body;
    const jobKey = `${email}-${task.dueDate}`; // Crea una clave única para el trabajo

    try {
        const dueDate = new Date(task.dueDate);
        const createdDate = task.createdAt ? new Date(task.createdAt) : new Date();

        // Si la fecha de vencimiento está en el pasado, ajustarla
        if (dueDate <= createdDate) {
            console.log('El dueDate está en el pasado, ajustando para prueba');
            dueDate.setDate(createdDate.getDate() + 1); // Ajuste para que sea un día en el futuro
        }

        // Verificar que la fecha de vencimiento sea válida
        if (isNaN(dueDate.getTime())) {
            return res.status(400).json({ error: 'Fecha de vencimiento inválida' });
        }

        // Ajustar la fecha para enviar el recordatorio un día antes a las 23:59
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(dueDate.getDate() - 1); // Un día antes
        reminderDate.setHours(23, 59, 0, 0); // A las 23:59 del día anterior

        // Calcular el tiempo hasta el recordatorio
        const timeUntilReminder = reminderDate - new Date();

        if (timeUntilReminder <= 0) {
            return res.status(400).json({ error: 'El recordatorio debe ser para una fecha futura' });
        }

        // Cancelar cualquier trabajo programado previo para esta tarea y usuario
        if (scheduledJobs[jobKey]) {
            console.log(`Cancelando trabajo previo para ${jobKey}`);
            scheduledJobs[jobKey].cancel();
        }

        // Programar el trabajo para el recordatorio
        scheduledJobs[jobKey] = schedule.scheduleJob(reminderDate, async () => {
            console.log("Ejecutando el envío de correo programado");

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

            delete scheduledJobs[jobKey];
        });

        console.log("Trabajo programado con éxito para:", reminderDate);
        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        res.status(500).json({ error: 'Error al programar el recordatorio' });
    }
};
