//  IMPORTACIONES
const express = require('express');
const controladorFactura = require('../controllers/factura.controller');

// MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')
//Para darle una funcionalidad al token siempre tenemos que tener el Middleware de autenticacion

//RUTAS
const api = express.Router();

api.get('/pasarCarritoAFactura', [md_autenticacion.Auth, md_roles.verAdmin], controladorFactura.pasarCarritoAFactura);

module.exports = api;