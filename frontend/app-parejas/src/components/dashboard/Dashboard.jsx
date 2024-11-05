import { useState, useContext, useEffect } from 'react';
import './Dashboard.css';
import { TasksContext } from '../../Context/TasksContext';
import FormTask from '../formTask/FormTask';


const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL;

const Dashboard = () => {
    const [tasksState, setTasksState] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState(false);
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
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteTask = async (taskId) => {
        try {

            const removedTask = await removeTask(taskId);
            if (removedTask) {
                // Aquí simplemente eliminas la tarea del estado sin hacer fetch de la tarea eliminada
                setTasksState((prevTasks) =>
                    prevTasks.filter((task) => task._id !== taskId)
                );
            }

        } catch (error) {
            setError(error.message);
        }
    };



    return (
        <div className='dashboard-container'>
            <h1>Dashboard de Tareas</h1>

            <FormTask/>

            <ul className='task-list'>
                {tasksState.map((task) => (
                    <li className={`${task.completed ? 'completed' : 'incompleted'}`} key={task._id}>
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

// Function to mark a task as completed
