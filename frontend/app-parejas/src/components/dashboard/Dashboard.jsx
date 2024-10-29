import { useState, useEffect } from 'react';
import './Dashboard.css'
import { fetchTasks } from '../../Services/Api';
// import { TasksContext } from '../../Context/TasksContext';


const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL
const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState(false)
    // const {addTask} = useContext(TasksContext);
    // Fetch all tasks when component mounts
    useEffect(() => {
        const fetchAllTasks = async () => {
            setLoading(true);
            try {
                const data = await fetchTasks()
                setTasks(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchAllTasks();
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        // Obtén el día, mes y año
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso se suma 1
        const year = date.getFullYear();

        // Retorna el formato día/mes/año
        return `${day}/${month}/${year}`;
    };


    // Render loading or error states
    if (loading) {
        return <p>Cargando tareas...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }



    const toggleViewInfo = (taskId) => {
        setView((prevView) => ({
            ...prevView,
            [taskId]: !prevView[taskId], // Cambia el estado de la tarea específica
        }));
    };


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
                    <li className={`${task.completed ? 'completed' : 'incompleted'}`} key={task._id}>
                        <h2>{task.title}</h2>
                        <button onClick={() => toggleViewInfo(task._id)}>
                            {view[task._id] ? 'x' : 'ver tarea'}
                        </button>

                        <div className={`task-description ${view[task._id] ? 'opened' : 'closed'}`}>
                            {task.title}
                            <span><h4>Titulo:</h4><p>{task.title}</p></span>
                            <span><h4>Description:</h4><p>{task.description}</p></span>
                            <span><h4>Fecha:</h4><p>{task.dueDate ? formatDate(task.dueDate) : 'No tiene fecha para cumplirse'}</p></span>
                            <span><h4>Prioridad:</h4><p>{task.priority}</p></span>
                            <span><h4>Notas adicionales:</h4><p>{task.notes}</p></span>
                            <span><h4>Estado: </h4><p>{task.completed ? 'Completada' : 'Pendiente'}</p>
                            </span>
                            {!task.completed ? (
                                <button onClick={() => completeTask(task._id)}>
                                    Marcar como Completada
                                </button>
                            ) : <button onClick={() => deleteTask(task._id)}>eliminar tarea</button>}
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Dashboard;
