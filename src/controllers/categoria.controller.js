const Categorias = require('../models/categoria.model');

function agregarCategoria (req, res) {
    const parametros = req.body; //Obtener todos lo parametros de postman body
    const modeloCategoria = new Categorias();

    //if(req.user.rol == 'ADMIN')

    if( parametros.nombreCategoria) {
        modeloCategoria.nombreCategoria = parametros.nombreCategoria;
        modeloCategoria.idProducto = req.user.sub; // El id de producto viene en el token
        modeloCategoria.idAdmin = req.user.sub; // El id del Admin viene en el token

        modeloCategoria.save((err, categoriaGuardado) => {  //Almacenar a la base de datos

            //Verificaciones
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion '});
            if(!categoriaGuardado) return res.status(500).send({ mensaje: 'Error al agregar la categoría'}); //Si no trae nada
            //Verificaciones

            return res.status(200).send({ productos: categoriaGuardado});
        })
    } else {
        return res.status(500).send({ mensaje: "Debe enviar los parámetros obligatorios."})
    }
}


function editarCategoria(req, res) {
    var idCateg = req.params.idCategoria; //Obtener el valor de la variable en ruta
    var parametros = req.body; //Obtener los los parámetros en el body

    Categorias.findByIdAndUpdate(idCateg, parametros, { new:true } ,(err, categoriaEditado)=>{
      
        //Verificaciones
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!categoriaEditado) return res.status(404)
            .send({ mensaje: 'Error al Editar la categoria' });
        //Verificaciones

        return res.status(200).send({ productos: categoriaEditado});
    })
}

function eliminarCategoria(req, res) {
    var idCateg = req.params.idCategoria; //Obtener el valor de la variable en ruta

    Categorias.findByIdAndDelete(idCateg, (err, categoriaEliminado)=>{

        //Verificaciones
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!categoriaEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar la categoria' })
        //Verificaciones

        return res.status(200).send({ producto: categoriaEliminado });
    })
}

function obtenerCategorias (req, res)  {
    Categorias.find({}, (err, categoriasEncontrados) => {
        
        return res.send({ categoria: categoriasEncontrados })
    })
}



module.exports = {
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategorias
}