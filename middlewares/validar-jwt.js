
require('dotenv').config(); // Cargar las variables de entorno

const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    // Obtener el token del header
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    // Verificar que SECRET_JWT_SEED está definido
    if (!process.env.SECRET_JWT_SEED) {
        console.error('SECRET_JWT_SEED no está definido');
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }

    try {
        // Verificar el token
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

        // Agregar el uid y el name a la solicitud para su uso posterior
        req.uid = uid;
        req.name = name;

        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message); // Error detallado

        // Revisar el tipo de error para proporcionar más contexto
        let errorMsg = 'Token no válido';
        if (error.name === 'TokenExpiredError') {
            errorMsg = 'Token expirado';
        } else if (error.name === 'JsonWebTokenError') {
            errorMsg = 'Token inválido';
        } else if (error.name === 'NotBeforeError') {
            errorMsg = 'Token no activo aún';
        }

        return res.status(401).json({
            ok: false,
            msg: errorMsg
        });
    }
};

module.exports = {
    validarJWT
};
