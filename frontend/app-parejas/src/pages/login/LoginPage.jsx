import { useState } from 'react';
import './LoginPage.css'
import { useNavigate } from 'react-router-dom';
import LoginGoogle from '../login-google/LoginGoogle';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL

    const token = localStorage.getItem('token');

    const submitHandler = async (e) => {
        e.preventDefault();

        const response = await fetch(`${URL1}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem("user", data.email)
            navigate('/tabla');
        } else {
            console.error('Login failed');
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        navigate('/tabla')
    }

    return (
        <div className='login-container'>
            {
                !token ?
                    <>
                        <h2>Si tienes cuenta, ingresa aqui</h2>
                        <form className='form' onSubmit={submitHandler}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">Login</button>
                        </form>
                        <h2>Inicia sesion con google</h2>
                        <LoginGoogle />
                    </>
                    : <div className='login-on'>
                        <p>Ya te encuentras logueado</p>
                        <button onClick={logout}>Cerrar sesion</button>
                    </div>
            }
        </div>
    );
};

export default LoginPage;
