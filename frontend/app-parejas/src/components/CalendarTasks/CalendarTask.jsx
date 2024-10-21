import { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // Librería actualizada
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
            const data = await fetchTasks();
            setAllTasks(data); // Guardamos todas las tareas para procesar las fechas
        } catch (error) {
            console.error('Error al obtener todas las tareas:', error);
        }
    };

    const updateTask = async (updatedTask) => {
        try {
            const updateOk = await modifyTask(updatedTask);
            console.log("updateOk", updateOk)
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
            console.log("data", data)
            setTasksForDate(data); // Guardamos las tareas para la fecha seleccionada
        } catch (error) {
            console.error('Error al obtener las tareas para la fecha seleccionada:', error);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        getAllTasksForDate(date);
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const createATask = await addTask(newTask, selectedDate);
            if (createATask && createATask._id) {
                setTasksForDate([...tasksForDate, createATask]);
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

    const getTasksForDate = (date) => {
        return allTasks.filter(
            (task) => new Date(task.dueDate).toDateString() === date.toDateString()
        );
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newDate = new Date(destination.droppableId);
        if (isNaN(newDate)) {
            console.error('Fecha no válida');
            return;
        }



        const task = allTasks.find((task) => task._id === draggableId);

        if (task && newDate) {
            const updatedTask = { ...task, dueDate: newDate };
            setAllTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === task._id ? updatedTask : t))
            );
            await updateTask(updatedTask);
            await getAllTasksForDate(newDate);
        }
    };

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
                return (
                    <Droppable droppableId={date.toISOString()}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{ backgroundColor: color, height: '10px', width: '10px', borderRadius: '50%' }}
                                className='droppable'
                            >
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                );
            }
        }
        return null;
    };

    useEffect(() => {
        fetchAllTasks(); // Obtenemos todas las tareas al cargar el componente
    }, []);

    return (
        <div className='calendar-section'>
            <div className='button-container'>
                <button onClick={() => setView('month')}>Vista Mensual</button>
                <button onClick={() => setView('week')}>Vista Semanal</button>
                <button onClick={() => setView('day')}>Vista Diaria</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className='calendar'>
                    <h2>Agendar Tareas en el Calendario</h2>
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
                                <ul ref={provided.innerRef} {...provided.droppableProps}>
                                    {tasksForDate.map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <li
                                                    className='draggable'
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        backgroundColor: 'lightgray',
                                                        margin: '4px',
                                                        padding: '8px',
                                                        ...provided.draggableProps.style
                                                    }}
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
                        <p>No hay tareas para esta fecha</p>
                    )}
                </div>
            </DragDropContext>

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
                    <textarea
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                        placeholder='Notas'
                    />
                    <button type='submit'>Agregar Tarea</button>
                </form>
            </div>
        </div>
    );
};

export default CalendarTask;
