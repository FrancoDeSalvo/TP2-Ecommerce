import {obtenerNuevoId} from '../reusable/ids.js';

const products = [];

function createProduct(p) {
    if (!p.productName){
        throw new Error('El campo NOMBRE es obligatorio')
    }
    if (!p.description){
        throw new Error('El campo DESCRIPCIÓN es obligatorio')
    }
    if (!p.price){
        throw new Error('El campo PRECIO es obligatorio')
    }

    let product = {
        id: obtenerNuevoId('product'),
        productName: p.productName,
        description: p.description,
        price: p.price, 
    }
    return product;
}   

export function addProduct(p){
    const product = createProduct(p);
    products.push(product);
    return product;
}

function copyProduct(p){
    return({
            id: p.id,
            productName: p.productName,
            description: p.description,
            price: p.price    
        })
}

function copyProducts(p){
    return p.map(copyProduct) 
}

export function getProducts(){
    return copyProducts(products)
}

export function getProductById(id){
    const p = products.find(p => p.id === id);
    if (p){
        return copyProduct(p)
    }
    else{
        throw new Error('PRODUCTO NO ENCONTRADO')
    }
}

export function getProductByName(name) {
    const p = products.filter(p => p.name === name)
    return copyProducts(p)
}

export function deleteProductById(id) {
    const productId = products.findIndex(p => p.id === id)
    if ( productId === -1) {
        throw new Error('PRODUCTO NO ENCONTRADO')
    } else {
        products.splice(productId, 1) // ??
    }
}

export function deleteProducts(){
    while(products.length > 0){
        products.pop();
    }
}

export function replaceProduct(id, productData) {
    const productId = products.findIndex(p => p.id === id)
    if (productId === -1) {
        throw new Error('PRODUCTO NO ENCONTRADO')
    } else {
        const product = createProduct(productData)
        product.id = id
        products[productId] = product
    }
}