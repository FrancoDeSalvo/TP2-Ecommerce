export function crearErrorDebeSerMayor() {
    const elError = new Error('ERROR. EL PRECIO TOTAL DE LOS PRODUCTOS A CAMBIAR DEBE SER MAYOR')
    elError.tipo = 'ERROR_PRECIO_MAYOR'
    return elError
}