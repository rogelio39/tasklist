import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuthContext } from '../../Context/AuthContext';
const clientID = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || '';

const LoginGoogle = () => {
    const {handleSuccess} = useAuthContext();
    const handleLogin = async (credentialResponse) => {
        try {
            const successLogin = await handleSuccess(credentialResponse);
            if(successLogin){
                window.location.href = '/tabla';
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
                            onSuccess={handleLogin}
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
