import { useState, useContext, useEffect } from 'react';
import './Dashboard.css';
import { TasksContext } from '../../Context/TasksContext';
import FormTask from '../formTask/FormTask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL;

const Dashboard = () => {
    const [tasksState, setTasksState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState(false);
    const [deletingTask, setDeletingTask] = useState(null); // Estado para la animación de eliminación
    const { tasks, removeTask } = useContext(TasksContext);

    useEffect(() => {
        setTasksState(tasks);
        if (tasks) {
            setLoading(false);
        }
    }, [tasks]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return <p>Cargando tareas...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const toggleViewInfo = (taskId) => {
        setView((prevView) => ({
            ...prevView,
            [taskId]: !prevView[taskId],
        }));
    };

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
            setTasksState((prevTasks) =>
                prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
            );
            toast.success('Tarea marcada como completada'); // Muestra mensaje de éxito
        } catch (error) {
            setError(error.message);
            toast.error('Error al marcar tarea como completada'); // Muestra mensaje de error
        }
    };

    const deleteTask = async (taskId) => {
        try {
            setDeletingTask(taskId);
            setTimeout(async () => {
                const removedTask = await removeTask(taskId);
                if (removedTask) {
                    setTasksState((prevTasks) =>
                        prevTasks.filter((task) => task._id !== taskId)
                    );
                    toast.success('Tarea eliminada correctamente'); // Muestra mensaje de éxito
                    setDeletingTask(null);
                }
            }, 500);
        } catch (error) {
            setError(error.message);
            toast.error('Error al eliminar tarea'); // Muestra mensaje de error
        }
    };

    const handleSwipe = (taskId) => {
        deleteTask(taskId); // Elimina la tarea si se desliza a la derecha
    };

    return (
        <div className='dashboard-container'>
            <h1>Dashboard de Tareas</h1>
            <FormTask/>
            <div className="swipe-message">
                <p>Desliza a la derecha para eliminar</p>
                <div className="swipe-icon"></div> {/* Icono animado */}
            </div>
            <ToastContainer /> {/* Asegúrate de tener este contenedor para que se muestren las notificaciones */}
            <ul className='task-list'>
                {tasksState.map((task) => (
                    <li 
                        className={`${task.completed ? 'completed' : 'incompleted'} ${deletingTask === task._id ? 'deleting' : ''}`} 
                        key={task._id}
                        onTouchStart={(e) => (e.target.swipeStart = e.touches[0].clientX)}
                        onTouchEnd={(e) => {
                            if (e.target.swipeStart - e.changedTouches[0].clientX > 50) {
                                handleSwipe(task._id);
                            }
                        }}
                    >
                        <h2>{task.title}</h2>
                        <button onClick={() => toggleViewInfo(task._id)}>
                            {view[task._id] ? 'x' : 'ver tarea'}
                        </button>
                        <div className={`task-description ${view[task._id] ? 'opened' : 'closed'}`}>
                            <span><h4>Titulo:</h4><p>{task.title}</p></span>
                            <span><h4>Description:</h4><p>{task.description}</p></span>
                            <span><h4>Fecha:</h4><p>{task.dueDate ? formatDate(task.dueDate) : 'No tiene fecha para cumplirse'}</p></span>
                            <span><h4>Prioridad:</h4><p>{task.priority}</p></span>
                            <span><h4>Notas adicionales:</h4><p>{task.notes}</p></span>
                            <span><h4>Estado:</h4><p>{task.completed ? 'Completada' : 'Pendiente'}</p></span>
                            {!task.completed ? (
                                <button onClick={() => completeTask(task._id)}>
                                    Marcar como Completada
                                </button>
                            ) : (
                                <button onClick={() => deleteTask(task._id)}>Eliminar Tarea</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
