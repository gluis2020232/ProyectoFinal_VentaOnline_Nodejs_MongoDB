const mongoose = require('mongoose');
const Carrito = require('../models/carrito.model');
const Usuario = require('../models/usuario.model');
const Producto = require('../models/productos.model');
const CarritoProducto = require('../models/carrito-producto.model');

function agregarCarrito (req, res) {
    const parametros = req.body; //Obtener todos lo parametros de postman body

    if( !parametros.clienteId) {
        return res.status(500).send({ mensaje: "Debe enviar los parámetros obligatorios."})
    }

    Usuario.findById(mongoose.Types.ObjectId(parametros.clienteId), (err, cliente) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (!cliente) return res.status(404).send({ mensaje: `Cliente '${parametros.clienteId}' no encontrado.`});

        const carrito = new Carrito();

        carrito.idCliente = cliente.id;
        carrito.total = 0;
        carrito.fecha = new Date();

        carrito.save((err, carritoGuardado) => {  //Almacenar a la base de datos
            //Verificaciones
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!carritoGuardado) return res.status(500).send({ mensaje: 'Error al agregar el carrito'}); //Si no trae nada
            //Verificaciones

            return res.status(200).send({ carritos: carritoGuardado});
        });
    });
}

function agregarCarritoProducto(req, res) {
    const parametros = req.body; //Obtener todos lo parametros de postman body

    if (!parametros.carritoId || !parametros.productoId || !parametros.cantidad) {
        return res.status(500).send({ mensaje: "Debe enviar los parámetros obligatorios."})
    }

    Carrito.findById(mongoose.Types.ObjectId(parametros.carritoId), (err, carrito) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (!carrito) return res.status(404).send({ mensaje: `Carrito '${parametros.carritoId}' no encontrado.`});

        Producto.findById(mongoose.Types.ObjectId(parametros.productoId), (err, producto) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if (!producto) return res.status(404).send({ mensaje: `Producto '${parametros.productoId}' no encontrado.`});

            CarritoProducto.findOne({ idCarrito: carrito.id, idProducto: producto.id }, (err, carritoProductoExistente) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});

                let carritoProducto = carritoProductoExistente;

                if (carritoProducto) {
                    carritoProducto.cantidad += parseFloat(parametros.cantidad) || 0;
                } else {
                    carritoProducto = new CarritoProducto();
                    carritoProducto.idCarrito = carrito.id;
                    carritoProducto.idProducto = producto.id;
                    carritoProducto.cantidad = parseFloat(parametros.cantidad) || 0;
                    carritoProducto.precio = parseFloat(producto.precio) || 0;
                }

                carritoProducto.subtotal = carritoProducto.cantidad * carritoProducto.precio;

                carritoProducto.save((err, carritoProductoGuardado) => {  //Almacenar a la base de datos
                    //Verificaciones
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                    if(!carritoProductoGuardado) return res.status(500).send({ mensaje: 'Error al agregar el producto al carrito'}); //Si no trae nada
                    //Verificaciones

                    // Actualizar el total del carrito
                    CarritoProducto.find({ idCarrito: carrito.id }, (err, carritoProductos) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});

                        carrito.total = 0;

                        for (let index = 0; index < carritoProductos.length; index++) {
                            carrito.total += carritoProductos[index].subtotal;
                        }

                        carrito.save((err, carritoGuardado) => {  //Almacenar a la base de datos
                            //Verificaciones
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                            if(!carritoGuardado) return res.status(500).send({ mensaje: 'Error al actualizar el total del carrito'}); //Si no trae nada
                            //Verificaciones

                            return res.status(200).send({ carritos: carritoProductoGuardado});
                        });
                    });
                });
            });
        });
    });
}

function eliminarCarritoProducto(req, res) {
    const parametros = req.body; //Obtener todos lo parametros de postman body

    if (!parametros.carritoId || !parametros.productoId) {
        return res.status(500).send({ mensaje: "Debe enviar los parámetros obligatorios."})
    }

    Carrito.findById(mongoose.Types.ObjectId(parametros.carritoId), (err, carrito) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (!carrito) return res.status(404).send({ mensaje: `Carrito '${parametros.carritoId}' no encontrado.`});

        Producto.findById(mongoose.Types.ObjectId(parametros.productoId), (err, producto) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if (!producto) return res.status(404).send({ mensaje: `Producto '${parametros.productoId}' no encontrado.`});

            CarritoProducto.findOne({ idCarrito: carrito.id, idProducto: producto.id }, (err, carritoProducto) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                if (!carritoProducto) return res.status(400).send({ mensaje: `El producto '${parametros.productoId}' no se encuentra en el carrito ${parametros.carritoId}.`});

                carritoProducto.remove((err) => {
                    if (err) return res.status(500).send({ mensaje: 'Error al eliminar el producto del carrito'});

                    // Actualizar el total del carrito
                    CarritoProducto.find({ idCarrito: carrito.id }, (err, carritoProductos) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});

                        carrito.total = 0;

                        for (let index = 0; index < carritoProductos.length; index++) {
                            carrito.total += carritoProductos[index].subtotal;
                        }

                        carrito.save((err, carritoGuardado) => {  //Almacenar a la base de datos
                            //Verificaciones
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                            if(!carritoGuardado) return res.status(500).send({ mensaje: 'Error al actualizar el total del carrito'}); //Si no trae nada
                            //Verificaciones

                            return res.status(200).send({ message: 'Producto eliminado correctamente del carrito' });
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    agregarCarrito,
    agregarCarritoProducto,
    eliminarCarritoProducto,
}