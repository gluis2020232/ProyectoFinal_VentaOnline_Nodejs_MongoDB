const mongoose = require('mongoose');
var Schema = mongoose.Schema; //Variable de esquema

//Crear variable
const carritoSchema = new Schema({
    idCliente: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    fecha: Date,
    total: Number,
    productos: [
        { type: Schema.Types.ObjectId, ref: 'CarritoProductos' }
    ],
})

module.exports = mongoose.model('Carritos', carritoSchema);