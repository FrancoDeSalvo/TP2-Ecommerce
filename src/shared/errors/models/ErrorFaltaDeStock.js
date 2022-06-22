export function crearErrorNoHayStock() {
    const elError = new Error('No hay stock disponible')
    elError.tipo = 'NO_HAY_STOCK'
    return elError
}