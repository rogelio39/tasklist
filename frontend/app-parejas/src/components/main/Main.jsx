import './Main.css'
import { useNavigate } from 'react-router-dom'

const Main = () => {
    const navigate = useNavigate();

    const goDashboard = () => {
        navigate('/dashboard');
    }

    const goCompletedTasks = () => {
        navigate('/tasks')
    }

    const goToStadistics = () => {
        navigate('/stats')
    }

    const goToCalendar = () => {
        navigate('/calendar')
    }
    return (
        <div className='main-container'>
            <h1>Nuestra app para organizarnos</h1>
            <div className="button-container">
            <button onClick={goDashboard}>Agregar nueva tarea</button>
            <button onClick={goCompletedTasks}>tareas completadas</button>
            <button onClick={goToStadistics}>Estadisticas</button>
            <button onClick={goToCalendar}>Calendario</button>
            </div>

        </div>
    )
}

export default Main
