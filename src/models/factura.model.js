const mongoose = require('mongoose');
var Schema = mongoose.Schema; //Variable de esquema

//Crear variable
const facturasSchema = new Schema({
    idCliente: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    fecha: Date,
    total: Number,
    productos: [
        { type: Schema.Types.ObjectId, ref: 'FacturaProductos' }
    ],
})

module.exports = mongoose.model('Facturas', facturasSchema);