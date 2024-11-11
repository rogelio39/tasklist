import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/Users.models.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        // Detectar si es un token JWT estándar o un token de Google
        if (req.headers.authorization.startsWith('Bearer')) {
            // Token JWT estándar
            token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                return next();
            } catch (error) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }
        } else if (req.headers.authorization.startsWith('Google')) {
            // Token de Google
            token = req.headers.authorization.split(' ')[1];
            try {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();

                // Buscar o crear usuario en base de datos
                let user = await User.findOne({ email: payload.email });
                if (!user) {
                    user = await User.create({
                        name: payload.name,
                        email: payload.email,
                        // Otras propiedades que necesites
                    });
                }

                req.user = user;
                return next();
            } catch (error) {
                return res.status(401).json({ message: 'Not authorized, Google token failed' });
            }
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
