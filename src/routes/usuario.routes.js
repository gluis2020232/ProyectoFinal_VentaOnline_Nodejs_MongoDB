const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');

// MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')
//Para darle una funcionalidad al token siempre tenemos que tener el Middleware de autenticacion

const api = express.Router();

api.post('/registrarCliente', usuarioControlador.Registrar);
api.post('/registrarAdmin', usuarioControlador.RegistrarAdmin);
api.post('/login', usuarioControlador.Login);

api.put('/editarUsuario/:idUsuario', [md_autenticacion.Auth, md_roles.verAdminEdit], usuarioControlador.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario', [md_autenticacion.Auth, md_roles.verAdminDelete], usuarioControlador.EliminarUsuario);

module.exports = api;
