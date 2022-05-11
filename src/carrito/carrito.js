import {obtenerNuevoId} from '../reusable/ids.js';

let carrito = {};

function copyCarrito(carrito) {
    return ({
        id: carrito.id,
        products: carrito.products,
        totalPrice: carrito.totalPrice
    })
}

function createCarrito(p){
    let carrito = {
        id: obtenerNuevoId('carrito'),
        products: [p],
        totalPrice: getTotalPrice(p)
    } 
    
    return carrito;
}

function getTotalPrice(products){
    const precios = products.map(p => p.price);
    let acum = precios.reduce((a,b) => a + b, 0)
    return acum;
}

//-----------------------------------------------------------------
export function addToCarrito(p){
    const car = createCarrito(p);
    carrito = car;
    return carrito;
}

export function addProductToCarrito(product){
    carrito.products.push(product);
    return carrito;
}

export function getCarrito(){
    return copyCarrito(carrito)
}

export function getProductsByName(productName){
    return carrito.products.filter(x => x.productName.includes(productName))
}

export function deleteCarrito(){
    carrito = {};
}

export function deleteProductById(id) {
    const productId = carrito.products.findIndex(p => p.id === id)
    if (productId === -1) {
        throw new Error('PRODUCTO NO ENCONTRADO')
    } else {
        carrito.products.splice(productId, 1)
    }
}

export function replaceProducts(newProduct, oldProduct) {
    const productoViejoIndex = carrito.products.findIndex(p => p.id === oldProduct.id)
    carrito.products.splice(productoViejoIndex, 1)
    carrito.products.push(newProduct);
    carrito.totalPrice = getTotalPrice(carrito.products)
    return carrito;
}