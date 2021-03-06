export function manejadorDeErrores(error, req, res, next) {
    let statusCode = 500
    let errorMessage = 'error interno'

    switch (error.tipo) {
        case 'FORMATO_NUMERICO_INVALIDO':
        case 'DATOS_FALTANTES':
        case 'ERROR_CARRITO_INCORRECTO':
        case 'ERROR_PRODUCTOS_MISMO_NOMBRE':
        case 'ERROR_PRECIO_MAYOR':
            errorMessage = error.message
            statusCode = 400
            break
        case 'NO_ENCONTRADO':
        case 'NO_HAY_STOCK':
        case 'PRODUCTO_NULO':
            errorMessage = error.message
            statusCode = 404
            break
        case 'NOMBRE_UNICO':
            errorMessage = error.message
            statusCode = 409
            break
        case 'ERROR_PERSISTENCIA':
            errorMessage = error.message
    }
    res.status(statusCode).json({ errorMessage })
}