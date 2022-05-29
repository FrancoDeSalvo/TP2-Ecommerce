import { createProduct } from '../models/Product.js'
// import {saveProduct, recoverProducts, recoverProductById, recoverProductByName, removeProductById, removeAllProducts } from './productsDaoMamoria.js'
import dao from '../database/productsDao.js'


export function addProduct(p){
    const product = createProduct(p);
    dao.saveProduct(product)
    return product;
}

export function getProducts(){
    return dao.recoverProducts()
}

export function getProductById(id){
     return dao.recoverProductById(id)
}

export function getProductByName(name) {
   dao.recoverProductByName(name)
}

export function deleteProductById(id) {
    dao.removeProductById(id)
}

export function deleteProducts(){
   dao.removeAllProducts()
}

export function replaceProduct(id, productData) {
        const product = createProduct(productData)
        product.id = id
        dao.saveProduct(product)
}

