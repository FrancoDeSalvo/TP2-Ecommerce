const ventas = [];

//-----------------------------------------------------------------
function copiarVenta(venta) {
    return ({id: venta.id, user: venta.user, productos: venta.productos, precio: venta.precio, estado: venta.estado})
}

function copiarVentas(u) {
    return u.map(copiarVenta)
}

//-----------------------------------------------------------------
export function guardarVenta(venta) {
    const indiceBuscado = ventas.findIndex(v => v.id === venta.id)
    if (indiceBuscado === -1) {
        ventas.push(venta)
    }
}

//-----------------------------------------------------------------
export function obtenerVentaPorId(id){
    const ventaId = ventas.find(x => x.id === id);
    const ventaUserId = ventas.find(x => x.user.id === id);
    if(ventaId){
        return copiarVenta(ventaId)
    }
    else if(ventaUserId){
        return copiarVenta(ventaUserId)
    }
    else{
        throw new Error("NO SE ENCONTRO DICHA VENTA (ID INVALIDO)")
    }
}

export function obtenerVentas(){
    return copiarVentas(ventas);
}

export function obtenerVentaPorNombreDeUsuario(nomUser) {
    const v = ventas.filter(v => v.user.username.includes(nomUser))
    return copiarVentas(v)
}

export function obtenerIdDeUsuario(vId){
    const venta = ventas.find(c => c.id === vId);
    return venta.user.id;
}

//-----------------------------------------------------------------
export function actualizarEstadoACancelado(id){
    const ventaId = ventas.findIndex(v => v.id === id);
    let venta = ventas[ventaId];
    if (ventaId === -1) {
        throw new Error('VENTA NO ENCONTRADA')
    } else {
        venta.estado = 'CANCELADO'
    }
    return copiarVenta(venta)
}

export function actualizarEstadoACambio(id){
    const ventaId = ventas.findIndex(v => v.id === id);
    let venta = ventas[ventaId];
    if (ventaId === -1) {
        throw new Error('VENTA NO ENCONTRADA')
    } else {
        venta.estado = 'CAMBIO'
    }
    return copiarVenta(venta)
}
export function actualizarCarritoYPrecio(id, carrito){
    const indexVenta = ventas.findIndex(v => v.id === id);
    let venta = ventas[indexVenta];
    if (indexVenta === -1) {
        throw new Error('VENTA NO ENCONTRADA')
    } else {
        venta.productos = carrito.products;
        venta.precio = carrito.totalPrice;
    }
    return copiarVenta(venta)
}

//-----------------------------------------------------------------
export function eliminarVentas(){
    while(ventas.length > 0){
        ventas.pop();
    }
}