import { useNavigate } from "react-router-dom";
import './NavBar.css'
const NavBar = () => {

    const navigate = useNavigate();

    const goDashboard = () => {
        navigate('/dashboard');
    }

    const goCompletedTasks = () => {
        navigate('/tasks')
    }

    const goIndex = () => {
        navigate('/')
    }

    return (
        <div className="nav-container">
            <button onClick={goIndex}>Inicio</button>
            <button onClick={goDashboard}>Dashboard</button>
            <button onClick={goCompletedTasks}>Completed Tasks</button>

        </div>
    )
}

export default NavBar
