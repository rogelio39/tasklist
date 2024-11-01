
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();


    const goToRegister = () => {
            navigate('/register')
    }
    return (
        <div className="home-container">
            <header className="header">
                <h1 className="app-title">TaskMaster</h1>
                <p className="app-tagline">Organiza tu vida, un día a la vez</p>
                <button onClick={goToRegister} className="cta-button">Comienza Ahora</button>
            </header>

            <section className="features">
                <div className="feature-item">
                    <h2>Gestión de Tareas</h2>
                    <p>Crea, edita y organiza tus tareas diarias con facilidad.</p>
                </div>
                <div className="feature-item">
                    <h2>Calendario Integrado</h2>
                    <p>Visualiza tus tareas programadas en un calendario intuitivo.</p>
                </div>
                <div className="feature-item">
                    <h2>Notificaciones Personalizadas</h2>
                    <p>Recibe recordatorios para mantenerte siempre al día.</p>
                </div>
            </section>

            <section className="image-section">
                <img
                    src="https://revista-urbana.nyc3.cdn.digitaloceanspaces.com/DALL%C2%B7E%202024-11-01%2020.27.46%20-%20A%20modern%20and%20minimalistic%20homepage%20design%20for%20a%20web%20app,%20showcasing%20a%20sleek%20calendar%20and%20task%20management%20interface.%20The%20page%20features%20a%20calendar%20secti.webp"
                    alt="Vista previa de la aplicación"
                    className="app-image"
                />
            </section>
        </div>
    );
};

export default Home;
