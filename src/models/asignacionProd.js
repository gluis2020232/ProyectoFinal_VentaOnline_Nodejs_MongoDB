const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const asignacionProdSchema = new Schema({
    idProducto: { type: Schema.Types.ObjectId, ref:'Productos' },
    idCliente: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('Asignaciones', asignacionProdSchema);