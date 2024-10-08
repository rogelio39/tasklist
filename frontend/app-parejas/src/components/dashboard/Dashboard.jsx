import { useState, useEffect } from 'react';
import './Dashboard.css'


const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL
const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all tasks when component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${URL1}/api/tasks`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Error fetching tasks');
                }

                const data = await res.json();
                setTasks(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Function to add a new task
    const addTask = async () => {
        if (newTask.trim() === '') return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${URL1}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTask }),
            });

            if (!res.ok) {
                throw new Error('Error adding task');
            }

            const addedTask = await res.json();
            setTasks((prevTasks) => [...prevTasks, addedTask]);
            setNewTask(''); // Clear input field
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to mark a task as completed
    const completeTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${URL1}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: true }),
            });

            if (!res.ok) {
                throw new Error('Error marking task as completed');
            }

            const updatedTask = await res.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${URL1}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!res.ok) {
                throw new Error('Error deleting task');
            }
    
            // Aquí simplemente eliminas la tarea del estado sin hacer fetch de la tarea eliminada
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task._id !== taskId)
            );
        } catch (error) {
            setError(error.message);
        }
    };
    

    // Render loading or error states
    if (loading) {
        return <p>Cargando tareas...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className='dashboard-container'>
            <h1>Dashboard de Tareas</h1>

            <div>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Nueva tarea"
                />
                <button onClick={addTask}>Agregar Tarea</button>
            </div>

            <ul className='task-list'>
                {tasks.map((task) => (
                    <li className={task.completed ? 'completed' : 'incompleted'} key={task._id}>
                        <p>{task.title} - {task.completed ? 'Completada' : 'Pendiente'}</p>
                        {!task.completed ? (
                            <button onClick={() => completeTask(task._id)}>
                                Marcar como Completada
                            </button>
                        ) : <button onClick={() => deleteTask(task._id)}>eliminar tarea</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
