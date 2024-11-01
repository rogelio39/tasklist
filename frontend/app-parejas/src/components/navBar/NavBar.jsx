import { useNavigate } from "react-router-dom";
import './NavBar.css'
const NavBar = () => {

    const navigate = useNavigate();




    const goIndex = () => {
        navigate('/main')
    }
    const goHome = () => {
        navigate('/')
    }

    const goToLogin = () => {
        navigate('/login')
    }
    const goToRegister = () => {
        navigate('/register')
    }


    return (
        <div className="nav-container">
            <button onClick={goIndex}>Nosotros</button>
            <button onClick={goHome}>Home</button>
            <button onClick={goToRegister}>registro</button>
            <button onClick={goToLogin}>Login</button>

        </div>
    )
}

export default NavBar

