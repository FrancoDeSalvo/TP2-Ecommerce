//--> Esto genera IDs nuevos. Podemos usar un modulo de generacion de IDs.
export function obtenerNuevoId(seed = 'ecommerce') {
    return `${getRandomNumber()}-${seed}`;
}

function getRandomNumber(){
    return Math.floor(Math.random() * 50);
}