const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function Registrar(req, res) {
    var parametros = req.body;

    if(!parametros.nombre || !parametros.apellido ||
        !parametros.email || !parametros.password) {
        return res.status(500).send({ mensaje: 'Parámetros inválidos' });
    }

    var usuarioModel = new Usuario();

    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.rol = 'ROL_CLIENTE';
    usuarioModel.imagen = null;

    Usuario.find({ email : parametros.email }, (err, usuarioEncontrado) => {
        if ( usuarioEncontrado.length == 0 ) {

            bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500)
                        .send({ mensaje: 'Error en la peticion' });
                    if(!usuarioGuardado) return res.status(500)
                        .send({ mensaje: 'Error al agregar el Usuario'});

                    return res.status(200).send({ usuario: usuarioGuardado });
                });
            });
        } else {
            return res.status(500)
                .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
        }
    })
}

function RegistrarAdmin(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();


    usuarioModel.nombre = 'ADMIN';
    usuarioModel.apellido = 'ADMIN';
    usuarioModel.email = 'ADMIN';
    usuarioModel.rol = 'ADMIN';
    usuarioModel.imagen = null;

    Usuario.find({ email : 'ADMIN' }, (err, usuarioEncontrado) => {
        if ( usuarioEncontrado.length == 0 ) {

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500)
                        .send({ mensaje: 'Error en la peticion' });
                    if(!usuarioGuardado) return res.status(500)
                        .send({ mensaje: 'Error al agregar el Usuario'});

                    return res.status(200).send({ usuario: usuarioGuardado });
                });
            });
        } else {
            return res.status(500)
                .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
        }
    })

}


function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if ( verificacionPassword ) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }


                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}


function EditarUsuario(req, res) {
    var idUser = req.params.idUsuario; //Obtener el valor de la variable en ruta
    var parametros = req.body; //Obtener los los parámetros en el body

    delete parametros.password;
    delete parametros.rol;

    Usuario.findByIdAndUpdate(idUser, parametros, { new:true } ,(err, usuarioActualizado) => {

        //Verificaciones
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioActualizado) return res.status(404)
            .send({ mensaje: 'Error al Editar el Usuario' });
        //Verificaciones

        return res.status(200).send({ usuario: usuarioActualizado});
    })
}


function EliminarUsuario(req, res) {
    var idProd = req.params.idUsuario; //Obtener el valor de la variable en ruta

    Usuario.findByIdAndDelete(idProd, (err, productoEliminado)=>{

        //Verificaciones
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!productoEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el Usuario' })
        //Verificaciones

        return res.status(200).send({ usuario: productoEliminado });
    })
}

module.exports = {
    Registrar,
    RegistrarAdmin,
    Login,
    EditarUsuario,
    EliminarUsuario
}