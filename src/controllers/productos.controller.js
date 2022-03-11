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


function editarProducto(req, res) {
    var idProd = req.params.idProducto; //Obtener el valor de la variable en ruta
    var parametros = req.body; //Obtener los los parámetros en el body

    Productos.findByIdAndUpdate(idProd, parametros, { new:true } ,(err, productoEditado)=>{
      
        //Verificaciones
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!productoEditado) return res.status(404)
            .send({ mensaje: 'Error al Editar el Producto' });
        //Verificaciones

        return res.status(200).send({ productos: productoEditado});
    })
}


function eliminarProducto(req, res) {
    var idProd = req.params.idProducto; //Obtener el valor de la variable en ruta

    Productos.findByIdAndDelete(idProd, (err, productoEliminado)=>{

        //Verificaciones
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!productoEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el producto' })
        //Verificaciones

        return res.status(200).send({ producto: productoEliminado });
    })
}

function obtenerProductos (req, res)  {
    Productos.find({}, (err, productosEncontrados) => {
        
        return res.send({ productos: productosEncontrados })
    })
}


module.exports = {
    agregarProductos,
    editarProducto,
    eliminarProducto,
    obtenerProductos
}