import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // Librería actualizada
import './CalendarTask.css';  // Asegúrate de que el archivo CSS esté importado
import { fetchTasksForDate } from '../../Services/Api';
import { useTaskContext } from '../../Context/TasksContext';


const CalendarTask = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasksForDate, setTasksForDate] = useState([]);
    const [allTasks, setAllTasks] = useState([]);  // Almacena todas las tareas para marcar en el calendario
    const [view, setView] = useState('month'); // Estado para la vista (mensual/semanal/diaria)
    const { modifyTask, tasks  } = useTaskContext();
    const [refreshKey, setRefreshKey] = useState(0);

    // Función para obtener todas las tareas

    useEffect(() => {
        try{
            setAllTasks(tasks)
            console.log("me estoy ejecutando")
        }catch(error){
            console.error("Error al obtener todas las tareas: ", error);
        }

    },[tasks])


    const tileClassName = ({ date }) => {
        const isSelected = date.toDateString() === selectedDate.toDateString(); // Verifica si la fecha es la seleccionada
        const isToday = date.toDateString() === new Date().toDateString(); // Verifica si la fecha es hoy
    
        return (
            (isSelected ? 'react-calendar__tile--selected' : '') +
            (isToday ? ' react-calendar__tile--now' : '')
        );
    };
    
    const updateTask = async (updatedTask) => {
        try {

            const updateOk = await modifyTask(updatedTask);
            if (updateOk === 'ok') {
                console.log('ok');
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

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        setTasksForDate([]); // Reinicia las tareas cuando cambias de fecha
        await getAllTasksForDate(date);
        setRefreshKey(prevKey => prevKey + 1);
    };



    const getTasksForDate = (date) => {
        return allTasks.filter(
            (task) => new Date(task.dueDate).toDateString() === date.toDateString()
        );
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        console.log("result", result);


        // Verificamos si no hay destino
        if (!destination) {
            console.error('No hay destino definido.');
            return;
        }

        // Verificamos si el draggableId es válido
        const task = allTasks.find((task) => task._id === draggableId);
        if (!task) {
            console.error('Tarea no encontrada:', draggableId);
            return;
        }

        // Si el destino es el mismo que el origen, no hacemos nada
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // Convertimos el droppableId en fecha
        const newDate = new Date(destination.droppableId);
        if (isNaN(newDate)) {
            console.error('Fecha no válida');
            return;
        }

        // Eliminamos la tarea de la fecha de origen
        const updatedSourceTasks = tasksForDate.filter((t) => t._id !== draggableId);
        setTasksForDate(updatedSourceTasks); // Actualiza el estado de la fecha de origen

        // Actualizamos la tarea con la nueva fecha
        const updatedTask = { ...task, dueDate: newDate };
        await updateTask(updatedTask); // Actualiza la tarea en la base de datos

        // Obtener y actualizar las tareas para la nueva fecha
        await getAllTasksForDate(newDate); // Actualizamos las tareas en la fecha de destino
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
                    <Droppable droppableId={date.toISOString()} key={date.toISOString()}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    backgroundColor: color,
                                    height: '60px', // Mantiene la altura
                                    width: '60px',  // Mantiene el ancho
                                    display: 'flex',
                                    alignItems: 'flex-end', // Cambia a flex-end para que el punto esté más arriba
                                    justifyContent: 'center',
                                    position: 'relative', // Permite un mejor control del contenido
                                }}
                                className='droppable'
                            >
                                <div
                                    style={{
                                        height: '10px', // Ajusta aquí
                                        width: '10px',
                                        backgroundColor: color,
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        bottom: '5px', // Ajusta la posición si es necesario
                                    }}
                                />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                );
                
            }
        }
        return <div></div>;
    };
    

    return (
        <div className='calendar-section'>
            <div className='button-container'>
                <button onClick={() => setView('month')}>Vista Mensual</button>
                <button onClick={() => setView('week')}>Vista Semanal</button>
                <button onClick={() => setView('day')}>Vista Diaria</button>    
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className='calendar' key={refreshKey} >
                    <h2>Agendar Tareas en el Calendario</h2>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileContent={getTileContent}
                        tileClassName={tileClassName}
                        view={view}
                    />
                </div>

                <div className="tasks-section">
                    <h3>Tareas para {selectedDate.toDateString()}</h3>
                    {tasksForDate && tasksForDate.length > 0 ? ( // Verificación aquí
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


        </div>
    );
};

export default CalendarTask;