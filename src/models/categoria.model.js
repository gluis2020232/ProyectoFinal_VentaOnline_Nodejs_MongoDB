const mongoose = require('mongoose');
var Schema = mongoose.Schema; //Variable de esquema

//Crear variable
const categoriaSchema = new Schema({
    nombreCategoria: String,
    idProducto: { type: Schema.Types.ObjectId, ref: 'Productos' }, //Hace referencia a model Producto
    idAdmin: { type: Schema.Types.ObjectId, ref: 'Usuarios' } //Hace referencia a model Usuario
})

module.exports = mongoose.model('Categorias', categoriaSchema);