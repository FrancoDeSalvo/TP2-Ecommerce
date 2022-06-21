import { database } from '../../shared/databases/mongoDbClient.js';
import { crearErrorDePersistencia } from '../../shared/errors/models/ErrorDePersistencia.js';
import { crearErrorRecursoNoEncontrado } from '../../shared/errors/models/ErrorRecursoNoEncontrado.js'
const products = database.collection('products');

export async function saveProduct(product){
     try {
        await products.updateOne({ id: product.id }, { $set: product }, { upsert: true })
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function recoverProducts(){
    try {
        const productsArray = await products.find().project({ _id: 0 }).toArray();
        return productsArray
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function recoverProductById(id){
    let buscada
    try {
        buscada = await products.findOne({ id }, { projection: { _id: 0 } })
    } catch (error) {
        throw crearErrorDePersistencia()
    }
    if (!buscada) {
        throw crearErrorRecursoNoEncontrado('product')
    }
    return buscada
}

export async function recoverProductByName(name){
    try {
        return await carreras.find({ names: { $all: [name] } }).project({ _id: 0 }).toArray()
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function removeAllProducts(){
    try {
        await products.deleteMany({})
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}


export async function removeProductById(id){
    let result
    try {
        result = await products.deleteOne({ id })
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if (result.deletedCount === 0) {
        throw crearErrorRecursoNoEncontrado('product')
    }
}

