//--> Persistencia en la BD (se une con tabla 'users' a traves del ID del mismo)
const carritos = [];

//-----------------------------------------------------------------
function obtenerCantidadTotalDeProductos(carrito){
    let amount = carrito.products.reduce((acum, p) => {
        if (!acum[p.productName]) {
            acum[p.productName] = 0
        }
        acum[p.productName]++
        return acum
    }, {})
    return amount;
}

function obtenerPrecioTotal(carrito){
    let acum = 0;
    if(carrito.products.length > 0){
        const precios = carrito.products.map(p => p.price);
        acum = precios.reduce((a,b) => a + b, 0)
    }
    return acum;
}

function copiarCarrito(c) {
    return ({id: c.id, idUser: c.idUser, products: c.products, totalPrice: c.totalPrice, productsAmount: c.productsAmount})
}

function copiarCarritos(c) {
    return c.map(copiarCarrito)
}

//-----------------------------------------------------------------
//--> GUARDA EL CARRITO EN CASO DE NO EXISTIR
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
    else if(userId){
        return copiarCarrito(userId)
    }
    else{
        throw new Error("ID INVALIDO")
    }
}

export function obtenerCarritos(){
    return copiarCarritos(carritos);
}

export function obtenerProductosPorIdUser(idUser){
    const encontrado = carritos.find(x => x.idUser === idUser);
    if(encontrado){
        return [... encontrado.products]
    }
    else{
        throw new Error("NO SE ENCONTRO EL CARRITO")
    }
}

//-----------------------------------------------------------------
export function actualizarCarrito(carrito){
    const encontradoIndex = carritos.findIndex(x => x.id === carrito.id)
    if(encontradoIndex === -1){
        throw new Error("NO SE ENCONTRO EL CARRITO")
    }
    else{
        carritos[encontradoIndex] = carrito;
    }
    return carritos[encontradoIndex];
}

export function actualizarPrecioTotal(carrito){
    const indexCarrito = carritos.findIndex(c => c.idUser === carrito.idUser)
    if(indexCarrito !== -1){
        carrito.totalPrice = obtenerPrecioTotal(carrito)
    }
}

export function actualizarCantidadProductosTotales(carrito){
    const indexCarrito = carritos.findIndex(c => c.idUser === carrito.idUser)
    if(indexCarrito !== -1){
        carrito.productsAmount = obtenerCantidadTotalDeProductos(carrito);
    }
}

export function agregarAlCarrito(p, idUser){
    const encontrado = carritos.find(x => x.idUser === idUser)
    if(encontrado){
        encontrado.products.push(p);
    }        
    else{
        throw new Error("NO SE ENCONTRO EL CARRITO")
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
    while(c.products.length > 0){
        c.products.pop()
    }
    return c;
}

export function eliminarProducto(c, product){
    const carrito = carritos.find(x => x.id === c.id);
    const productos = carrito.products.filter(p => p.productName === product.productName);
    const productIndex = carrito.products.findIndex(p => p.id === productos[0].id);
    if (!carrito) {
        throw new Error('CARRITO NO ENCONTRADO')
    }
    else if (productIndex === -1) {
        throw new Error('PRODUCTO NO ENCONTRADO')
    }
    else{
        c.products.splice(productIndex, 1)
    }
}

//--------------------------- OTROS --------------------------------------
export function stockDisponible(product){
    const stock = product.length > 1 ? product.some(p => p.stock > 0) : product.stock > 0
    if(stock){
        return product;
    }
    else{
        throw new Error("NO SE PUEDE AGREGAR POR FALTA DE STOCK")
    }
}