
//Si no es de rol ADMIN no lo dejo agregar
exports.verAdmin = function(req, res, next) {
    if(req.user.rol !== "ADMIN") return res.status(403).send({mensaje: "Solo puede agregar el Administrador"})
    
    next();
}

//Si no es de ROL_CLIENTE no lo dejo agregar
exports.verCliente = function(req, res, next) {
    if(req.user.rol !== "ROL_CLIENTE") return res.status(403).send({mensaje: "Solo puede agregar el Cliente"})
    
    next();
}