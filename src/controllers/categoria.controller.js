const Categorias = require('../models/categoria.model');
const Asignacion = require('../models/asignacionCateg.model');

function agregarCategoria (req, res) {
    const parametros = req.body; //Obtener todos lo parametros de postman body
    const modeloCategoria = new Categorias();

    if( parametros.nombreCategoria) {
        modeloCategoria.nombreCategoria = parametros.nombreCategoria;
        //modeloCategoria.idProducto = req.user.sub; // El id de producto viene en el token
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

        return res.status(200).send({ categoria: categoriaEliminado });
    })
}

function obtenerCategorias (req, res)  {
    Categorias.find({}, (err, categoriasEncontrados) => {
        
        return res.send({ categoria: categoriasEncontrados })
    })
}



function asignarCategoria(req, res){
    const parametros = req.body; //Pedir datos al usuario
    const clienteLogeado = req.user.sub; // El id

    if( parametros.nombreCategoria ){ //Parametro obligatorio
        //Verificar cuantas categorias tiene ese cliente
        Asignacion.find({ idProducto : clienteLogeado }).populate('idCategoria').exec((err, asignacionesEncontradas) => {
            if( asignacionesEncontradas.length >= 3 ) return res.status(400)
                .send({ mensaje: 'Ya se asigno al maximo de categorias, que son 3 categorias por Cliente.'});
            
            //Verificar si un cliente ya se encuetra asignado a una catego
            for (let i = 0; i < asignacionesEncontradas.length; i++) {
                if( asignacionesEncontradas[i].idCategoria.nombreCategoria == parametros.nombreCategoria) return res.status(400)
                    .send({ mensaje: 'Ya se encuentra asignado a esta categoria.' })
            }

            //Buscar la categoría
            Categorias.findOne( { nombreCategoria: parametros.nombreCategoria }, (err, categoriaEncontrado) =>{
                if(err) return res.status(400).send({ mensaje: 'Erorr en la peticion de obtener la categoría'});
                if(!categoriaEncontrado) return res.status(400).send({ mensaje: 'Error al obtener ña categoría'});
                //Guardarlo
                const modeloAsignacion = new Asignacion();
                modeloAsignacion.idCategoria = categoriaEncontrado._id;
                modeloAsignacion.idProducto = clienteLogeado;
                
                modeloAsignacion.save((err, asignacionCreada) => {
                    if(err) return res.status(400).send({ mensaje: 'Error en la peticion de agregar asignacion' });
                    if(!asignacionCreada) return res.status(400).send({ mensaje: 'Error al agregar asignacion'});

                    return res.status(200).send({ asignacion: asignacionCreada})
                })
            })

        })

    } else{
        return res.status(400).send({ mensaje: 'Debe enviar los parametros obligatorios.'});
    }
}



module.exports = {
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategorias,

    asignarCategoria
}