//  IMPORTACIONES
const express = require('express');
const controladorCategoria = require('../controllers/categoria.controller');

// MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')
//Para darle una funcionalidad al token siempre tenemos que tener el Middleware de autenticacion

//RUTAS
const api = express.Router();

api.get('/obtenerCategorias', [md_autenticacion.Auth, md_roles.verAdminVisua], controladorCategoria.obtenerCategorias);
api.post('/agregarCategoria', [md_autenticacion.Auth, md_roles.verAdmin], controladorCategoria.agregarCategoria);
api.put('/editarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.verAdminEdit], controladorCategoria.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.verAdminDelete], controladorCategoria.eliminarCategoria);

module.exports = api;