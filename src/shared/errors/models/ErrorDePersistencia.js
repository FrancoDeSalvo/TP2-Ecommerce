export function crearErrorDePersistencia() {
    const errorDePersistencia = new Error('error de base de datos')
    errorDePersistencia.tipo = 'ERROR_PERSISTENCIA'
    return errorDePersistencia
}