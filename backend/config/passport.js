import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/Users.models.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        // Verificar el token de Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Buscar o crear el usuario en base de datos
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                googleId: payload.sub,
                name: payload.name,
                email: payload.email,
                // Cualquier otra propiedad necesaria
            });
            await user.save();
        }

        // Crear un JWT usando el ID del usuario
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Ajusta el tiempo de expiración como desees
        });

        // Devolver el JWT al frontend
        res.json({ token: jwtToken });
    } catch (error) {
        res.status(401).json({ message: 'Google token verification failed' });
    }
};
