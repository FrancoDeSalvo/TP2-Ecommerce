import { 
    getCarritos, getCarritoById, getProductsById, addToCarrito, deleteProduct, deleteAllItemsFromCarrito
} from '../services/serviceCarrito.js'

//--------------------------------------------------------------------------------
export async function getById(req, res, next){
    try {
        const carrito = await getCarritoById(req.params.id)
        res.json(carrito)
    } catch (error) {
        next(error)
    }
}

export async function getProductsFromCarrito(req, res, next){
    try {
        const productos = await getProductsById(req.params.id); 
        res.json(productos)
    } catch (error) {
        next(error)
    }
}

export async function getAll(req, res, next){
    try {
        const c = await getCarritos()
        res.json(c)
    } catch (error) {
        next(error)
    }
}
export async function putNewProduct(req, res, next){
    try {
        const newProduct = req.body.np;
        const carrito = req.body.c;
        let carritoUpdated;
        if(newProduct){
            carritoUpdated = await addToCarrito(newProduct, carrito.idUser)
        }
        res.json(carritoUpdated)
    } catch (error) {
        next(error)
    }
}

export async function putRemoveProducts(req, res, next){
    try {
        const carrito = req.body.c;
        const productToDelete = req.body.dp;
        const amount = req.body.amount;
        let carritoUpdated = await deleteProduct(carrito, productToDelete, amount)
        
        res.json(carritoUpdated)
    } catch (error) {
        next(error)
    }
}

export async function deleteAllItems(req, res, next){
    try {
        await deleteAllItemsFromCarrito(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}