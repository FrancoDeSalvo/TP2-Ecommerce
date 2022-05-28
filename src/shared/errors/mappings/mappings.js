export function prepararRespuestaConError(error) {

    const httpError = {}

    switch (error.tipo) {
        case 'FORMATO_NUMERICO_INVALIDO':
        case 'DATOS_FALTANTES':
            httpError.mensaje = error.message
            httpError.codigo = 400
            break
        case 'NO_ENCONTRADO':
            httpError.mensaje = error.message
            httpError.codigo = 404
            break
        default:
            httpError.mensaje = 'error interno'
            httpError.codigo = 500
    }

    return httpError
}