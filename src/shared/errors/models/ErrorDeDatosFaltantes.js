export function crearErrorDeDatosFaltantes(nombreDato) {
    const elError = new Error(`falta un valor para el campo obligatorio '${nombreDato}'`)
    elError.tipo = 'DATOS_FALTANTES'
    return elError
}
