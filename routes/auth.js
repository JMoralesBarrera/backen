/**
 * Rutas de usuarios Auth
 * host + /api/auth
 * 
 */

const { Router } = require('express');
const router = Router();
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas
router.post('/new',
    // Middlewares de validación usando express-validator
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
        validarCampos // Middleware para validar los campos
    ],
    crearUsuario // Controlador para crear un nuevo usuario
);

router.post('/',
    // Middlewares de validación usando express-validator
    [
        check('email', 'El email no es válido').isEmail(),
        check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
        validarCampos // Middleware para validar los campos
    ],
    loginUsuario // Controlador para iniciar sesión de usuario
);

router.get('/renew', validarJWT, revalidarToken); // Ruta para renovar el token JWT

module.exports = router; 
