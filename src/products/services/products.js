import { createProduct } from '../models/Product.js'
// import {saveProduct, recoverProducts, recoverProductById, recoverProductByName, removeProductById, removeAllProducts } from './productsDaoMamoria.js'
import dao from '../database/productsDao.js'


export async function addProduct(p){
    const product = createProduct(p);
    await dao.saveProduct(product)
    return product;
}

export async function getProducts(){
    return await dao.recoverProducts()
}

export async function getProductById(id){
     return await dao.recoverProductById(id)
}

export async function getProductByName(name) {
   await dao.recoverProductByName(name)
}

export async function deleteProductById(id) {
    await dao.removeProductById(id)
}

export async function deleteProducts(){
   await dao.removeAllProducts()
}

export async function replaceProduct(id, productData) {
        const product = createProduct(productData)
        product.id = id
        await dao.saveProduct(product)
}

