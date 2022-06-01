import { crearVenta } from '../models/crearVenta.js'
import dao from '../database/ventasDao.js'
import {getCarritoById, replaceProducts} from '../../carrito/services/carrito.js'

//-----------------------------------------------------------------
export function addVenta(user, carrito) {
    let venta;
    if(carrito.idUser !== user.id) {
        throw new Error (`ERROR. EL CARRITO NO LE PERTENECE AL USER ${user.id}`)
    }
    else{
        venta = crearVenta(user, carrito)
        dao.guardarVenta(venta)
    }
    return venta;
}

export function getVentas() {
    return dao.obtenerVentas();
}

export function getVentaById(id){
    return dao.obtenerVentaPorId(id);
}

export function getVentaByUsername(username) {
    return dao.obtenerVentaPorNombreDeUsuario(username);
}

//--> EN CASO DE QUE SE CANCELE LA VENTA
export function cancelVenta(id) {
    return dao.actualizarEstadoACancelado(id);
}

//--> EN CASO DE QUERER CAMBIAR UN PRODUCTO
export function changeProduct(vId, np, op){
    const venta = dao.obtenerVentaPorId(vId);
    if(np.productName === op.productName){
        throw new Error('ERROR. MISMO_NOMBRE')
    }

    const userId = dao.obtenerIdDeUsuario(venta.id)
    const nuevoCarrito = replaceProducts(userId, np, op)

    dao.actualizarEstadoACambio(venta.id);
    dao.actualizarCarritoYPrecio(venta.id, nuevoCarrito)
    
    return dao.obtenerVentaPorId(venta.id);
}

//-----------------------------------------------------------------
export function deleteVentas(){
    dao.eliminarVentas();
}