const Productos = require('../models/productos.model');


function agregarProductos (req, res) {
    const parametros = req.body; //Obtener todos lo parametros de postman body
    const modeloProductos = new Productos();

    //if(req.user.rol == 'ADMIN')

    if( parametros.nombre) {
        modeloProductos.nombre = parametros.nombre;
        modeloProductos.proveedor = parametros.proveedor;
        modeloProductos.precio = parametros.precio;
        modeloProductos.idAdmin = req.user.sub; // El id del Admin viene en el token

        modeloProductos.save((err, productoGuardado) => {  //Almacenar a la base de datos

            //Verificaciones
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion '});
            if(!productoGuardado) return res.status(500).send({ mensaje: 'Error al agregar el producto'}); //Si no trae nada
            //Verificaciones

            return res.status(200).send({ productos: productoGuardado});
        })
    } else {
        return res.status(500).send({ mensaje: "Debe enviar los parámetros obligatorios."})
    }
}



module.exports = {
    agregarProductos
}