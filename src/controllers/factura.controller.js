const mongoose = require('mongoose');
const Carrito = require('../models/carrito.model');
const Usuario = require('../models/usuario.model');
const CarritoProducto = require('../models/carrito-producto.model');
const Factura = require('../models/factura.model');
const FacturaProducto = require('../models/factura-producto.model');

function pasarCarritoAFactura(req, res) {
    const parametros = req.body; //Obtener todos lo parametros de postman body

    if (!parametros.carritoId) {
        return res.status(500).send({ mensaje: "Debe enviar los parámetros obligatorios."})
    }

    Carrito.findById(mongoose.Types.ObjectId(parametros.carritoId), (err, carrito) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (!carrito) return res.status(404).send({ mensaje: `Carrito '${parametros.carritoId}' no encontrado.`});

        Usuario.findById(carrito.idCliente, (err, cliente) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if (!cliente) return res.status(404).send({ mensaje: `Cliente '${carrito.idCliente.toString()}' no encontrado.`});

            CarritoProducto.find({ idCarrito: carrito.id }, (err, carritoProductos) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});

                const factura = new Factura();

                factura.idCliente = carrito.idCliente;
                factura.fecha = carrito.fecha;
                factura.total = carrito.total;

                factura.save((err, facturaGuardada) => {
                    //Verificaciones
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                    if(!facturaGuardada) return res.status(500).send({ mensaje: 'Error al guardar la factura'}); //Si no trae nada
                    //Verificaciones

                    let productosPromesas = [];

                    for (let index = 0; index < carritoProductos.length; index++) {
                        const facturaProducto = new FacturaProducto();

                        facturaProducto.idFactura = facturaGuardada.id;
                        facturaProducto.idProducto = carritoProductos[index].idProducto;
                        facturaProducto.cantidad = carritoProductos[index].cantidad;
                        facturaProducto.precio = carritoProductos[index].precio;
                        facturaProducto.total = carritoProductos[index].total;

                        productosPromesas.push(facturaProducto.save());
                    }

                    Promise.all(productosPromesas)
                    .then((facturaProductosGuardados) => {
                        return res.status(200).send({
                            clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
                            clienteNit: 'CF',   // Pendiente de implementar
                            clienteDireccion: 'Ciudad',  // Pendiente de implementar
                            fecha: factura.fecha.getDate() + '/' + factura.fecha.getMonth() + '/' + factura.fecha.getFullYear(),
                            total: factura.total,
                            productos: facturaProductosGuardados.map(facturaProducto => ({
                                producto: facturaProducto.idProducto,   // Pendiente de mostrar el nombre del producto
                                cantidad: facturaProducto.cantidad,
                                precio: facturaProducto.precio,
                                subtotal: facturaProducto.subtotal,
                            }))
                        });
                    })
                    .catch((error) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al crear las líneas de la factura'});
                    });
                });
            });
        });
    });
}


module.exports = {
    pasarCarritoAFactura,
}