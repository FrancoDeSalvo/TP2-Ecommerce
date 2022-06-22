export async function getTotalAmountProducts(products){
    let amount = await products.reduce((acum, p) => {
        if (!acum[p.productName]) {
            acum[p.productName] = 0
        }
        acum[p.productName]++
        return acum
    }, {})
    return amount;
}

export async function getTotalPrice(products){
    let acum = 0;
    if(await products.length > 0){
        const precios = await products.map(p => p.price);
        acum = precios.reduce((a,b) => a + b, 0)
    }
    return acum;
}