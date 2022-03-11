//  IMPORTACIONES
const express = require('express');
const controladorProducto = require('../controllers/productos.controller');

// MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')
//Para darle una funcionalidad al token siempre tenemos que tener el Middleware de autenticacion

//RUTAS
const api = express.Router();

//api.get('/productos', productosControlador.ObtenerProductos);
api.post('/agregarProductos', [md_autenticacion.Auth, md_roles.verAdmin], controladorProducto.agregarProductos);

module.exports = api;