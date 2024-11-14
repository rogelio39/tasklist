import schedule from 'node-schedule';
import { resend } from '../config/resend.js';

// Objeto para almacenar los trabajos programados
const scheduledJobs = {};

export const scheduleEmailReminder = async (req, res) => {
    const { email, task } = req.body;
    const jobKey = `${email}-${task.dueDate}`; // Crea una clave única para el trabajo

    try {
        // Mostrar los valores y tipos de dueDate y createdAt antes de la conversión
        const dueDate = new Date(task.dueDate);
        const createdDate = task.createdAt ? new Date(task.createdAt) : new Date();
        
        // Si la fecha de vencimiento está en el pasado, ajustarla
        if (dueDate <= createdDate) {
            console.log('El dueDate está en el pasado, ajustando para prueba');
            dueDate.setDate(createdDate.getDate() + 1); // Ajuste para que sea un día en el futuro
        }
        
        // Revisa los valores después del ajuste
        console.log("Verificando fechas después del ajuste:");
        console.log("dueDate ajustado:", dueDate);
        console.log("createdDate:", createdDate);
        

        // Verificar que ambas fechas sean válidas
        if (isNaN(dueDate.getTime()) || isNaN(createdDate.getTime())) {
            console.log('Error: La fecha de vencimiento o de creación es inválida.');
            return res.status(400).json({ error: 'Las fechas de creación y vencimiento deben ser válidas' });
        }

        // Calcular el tiempo hasta el vencimiento en milisegundos
        const timeUntilDue = dueDate - createdDate;

        // Verificar que el tiempo restante sea positivo (es decir, una fecha futura)
        if (timeUntilDue <= 0) {
            console.log('Error: La fecha de vencimiento ya ha pasado o es el momento actual.');
            return res.status(400).json({ error: 'La fecha de vencimiento debe ser futura' });
        }

        console.log(`Tiempo hasta el vencimiento: ${timeUntilDue} ms (${timeUntilDue / (1000 * 60 * 60)} horas)`);

        // Cancelar cualquier trabajo programado previo para esta tarea y usuario
        if (scheduledJobs[jobKey]) {
            console.log(`Cancelando trabajo previo para ${jobKey}`);
            scheduledJobs[jobKey].cancel();
        }

        // Programar el nuevo trabajo para el tiempo calculado
        scheduledJobs[jobKey] = schedule.scheduleJob(new Date(Date.now() + timeUntilDue), async () => {
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

        console.log("Trabajo programado con éxito para dentro de:", timeUntilDue / (1000 * 60), "minutos.");
        res.status(200).json({ message: 'Recordatorio programado con éxito' });
    } catch (error) {
        console.error('Error al programar el recordatorio:', error);
        res.status(500).json({ error: 'Error al programar el recordatorio' });
    }
};
