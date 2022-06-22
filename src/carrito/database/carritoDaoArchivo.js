import { crearErrorRecursoNoEncontrado } from '../../shared/errors/models/ErrorRecursoNoEncontrado.js'

const carritos = [];

//-----------------------------------------------------------------
function copiarCarrito(c) {
    return ({id: c.id, idUser: c.idUser, products: c.products, totalPrice: c.totalPrice, productsAmount: c.productsAmount})
}

function copiarCarritos(c) {
    return c.map(copiarCarrito)
}

//-----------------------------------------------------------------
export function guardarCarrito(carrito) {
    const indiceBuscado = carritos.findIndex(c => c.idUser === carrito.idUser)
    if (indiceBuscado === -1) {
        carritos.push(carrito)
    }
}

//--> Obtiene el carrito sea por ID del mismo o por el ID del usuario
export function obtenerCarritosPorId(id){
    const carritoId = carritos.find(x => x.id === id);
    const userId = carritos.find(x => x.idUser === id);
    if(carritoId){
        return copiarCarrito(carritoId)
    }
    if(userId){
        return copiarCarrito(userId)
    }
    else{
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

export function obtenerCarritos(){
    return copiarCarritos(carritos);
}

export function obtenerProductosDelCarritoPorId(id){
    const encontrado = carritos.find(x => x.id === id);
    if(encontrado){
        return [... encontrado.products]
    }
    else{
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

//-----------------------------------------------------------------
export function actualizarCarrito(id){
    const encontradoIndex = carritos.findIndex(x => x.id === id)
    if(encontradoIndex === -1){
        throw crearErrorRecursoNoEncontrado('carrito')
    }
    else{
        const encontrado = carritos.find(x => x.id === id)
        carritos[encontradoIndex] = encontrado;
    }
    return carritos[encontradoIndex];
}

export function actualizarPrecioTotal(id, precioTotal){
    const encontrado = carritos.find(x => x.id === id)
    if(encontrado){
        encontrado.totalPrice = precioTotal
    }
}

export function actualizarCantidadProductosTotales(id, cantProductos){
    const encontrado = carritos.find(x => x.id === id)
    if(encontrado){
        encontrado.productsAmount = cantProductos;
    }
}

export function agregarAlCarrito(p, idUser){
    const encontrado = carritos.find(x => x.idUser === idUser)
    if(encontrado){
        encontrado.products.push(p);
    }        
    else{
        throw crearErrorRecursoNoEncontrado('carrito')
    }
    return encontrado;
}

//----------------------------------------------------------------
export function eliminarCarritos(){
    while(carritos.length > 0){
        carritos.pop();
    }
}

export function eliminarTodosLosItemsDelCarrito(id){
    const c = carritos.find(x => x.id === id)
    if(!c){
        throw crearErrorRecursoNoEncontrado('carrito')
    }

    while(c.products.length > 0){
        c.products.pop()
    }
    return c;
}

export function eliminarProducto(c, product){
    const carrito = carritos.find(x => x.id === c.id);
    const productIndex = carrito.products.findIndex(p => p.id === product.id);
    carrito.products.splice(productIndex, 1)
    
    if (!carrito) {
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}