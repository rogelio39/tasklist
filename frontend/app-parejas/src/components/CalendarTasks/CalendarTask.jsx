import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL;

const CalendarTask = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasksForDate, setTasksForDate] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        notes: ''
    });
    const [allTasks, setAllTasks] = useState([]);  // Almacena todas las tareas para marcar en el calendario

    // Función para obtener todas las tareas y mostrar puntos en las fechas del calendario
    const fetchAllTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${URL1}/api/tasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            setAllTasks(data); // Guardamos todas las tareas para procesar las fechas
        } catch (error) {
            console.error('Error al obtener todas las tareas:', error);
        }
    };

    // Función para obtener las tareas de una fecha específica
    const fetchTasksForDate = async (date) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${URL1}/api/tasks/tasks-by-date?date=${date.toISOString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.json();
            setTasksForDate(data); // Guardamos las tareas para la fecha seleccionada
        } catch (error) {
            console.error('Error al obtener las tareas para la fecha seleccionada:', error);
        }
    };

    // Cuando cambia la fecha seleccionada, obtenemos las tareas para esa fecha
    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchTasksForDate(date);
    };

    // Función para agregar una nueva tarea
    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${URL1}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...newTask,
                    dueDate: selectedDate,  // Se agrega la tarea a la fecha seleccionada
                }),
            });

            if (response.ok) {
                const createdTask = await response.json();
                setTasksForDate([...tasksForDate, createdTask]);  // Agregamos la nueva tarea a la lista de tareas de esa fecha
                setNewTask({
                    title: '',
                    description: '',
                    priority: 'Medium',
                    notes: '',
                });
                alert('Tarea añadida correctamente');
            } else {
                alert('Error al añadir la tarea');
            }
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
        }
    };

    // Muestra un punto en las fechas con tareas
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasTask = allTasks.some(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate.toDateString() === date.toDateString();
            });

            return hasTask ? <div className="dot"></div> : null;  // Un punto si hay tareas
        }
    };

    useEffect(() => {
        fetchAllTasks();  // Obtenemos todas las tareas al cargar el componente
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <h1>Agendar Tareas en el Calendario</h1>
                <Calendar onChange={handleDateChange} value={selectedDate} tileContent={tileContent} />
            </div>

            <div>
                <h3>Tareas para {selectedDate.toDateString()}</h3>
                {tasksForDate.length > 0 ? (
                    <ul>
                        {tasksForDate.map(task => (
                            <li key={task._id}>
                                <strong>{task.title}</strong> - {task.priority} - {task.description}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay tareas para esta fecha.</p>
                )}
                <form onSubmit={handleTaskSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Escribe la tarea"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Descripción"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <select
                        name="priority"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        <option value="Low">Baja</option>
                        <option value="Medium">Media</option>
                        <option value="High">Alta</option>
                    </select>
                    <input
                        type="text"
                        name="notes"
                        placeholder="Notas adicionales"
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    />
                    <button type="submit">Añadir Tarea</button>
                </form>
            </div>
        </div>
    );
};

export default CalendarTask;
