export function crearErrorMismoNombreProductos() {
    const elError = new Error('ERROR. NO SE PUEDE CAMBIAR PRODUCTOS CON EL MISMO NOMBRE')
    elError.tipo = 'ERROR_PRODUCTOS_MISMO_NOMBRE'
    return elError
}