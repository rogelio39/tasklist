import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const clientID = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || '521799423975-mftsdt4hfg5rgqo38k7c2v82o7nog0c9.apps.googleusercontent.com';
const URL1 = import.meta.env.VITE_REACT_APP_MODE === "DEV" ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_BACKEND_URL;

const LoginGoogle = () => {
    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${URL1}/api/users/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credentialResponse.credential })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Token de tu backend
                console.log('Inicio de sesión exitoso');
                window.location.href = '/tabla';
            } else {
                console.log('Error en el inicio de sesión:', data.message);
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
        }
    };

    return (
        <div>
            {clientID ? (
                <GoogleOAuthProvider clientId={clientID}>
                    <div className="App">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => {
                                console.log('Error en el inicio de sesión de Google');
                            }}
                        />
                    </div>
                </GoogleOAuthProvider>
            ) : (
                <div>Cargando...</div>
            )}
        </div>
    );
}

export default LoginGoogle;
