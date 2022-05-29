import {obtenerNuevoId} from '../shared/id/ids.js';
import {replaceProducts} from '../carrito/carrito.js'

const ventas = [];

function copyVenta(venta) {
    return ({
        id: venta.id,
        user: venta.user,
        carrito: venta.carrito,
        precio: venta.precio,
        estado: venta.estado
    })
}

function copyVentas(u) {
    return u.map(copyVenta)
}

/****************************************************************************/
function createVenta(u, c) {

    if(!u){
        throw new Error('USUARIO NO DEBE SER NULO')
    }
    if (!c){
        throw new Error('CARRITO NO DEBE SER NULO')
    }
  
    let venta = {
        id: obtenerNuevoId('venta'),
        user: u,
        carrito: c,
        precio: c.totalPrice,
        estado: 'REALIZADA'
    }

    return venta;
}

export function addVenta(user, carrito) {
    let venta;
    if(carrito.idUser === user.id) {
        venta = createVenta(user, carrito)
        ventas.push(venta)
    }
    else{
        throw new Error (`ERROR. EL CARRITO NO LE PERTENECE AL USER ${user.id}`)
    }
    return venta;
}

export function getVentas() {
    return copyVentas(ventas)
}

export function getVentaById(id){
    const venta = ventas.find(v => v.id === id);
    if (venta){
        return copyVenta(venta)
    }
    else{
        throw new Error('VENTA NO ENCONTRADA')
    }
}

export function getVentaByUsername(username) {
    const v = ventas.filter(v => v.user.username.includes(username))
    return copyVentas(v)
}

//--> EN CASO DE QUE SE CANCELE LA VENTA
export function cancelVenta(id) {
    const ventaId = ventas.findIndex(v => v.id === id)
    if (ventaId === -1) {
        throw new Error('VENTA NO ENCONTRADA')
    } else {
        ventas[ventaId].estado = 'CANCELADO'
    }
    return copyVenta(ventas[ventaId])
}

//--> EN CASO DE QUERER CAMBIAR UN PRODUCTO
export function changeProduct(vId, np, op){
    const ventaId = ventas.findIndex(v => v.id === vId)
    if (ventaId === -1) {
        throw new Error('VENTA NO ENCONTRADA')
    } 
    if(np.productName === op.productName){
        throw new Error('ERROR. MISMO_NOMBRE')
    }

    const userId = ventas[ventaId].user.id;
    const nuevoCarrito = replaceProducts(userId, np, op)
    ventas[ventaId].id = vId
    ventas[ventaId].carrito = nuevoCarrito

    ventas[ventaId].estado = 'CAMBIO'
    ventas[ventaId].precio = nuevoCarrito.totalPrice;
    
    return copyVenta(ventas[ventaId])
}

/********************************/
export function deleteVentas(){
    while(ventas.length > 0){
        ventas.pop();
    }
}