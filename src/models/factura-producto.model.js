const mongoose = require('mongoose');
var Schema = mongoose.Schema; //Variable de esquema

//Crear variable
var facturaProductoSchema = Schema({
    idFactura: { type: Schema.Types.ObjectId, ref: 'Facturas' }, //Referencia a model Facturas
    idProducto: { type: Schema.Types.ObjectId, ref: 'Productos' }, //Referencia a model Productos
    cantidad: Number,
    precio: Number,
    subtotal: Number,
});

module.exports = mongoose.model('FacturaProductos', facturaProductoSchema);