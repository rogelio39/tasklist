import { useState, useEffect } from 'react';
import './TaskList.css'

const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL
const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const res = await fetch(`${URL1}/api/tasks`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error('Error al obtener las tareas');
                }

                const data = await res.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error.message);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className='task-list'>
            <h1>Tareas</h1>
            <ul>
                {tasks.map((task) => (
                    <li className='completed' key={task._id}>
                        {task.title} - {task.completed ? 'Completada' : 'Pendiente'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
