import { useState, useEffect } from "react";
import PropTypes from "prop-types";
const TaskForm = ({ onSave, initialTask, onCancel }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [priority, setPriority] = useState("low"); // Nueva propiedad para la prioridad
    const [recurrence, setRecurrence] = useState("none");

    useEffect(() => {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description);
            setDate(new Date(initialTask.date).toISOString().slice(0, 10));
            setPriority(initialTask.priority || "low");
            setRecurrence(initialTask.recurrence || "none");
        }
    }, [initialTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = {
            id: initialTask ? initialTask.id : Date.now(),
            title,
            description,
            date: new Date(date),
            priority,  // Incluimos la prioridad
            recurrence,
        };

        onSave(newTask);
        setTitle("");
        setDescription("");
        setDate(new Date().toISOString().slice(0, 10));
        setPriority("low");
        setRecurrence("none");
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Otros campos */}
            <div>
                <label>Prioridad: </label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>
            </div>
            <button type="submit">{initialTask ? "Guardar cambios" : "Agregar tarea"}</button>
            {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
        </form>
    );
};


TaskForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    initialTask: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.instanceOf(Date),
        priority: PropTypes.string,
        recurrence: PropTypes.string, // Añadir la prop recurrence
    }),
    onCancel: PropTypes.func,
};

export default TaskForm;
