export function crearErrorNombreUnico() {
    const elError = new Error('el nombre debe ser único')
    elError.tipo = 'NOMBRE_UNICO'
    return elError
}