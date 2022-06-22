export function crearErrorCarritoIncorrecto(idUser) {
    const elError = new Error(`ERROR. EL CARRITO NO LE PERTENECE AL USER ${idUser}`)
    elError.tipo = 'ERROR_CARRITO_INCORRECTO'
    return elError
}