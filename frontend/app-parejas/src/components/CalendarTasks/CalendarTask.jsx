import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL

const CalendarTask = () => {
    const [date, setDate] = useState(new Date());
    const [task, setTask] = useState('');

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleTaskSubmit = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL1}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: task,
                date: date
            })
        });

        if (response.ok) {
            alert('Tarea añadida correctamente');
        } else {
            alert('Error al añadir la tarea');
        }
    };

    return (
        <div>
            <h1>Agendar Tareas en el Calendario</h1>
            <Calendar onChange={handleDateChange} value={date} />
            <input
                type="text"
                placeholder="Escribe la tarea"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button onClick={handleTaskSubmit}>Añadir Tarea</button>
        </div>
    );
};

export default CalendarTask;
