import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskStats.css'

const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL

const TaskStats = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [taskCount, setTaskCount] = useState(null);

    const handleStatsSubmit = async () => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${URL1}/api/tasks/stats?start=${startDate.toISOString()}&end=${endDate.toISOString()}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        setTaskCount(data.taskCount);
    };

    return (
        <div>
            <h1>Estadísticas de Tareas</h1>
            <div>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Fecha de inicio"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Fecha de fin"
                />
            </div>
            <button onClick={handleStatsSubmit}>Obtener Estadísticas</button>
            {taskCount !== null && <p>Total de tareas: {taskCount}</p>}
        </div>
    );
};

export default TaskStats;
