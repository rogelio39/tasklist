// cronJob.js
import cron from 'node-cron';
import { sendReminderEmail } from './mailService.js';
import { getTasksByDate } from '../controllers/Tasks.controller.js'; // Asegúrate de que esta función te devuelva las tareas del día

cron.schedule('0 0 * * *', async () => { // Cada día a la medianoche
    const today = new Date();
    const tasks = await getTasksByDate(today);

    tasks.forEach(task => {
        sendReminderEmail(task.userEmail, task); // Asegúrate de que task tenga el campo userEmail
    });
});
