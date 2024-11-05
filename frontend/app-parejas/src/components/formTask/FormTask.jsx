import { useState, useContext } from "react";
import { TasksContext } from "../../Context/TasksContext";
const FormTask = () => {

    const { addTask } = useContext(TasksContext);
    const [tasksState, setTasksState] = useState([]);
    const [error, setError] = useState(null);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        notes: '',
        dueDate: ''
    });


    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const createATask = await addTask(newTask)
            setTasksState([...tasksState, createATask]);
            setNewTask({
                title: '',
                description: '',
                priority: 'Medium',
                notes: '',
                dueDate: ''
            });
            alert('Tarea añadida correctamente');
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
            setError(error.message);
        }
    };



    return (
        <div>

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
                        onChange={(e) => {
                            setNewTask({ ...newTask, dueDate: e.target.value });
                        }}
                        
                        placeholder='Fecha de vencimiento'
                    />
                    <textarea
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                        placeholder='Notas'
                    />
                    <button type='submit'>Agregar Tarea</button>
                </form>
            </div>

        </div>
    )
}

export default FormTask
