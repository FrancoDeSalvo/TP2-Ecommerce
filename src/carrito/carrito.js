import {obtenerNuevoId} from '../shared/ids.js';

//--> Persistencia en la BD (se une con tabla 'users' a traves del ID del mismo)
const carritos = [];

//-----------------------------------------------------------------
function getAmountProducts(carrito){

    let amount = carrito.products.reduce((acum, p) => {
        if (!acum[p.productName]) {
            acum[p.productName] = 0
        }
        acum[p.productName]++
        return acum
    }, {})
    return amount;
}

function getTotalPrice(carrito){
    let acum = 0;
    if(carrito.products.length > 0){
        const precios = carrito.products.map(p => p.price);
        acum = precios.reduce((a,b) => a + b, 0)
    }
    return acum;
}

function copyCarrito(c) {
    return ({
        id: c.id, 
        idUser: c.idUser, 
        products: c.products, 
        totalPrice: c.totalPrice, 
        productsAmount: c.productsAmount
    })
}

function copyCarritos(c) {
    return c.map(copyCarrito)
}

//-----------------------------------------------------------------
function createCarrito(idUser){
    let carrito = {
        id: obtenerNuevoId('carrito'),
        idUser: idUser,
        products: [],
        totalPrice: 0, 
        productsAmount:{}
    } 
    
    return carrito;
}

function addCarrito(idUser){
    const carrito = createCarrito(idUser)
    carritos.push(carrito)
    return carrito;
}

//-----------------------------------------------------------------
export function addToCarrito(p, idUser){
    const encontrado = carritos.some(x => x.idUser === idUser)
    if(!encontrado){
        addCarrito(idUser)
    }
    const userCarrito = carritos.find(x => x.idUser === idUser)
    addProduct(p, userCarrito)
    return userCarrito;
}

export function getCarritos(){
    const c = copyCarritos(carritos);
    return c;
}

export function getCarritoById(id){
    const carrito = carritos.find(x => x.id === id)
    if(carrito){
        return copyCarrito(carrito)
    }
    else{
        throw new Error("ID INVALIDO")
    }
}

export function getCarritoByUserId(idUser){
    const carrito = carritos.find(x => x.idUser === idUser)
    if(carrito){
        return copyCarrito(carrito)
    }
    else{
        throw new Error("ID USER INVALIDO")
    }
}

export function deleteCarritos(){
    while(carritos.length > 0){
        carritos.pop();
    }
}

//--> METODOS PARA PRODUCTOS DEL CARRITO
function addProduct(p, carrito){
    const product = availableStock(p)
    carrito.products.push(product);
    updateCarrito(carrito)
}

function updateCarrito(carrito){
    carrito.totalPrice = getTotalPrice(carrito)
    carrito.productsAmount = getAmountProducts(carrito);
}

function availableStock(product){
    const stock = product.length > 1 ? product.some(p => p.stock > 0) : product.stock > 0
    if(stock){
        return product;
    }
    else{
        throw new Error("NO SE PUEDE AGREGAR POR FALTA DE STOCK")
    }
}

export function getProductsByUserId(idUser){
    const encontrado = carritos.find(x => x.idUser === idUser);
    return encontrado.products
}

export function deleteProduct(c, product) {
    const encontrado = carritos.find(x => x.id === c.id)
    const productos = encontrado.products.filter(p => p.productName === product.productName);
    if (!productos[0]) {
        throw new Error('PRODUCTO NO ENCONTRADO')
    } else {
        const productIndex = encontrado.products.findIndex(p => p.id === productos[0].id)
        c.products.splice(productIndex, 1)
        updateCarrito(c)
    }
    return c;
}

export function deleteAllItems(id){
    const c = carritos.find(x => x.id === id)
    while(c.products.length > 0){
        c.products.pop()
    }
    return c;
}

export function replaceProducts(userId, newProduct, oldProduct) {
    const carrito = carritos.find(x => x.idUser === userId)
    const productoViejoIndex = carrito.products.findIndex(p => p.id === oldProduct.id)
    carrito.products.splice(productoViejoIndex, 1)
    carrito.products.push(newProduct);
    carrito.totalPrice = getTotalPrice(carrito)
    return carrito;
}