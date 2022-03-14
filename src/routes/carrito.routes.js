//  IMPORTACIONES
const express = require('express');
const controladorCarrito = require('../controllers/carrito.controller');

// MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')
//Para darle una funcionalidad al token siempre tenemos que tener el Middleware de autenticacion

//RUTAS
const api = express.Router();

api.post('/agregarCarrito', [md_autenticacion.Auth, md_roles.verCliente], controladorCarrito.agregarCarrito);
api.post('/agregarCarritoProducto', [md_autenticacion.Auth, md_roles.verCliente], controladorCarrito.agregarCarritoProducto);
api.delete('/eliminarCarritoProducto', [md_autenticacion.Auth, md_roles.verCliente], controladorCarrito.eliminarCarritoProducto);

module.exports = api;