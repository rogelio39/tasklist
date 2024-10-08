import { useState, useEffect } from 'react';
import './TaskList.css'
const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const res = await fetch('http://localhost:5000/api/tasks', {
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
