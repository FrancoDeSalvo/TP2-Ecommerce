//=======================
//ESTOS MIDDLEWARES SON DE PASAMANO (PODEMOS GUARDAR VARIABLES CON VALORES, MOSTRAR POR CONSOLA, ETC)

function notificacionFinal(req, res, next) {
    console.log('ultimo middleware: nadie contestó')
    next()
}

function rutaImportante(req, res, next) {
    console.log(`llegó una peticion a la url ${req.url}`)
    next()
}

function middlewareCargaDatoLoco(req, res, next) {
    console.log('dato loco: cargado')
    req.datoLoco = 22
    next()
}