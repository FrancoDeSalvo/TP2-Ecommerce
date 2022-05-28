export function crearErrorRecursoNoEncontrado(nombre) {
    const elError = new Error(`${nombre} no encontrado`)
    elError.tipo = 'NO_ENCONTRADO'
    return elError
}
