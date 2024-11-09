import { useState, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TasksContext } from "../../Context/TasksContext";
import './FormTask.css';

const FormTask = () => {
    const email = localStorage.getItem('user');
    const { addTask, sendEmail } = useContext(TasksContext);
    const [tasksState, setTasksState] = useState([]);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        notes: '',
        dueDate: ''
    });

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const createATask = await addTask(newTask);
            setTasksState([...tasksState, createATask]);
            setNewTask({
                title: '',
                description: '',
                priority: 'Medium',
                notes: '',
                dueDate: ''
            });
            await sendEmail(email, newTask);
            toast.success('Tarea añadida correctamente');
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
            setError(error.message);
            toast.error('Error al agregar la tarea');
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="add-task-form">
                <h2>Añadir Nueva Tarea</h2>
                <form onSubmit={handleTaskSubmit}>
                    <input
                        type='text'
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder='Título'
                        required
                    />
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder='Descripción'
                        required
                    />
                    <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        <option value='High'>Alta</option>
                        <option value='Medium'>Media</option>
                        <option value='Low'>Baja</option>
                    </select>
                    <input
                        type='date'
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        placeholder='Fecha de vencimiento'
                    />
                    <textarea
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                        placeholder='Notas'
                    />
                    <button type='submit'>Agregar Tarea</button>
                    {
                        error && <div>{error}</div>
                    }
                </form>
            </div>
        </div>
    );
};

export default FormTask;
