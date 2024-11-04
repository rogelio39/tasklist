// reminderController.js
// import { sendReminderEmail } from '../services/mailService.js';
import schedule from 'node-schedule';
import { resend } from '../config/resend.js';

export const scheduleEmailReminder = async (req, res) => {
    const { email, task } = req.body;

    try {
        const localDate = new Date(); // Hora actual en el horario local
        localDate.setMinutes(localDate.getMinutes() + 1); // Añade 1 minuto


        // Programar el envío de correo en la fecha y hora específicas
        schedule.scheduleJob(localDate, async () => {
            const { data, error } = await resend.emails.send({
                from: 'Acme <bandadelriosali@revista-urbana.com>',
                to: [`${email}`],
                subject:`Tarea: ${task.title}-Prioridad: ${task.priority}`,
                html: `<strong>${task.title}</strong>
                    <strong>${task.description}</strong>
                    <strong>${task.notes}</strong>
                
                `,
            });

            if(error){
                console.log("error en resend", {error})
            }

            console.log("data en resend",{data})
        });

        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        res.status(500).json({ error: 'Error al programar el recordatorio' });
    }
};  