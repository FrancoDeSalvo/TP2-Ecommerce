import { crearErrorRecursoNoEncontrado } from '../../shared/errors/models/ErrorRecursoNoEncontrado.js'

const ventas = [];

//-----------------------------------------------------------------
function copiarVenta(venta) {
    return ({
        id: venta.id,
        username: venta.username,
        idUser: venta.idUser,
        productosTotales: venta.productosTotales,
        precioTotal: venta.precioTotal,
        estado: venta.estado,
        productosCambiados: venta.productosCambiados,
        diferenciaAPagar: venta.diferenciaAPagar
    })
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
    const ventaUserId = ventas.find(x => x.idUser === id);
    if(ventaId){
        return copiarVenta(ventaId)
    }
    if(ventaUserId){
        return copiarVenta(ventaUserId)
    }
    else{
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

export function obtenerVentas(){
    return copiarVentas(ventas);
}

export function obtenerVentaPorNombreDeUsuario(nomUser) {
    const v = ventas.filter(v => v.username.includes(nomUser))
    return copiarVentas(v)
}

// export function obtenerIdDeUsuario(vId){
//     const venta = ventas.find(c => c.id === vId);
//     if(!venta){
//         throw crearErrorRecursoNoEncontrado('venta')
//     }
//     return venta.user.id;
// }

//-----------------------------------------------------------------
export function actualizarEstadoACancelado(id){
    const venta = ventas.find(x => x.id === id);
    if (!venta) {
        throw crearErrorRecursoNoEncontrado('venta')
    } 
    venta.estado = 'CANCELADO'
    return copiarVenta(venta)
}

export function actualizarEstadoACambio(id){
    const venta = ventas.find(x => x.id === id);
    if (!venta) {
        throw crearErrorRecursoNoEncontrado('venta')
    } 
    venta.estado = 'CAMBIO'
    return copiarVenta(venta)
}

export function actualizarDiferenciaAPagar(id, diferencia){
    const venta = ventas.find(x => x.id === id);
    if (!venta) {
        throw crearErrorRecursoNoEncontrado('venta')
    } 
    venta.diferenciaAPagar = diferencia
    return copiarVenta(venta)
}

export function actualizarProductosCambiados(id, productosTotalesViejos){
    const venta = ventas.find(x => x.id === id);
    if (!venta) {
        throw crearErrorRecursoNoEncontrado('venta')
    } 
    venta.productosCambiados = productosTotalesViejos
    return copiarVenta(venta)
}

export function actualizarProductosYPrecio(id, carrito){
    const venta = ventas.find(x => x.id === id);
    if (!venta) {
        throw crearErrorRecursoNoEncontrado('venta')
    } 
    venta.productosTotales = carrito.productsAmount;
    venta.precio = carrito.totalPrice;
    return copiarVenta(venta)
}

//-----------------------------------------------------------------
export function eliminarVentas(){
    while(ventas.length > 0){
        ventas.pop();
    }
}