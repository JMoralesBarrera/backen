const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

// Función para validar email
const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Función para manejar errores
const manejarErrores = (res, msg, status = 400) => {
    return res.status(status).json({
        ok: false,
        msg
    });
};

const crearUsuario = async (req, res = response) => {
    const { email, password, name } = req.body;

    // Validación de entradas
    if (!email || !password || !name) {
        return manejarErrores(res, 'Todos los campos son obligatorios');
    }

    if (!validarEmail(email)) {
        return manejarErrores(res, 'El email no es válido');
    }

    if (password.length < 6) {
        return manejarErrores(res, 'La contraseña debe tener al menos 6 caracteres');
    }

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return manejarErrores(res, 'El usuario ya existe');
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.error(error);
        return manejarErrores(res, 'Por favor hable con el Administrador', 500);
    }
};

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    // Validación de entradas
    if (!email || !password) {
        return manejarErrores(res, 'Todos los campos son obligatorios');
    }

    if (!validarEmail(email)) {
        return manejarErrores(res, 'El email no es válido');
    }

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return manejarErrores(res, 'El usuario no existe con ese email');
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return manejarErrores(res, 'Password incorrecto');
        }

        // Generar nuestro JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.error(error);
        return manejarErrores(res, 'Por favor hable con el Administrador', 500);
    }
};

const revalidarToken = async (req, res = response) => {
    const {uid, name} = req;

    // Generar un nuevo JWT y retornarlo en esta petición


    const token = await generarJWT(uid, name); // Asegúrate de que `generarJWT` esté bien implementado

    res.json({
        ok: true,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};
