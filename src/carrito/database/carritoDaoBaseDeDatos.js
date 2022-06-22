import { database } from '../../shared/databases/mongoDbClient.js';

import { crearErrorRecursoNoEncontrado } from '../../shared/errors/models/ErrorRecursoNoEncontrado.js'
import { crearErrorDePersistencia } from '../../shared/errors/models/ErrorDePersistencia.js';

//---------------------- CONFIGURACION DB -------------------------------------------
const carritos = database.collection('carritos'); 

//-----------------------------------------------------------------
export async function guardarCarrito(c) {
    try{
        await carritos.updateOne({ id: c.id }, { $set: c }, { upsert: true })
    }
    catch (error) {
        throw crearErrorDePersistencia()
    }
}

//-----------------------------------------------------------------
//--> Obtiene el carrito sea por ID del mismo o por el ID del usuario
export async function obtenerCarritosPorId(id){
    let idCarrito;
    let idUser;
    try{
        idCarrito = await carritos.findOne({ id }, { projection: { _id: 0 } })
        idUser = await carritos.findOne({ idUser: { $eq: id } }, { projection: { _id: 0 } })
        if (idCarrito) {
            return idCarrito
        } 
        if(idUser){
            return idUser
        }
    }
    catch (error) {
        throw crearErrorDePersistencia()
    }

    if (!idCarrito || !idUser) {
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

export async function obtenerCarritos(){
    try {
        return await carritos.find().project({ _id: 0 }).toArray();
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function obtenerProductosDelCarritoPorId(id){
    let encontrado; 
    try {
        encontrado = await carritos.findOne({ id } , { projection: { _id: 0 } })
        if(encontrado){
            return [... encontrado.products]
        }
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if (!encontrado) {
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

//-----------------------------------------------------------------
export async function actualizarCarrito(id){
    let encontrado;
    try {
        encontrado = await carritos.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await carritos.updateOne({ id: { $eq: encontrado.id } }, { $set: encontrado }, { upsert: true })
    } catch (error) {
        throw crearErrorDePersistencia()
    }
    
    if(!encontrado){
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

export async function actualizarPrecioTotal(id, precioTotal){
    let encontrado;
    try {
        encontrado = await carritos.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await carritos.updateOne({id: { $eq: encontrado.id } }, {$set:{totalPrice: precioTotal}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }
    if(!encontrado){
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

export async function actualizarCantidadProductosTotales(id, cantProductos){
    let encontrado;
    try {
        encontrado = await carritos.findOne({ id: { $eq: id } }, { projection: { _id: 0 } })
        await carritos.updateOne({id: { $eq: encontrado.id }}, {$set:{productsAmount: cantProductos}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }
    if(!encontrado){
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

export async function agregarAlCarrito(p, idUser){
    let encontrado;
    try {
        encontrado = await carritos.findOne({ idUser: { $eq: idUser } }, { projection: { _id: 0 } })
        await carritos.updateOne({id: { $eq: encontrado.id } }, {$push:{products: p}})
    } catch (error) {
        throw crearErrorDePersistencia()
    }
    if(!encontrado){
        throw crearErrorRecursoNoEncontrado('carrito')
    }        
}

//----------------------------------------------------------------
export async function eliminarCarritos(){
    try {
        await carritos.deleteMany({})
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function eliminarTodosLosItemsDelCarrito(id){
    let encontrado;
    try {
        encontrado = await carritos.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
        if (encontrado) {
            await carritos.updateOne({id: { $eq: encontrado.id }}, {$set:{products: []}})
        }
    } catch (error) {
        throw crearErrorDePersistencia()
    }
    if(!encontrado){
        throw crearErrorRecursoNoEncontrado('carrito')
    } 
}

export async function eliminarProducto(c, product){
    let encontrado;
    try {
        encontrado = await carritos.findOne({ id: { $eq: c.id } }, { projection: { _id: 0 } });
        await carritos.updateOne({ id: { $eq: c.id }, products: { $elemMatch: product }}, {$unset: { "products.$": "" }});
        await carritos.updateOne({idUser: { $eq: c.idUser }}, {$pull : {products : null}});
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if (!encontrado) {
        throw crearErrorRecursoNoEncontrado('carrito')
    }
}

