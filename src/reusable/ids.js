//--> Esto genera IDs nuevos. Podemos usar un modulo de generacion de IDs.
export function obtenerNuevoId(seed = 'bla') {
    return `${Date.now()}-${seed}`;
}
