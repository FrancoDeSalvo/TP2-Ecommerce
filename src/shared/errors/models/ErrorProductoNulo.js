export function crearErrorProductoNulo() {
    const elError = new Error('ERROR. EL PRODUCTO NO DEBE SER NULO')
    elError.tipo = 'PRODUCTO_NULO'
    return elError
}