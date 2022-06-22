import { database } from '../../shared/databases/mongoDbClient.js';

import { crearErrorRecursoNoEncontrado } from '../../shared/errors/models/ErrorRecursoNoEncontrado.js'
import { crearErrorDePersistencia } from '../../shared/errors/models/ErrorDePersistencia.js';

//---------------------- CONFIGURACION DB -------------------------------------------
const ventas = database.collection('ventas');

//-----------------------------------------------------------------
export async function guardarVenta(v) {
    try {
        await ventas.updateOne({ id: v.id }, { $set: v }, { upsert: true })
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

//-----------------------------------------------------------------
//--> Obtiene el carrito sea por ID del mismo o por el ID del usuario
export async function obtenerVentaPorId(id){
    let idVenta;
    let idUser;
    try{
        idVenta = await ventas.findOne({ id }, { projection: { _id: 0 } })
        idUser = await ventas.findOne({ idUser: { $eq: id } }, { projection: { _id: 0 } })
        if (idVenta) {
            return idVenta
        } 
        if(idUser){
            return idUser
        }
    }
    catch (error) {
        throw crearErrorDePersistencia()
    }

    if (!idVenta || !idUser) {
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

export async function obtenerVentas(){
    try {
        return await ventas.find().project({ _id: 0 }).toArray();
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function obtenerVentaPorNombreDeUsuario(nomUser) {
    let v;
    try {
        v = ventas.find({ username: { $all: [nomUser] } }).project({ _id: 0 }).toArray()
        if(v){
            return v;
        }
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if (!v) {
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

//-----------------------------------------------------------------
export async function actualizarEstadoACancelado(id){
    let encontrada;
    try {
        encontrada = await ventas.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await ventas.updateOne({id: { $eq: encontrada.id }}, {$set:{estado: 'CANCELADO'}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if(!encontrada){
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

export async function actualizarEstadoACambio(id){
    let encontrada;
    try {
        encontrada = await ventas.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await ventas.updateOne({id: { $eq: encontrada.id }}, {$set:{estado: 'CAMBIO'}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if(!encontrada){
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

export async function actualizarProductosCambiados(id, productosTotalesNuevos){
    let encontrada;
    try {
        encontrada = await ventas.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await ventas.updateOne({id: { $eq: encontrada.id }}, {$set:{productosCambiados: productosTotalesNuevos}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if(!encontrada){
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

export async function actualizarDiferenciaAPagar(id, diferenciaAPagar){
    let encontrada;
    try {
        encontrada = await ventas.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await ventas.updateOne({id: { $eq: encontrada.id }}, {$set:{diferenciaAPagar: diferenciaAPagar}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if(!encontrada){
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

export async function actualizarProductosYPrecio(id, carrito){
    let encontrada;
    try {
        encontrada = await ventas.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await ventas.updateOne({id: { $eq: encontrada.id }}, {$set:{productosTotales: carrito.productsAmount}})
        await ventas.updateOne({id: { $eq: encontrada.id }}, {$set:{precioTotal: carrito.totalPrice}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if (!encontrada) {
        throw crearErrorRecursoNoEncontrado('venta')
    }
}

//----------------------------------------------------------------
export async function eliminarVentas(){
    try {
        await ventas.deleteMany({})
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}