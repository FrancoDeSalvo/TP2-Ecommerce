const products = [];

export async function saveProduct(product){
    const productId = products.findIndex(p => p.id === product.id)
    if (productId === -1) {
        products.push(product)
    } else {
        products[productId] = product
    }
}

export async function recoverProducts(){
    return copyProducts(products)
}

export async function recoverProductById(id){
    const p = products.find(p => p.id === id);
    if (p){
        return copyProduct(p)
    }
    else{
        throw new Error('PRODUCTO NO ENCONTRADO')
    }
}

export async function recoverProductByName(name){
    return copyProducts(products.filter(p => p.name === name))
}

export async function removeAllProducts(){
    while(products.length > 0){
        products.pop();
    }
}

export async function removeProductById(id){
    const productId = products.findIndex(p => p.id === id)
    if ( productId === -1) {
        throw new Error('PRODUCTO NO ENCONTRADO')
    } else {
        products.splice(productId, 1) 
    }
}

function copyProduct(p){
    return({
            id: p.id,
            productName: p.productName,
            description: p.description,
            price: p.price,
            stock: p.stock 
        })
}

function copyProducts(p){
    return p.map(copyProduct) 
}
