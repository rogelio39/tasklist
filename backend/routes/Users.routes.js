import express from 'express';
import { registerUser, loginUser } from '../controllers/Users.controller.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/Users.models.js';
import { OAuth2Client } from 'google-auth-library';

const UserRouter = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);

// Ruta de autenticación de Google (cuando el usuario hace clic en "Iniciar sesión con Google")
UserRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de autenticación de Google
UserRouter.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
);


// Ruta para verificar y manejar el token de Google enviado desde el frontend
UserRouter.post('/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        // Verifica el token con el cliente de Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];  // ID único de Google para el usuario
        const email = payload['email'];

        // Busca el usuario en la base de datos o crea uno nuevo
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.create({
                googleId,
                email,
                name: payload['name'],
            });
        }

        // Genera un token JWT propio de tu aplicación
        const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token de tu aplicación al frontend
        res.json({ token: appToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token inválido' });
    }
});

export default UserRouter;
