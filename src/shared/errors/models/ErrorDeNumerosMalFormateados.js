export function crearErrorDeNumerosMalFormateados(nombreDato) {
    const elError = new Error(`el campo numérico '${nombreDato}' no tiene un formato válido`)
    elError.tipo = 'FORMATO_NUMERICO_INVALIDO'
    return elError
}
