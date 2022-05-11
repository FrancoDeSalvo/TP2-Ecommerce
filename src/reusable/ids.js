//--> Esto genera IDs nuevos. Podemos usar un modulo de generacion de IDs.
export function obtenerNuevoId(seed = 'ecomerce') {
    return `${Date.now()}-${seed}`;
}
