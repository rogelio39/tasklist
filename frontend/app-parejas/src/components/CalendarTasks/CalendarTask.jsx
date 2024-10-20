import { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Para el Drag & Drop
import './CalendarTask.css';  // Asegúrate de que el archivo CSS esté importado
import { fetchTasks, fetchTasksForDate } from '../../Services/Api';
import { TasksContext } from '../../Context/TasksContext';

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
    const [view, setView] = useState('month'); // Estado para la vista (mensual/semanal/diaria)
    const { modifyTask, addTask } = useContext(TasksContext);



    // Función para obtener todas las tareas
    const fetchAllTasks = async () => {
        try {
            const data = await fetchTasks()
            setAllTasks(data); // Guardamos todas las tareas para procesar las fechas
        } catch (error) {
            console.error('Error al obtener todas las tareas:', error);
        }
    };

    const updateTask = async (updatedTask) => {

        try {
            const updateOk = await modifyTask(updatedTask);
            if (updateOk) {
                console.log('Tarea actualizada:', updateOk);
            }
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };


    // Función para obtener las tareas de una fecha específica
    const getAllTasksForDate = async (date) => {
        try {
            const data = await fetchTasksForDate(date);
            setTasksForDate(data); // Guardamos las tareas para la fecha seleccionada
        } catch (error) {
            console.error('Error al obtener las tareas para la fecha seleccionada:', error);
        }
    };

    // Manejar el cambio de fecha
    const handleDateChange = (date) => {
        setSelectedDate(date);
        getAllTasksForDate(date);
    };

    // Función para agregar una nueva tarea
    const handleTaskSubmit = async (e) => {
        e.preventDefault();

        try {
            const createATask = await addTask(newTask, selectedDate)
            if (createATask && createATask._id) {
                setTasksForDate([...tasksForDate, createATask]);  // Agregamos la nueva tarea a la lista de tareas de esa fecha
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

    // Función para obtener las tareas de una fecha
    const getTasksForDate = (date) => {
        return allTasks.filter(
            (task) => new Date(task.dueDate).toDateString() === date.toDateString()
        );
    };

    // Manejo del evento de Drag & Drop
    // Manejo del evento de Drag & Drop
    const onDragEnd = (result) => {
        const { destination } = result;
        if (!destination) return;

        const taskId = result.draggableId;
        const newDate = new Date(destination.droppableId); // Asegúrate de que esto sea una fecha válida

        const task = allTasks.find((task) => task._id === taskId);

        if (task && newDate) {
            const updatedTask = { ...task, dueDate: newDate };

            // Actualiza la tarea en el estado local
            setAllTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === taskId ? updatedTask : t))
            );

            // Llama a la función para actualizar en el backend
            updateTask(updatedTask);
        }
    };

    // Muestra los puntos de prioridad en el calendario
    const getTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayTasks = getTasksForDate(date);

            if (dayTasks.length > 0) {
                const priorityTask = dayTasks.find(task => task.priority);
                let color;

                if (priorityTask) {
                    switch (priorityTask.priority) {
                        case 'High':
                            color = 'red';
                            break;
                        case 'Medium':
                            color = 'yellow';
                            break;
                        case 'Low':
                            color = 'green';
                            break;
                        default:
                            color = 'gray';
                    }
                }

                return <div style={{ backgroundColor: color, height: '10px', width: '10px', borderRadius: '50%' }}></div>;
            }
        }
        return null;
    };

    useEffect(() => {
        fetchAllTasks();
 // Obtenemos todas las tareas al cargar el componente
    }, []);

    return (
        <div className='calendar-section'>
            {/* Cambiar vista */}
            <div>
                <button onClick={() => setView('month')}>Vista Mensual</button>
                <button onClick={() => setView('week')}>Vista Semanal</button>
                <button onClick={() => setView('day')}>Vista Diaria</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className='calendar'>
                    <h1>Agendar Tareas en el Calendario</h1>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileContent={getTileContent}
                        view={view}
                    />
                </div>

                <div className="tasks-section">
                    <h3>Tareas para {selectedDate.toDateString()}</h3>
                    {tasksForDate.length > 0 ? (
                        <Droppable droppableId={selectedDate.toISOString()}>
                            {(provided) => (
                                <ul  ref={provided.innerRef} {...provided.droppableProps}>
                                    {tasksForDate.map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <li className='drop'
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{ backgroundColor: 'lightgray', margin: '4px', padding: '8px', ...provided.draggableProps.style }}
                                                >
                                                    <strong>{task.title}</strong> - {task.priority} - {task.description}
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
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
            </DragDropContext>
        </div>
    );
};

export default CalendarTask;
