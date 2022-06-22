import { crearVenta } from '../models/crearVenta.js'
import dao from '../database/ventasDao.js'

import {deleteAllItemsFromCarrito, getCarritoById, replaceProducts} from '../../carrito/services/serviceCarrito.js'
import {getTotalAmountProducts, getTotalPrice} from '../../shared/codeReuse/codeReuse.js';

import { crearErrorMismoNombreProductos } from '../../shared/errors/models/ErrorMismoNombreProductos.js'
import { crearErrorCarritoIncorrecto } from '../../shared/errors/models/ErrorCarritoIncorrecto.js'
import { crearErrorDebeSerMayor } from '../../shared/errors/models/ErrorPrecioDebeSerMayor.js'

//-----------------------------------------------------------------
function verifySameId(idUser, idUserCarrito){
    if(idUserCarrito != idUser) {
        throw crearErrorCarritoIncorrecto(idUser)
    }
}

async function verifySameProductName(np, op){
    if(np.length > 1 || op.length > 1){
        for (let i = 0; i < np.length; i++) {
            const newP = np[i];
            for (let j = 0; j < op.length; j++) {
                const oldP = op[j];
                if(newP.productName === oldP.productName) {
                    throw crearErrorMismoNombreProductos();
                }
            }            
        }
    }
    else{
        if(np.productName === op.productName){
            throw crearErrorMismoNombreProductos();
        }
    }
}

async function verifyNewProductsCostsMore(np, op){
    const costoProductosNuevos = await getTotalPrice(np);
    const costoProductosViejos = await getTotalPrice(op);
    if(costoProductosViejos > costoProductosNuevos){
        throw crearErrorDebeSerMayor();
    }
    return costoProductosNuevos - costoProductosViejos;
}

//-----------------------------------------------------------------
export async function addVenta(user, carrito) {
    let venta = crearVenta(user, carrito)
    verifySameId(user.id, carrito.idUser);
    await dao.guardarVenta(venta)
    const ventaEncontrada = await dao.obtenerVentaPorId(venta.id);
    await deleteAllItemsFromCarrito(carrito.id)
    return ventaEncontrada
}

export async function getVentas() {
    return await dao.obtenerVentas();
}

export async function getVentaById(id){
    return await dao.obtenerVentaPorId(id);
}

export async function getVentaByUsername(username) {
    return await dao.obtenerVentaPorNombreDeUsuario(username);
}

//--> EN CASO DE QUE SE CANCELE LA VENTA
export async function cancelVenta(id) {
    return await dao.actualizarEstadoACancelado(id);
}

//--> EN CASO DE QUERER CAMBIAR UN PRODUCTO
export async function changeProduct(vId, np, op){
    await verifySameProductName(np, op)
    const diferenciaAPagar = await verifyNewProductsCostsMore(np, op)

    const venta = await dao.obtenerVentaPorId(vId);

    await replaceProducts(venta.idUser, np, op)
    
    const productosViejosTotales = await getTotalAmountProducts(op);
    const nuevoCarrito = await getCarritoById(venta.idUser)

    await dao.actualizarEstadoACambio(venta.id);
    await dao.actualizarProductosCambiados(venta.id, productosViejosTotales);
    await dao.actualizarDiferenciaAPagar(venta.id, diferenciaAPagar);
    await dao.actualizarProductosYPrecio(venta.id, nuevoCarrito)
    
    return await dao.obtenerVentaPorId(venta.id);
}

//-----------------------------------------------------------------
export async function deleteVentas(){
    await dao.eliminarVentas();
}