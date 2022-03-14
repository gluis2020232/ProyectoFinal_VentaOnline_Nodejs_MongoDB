const mongoose = require('mongoose');
var Schema = mongoose.Schema; //Variable de esquema

//Crear variable
var carritoProductoSchema = Schema({
    idCarrito: { type: Schema.Types.ObjectId, ref: 'Carritos' }, //Referencia a model Productos
    idProducto: { type: Schema.Types.ObjectId, ref: 'Productos' }, //Referencia a model Productos
    cantidad: Number,
    precio: Number,
    subtotal: Number,
});

module.exports = mongoose.model('CarritoProductos', carritoProductoSchema);