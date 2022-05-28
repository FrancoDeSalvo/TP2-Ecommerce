import assert, { doesNotThrow } from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server.js'

import {
    addToCarrito, deleteCarritos, getCarritos, getCarritoByUserId, getCarritoById
} from '../src/carrito/carrito.js'

// import {addProduct} from '../src/products/products.js'

import {addUser} from '../src/users/users.js'

/****************************************************************************************************/
const user1 = {
    username: 'lautyMartin',
    password: '1234',
    name: 'Lautaro',
    lastname: 'Martinez',
    dni: '40457821',
    phone: '1130278092',
    paymethod: 'paypal'
};

const user2 = {
    username: 'martugonzales',
    password: '12345',
    name: 'Martina',
    lastname: 'Gonzales',
    dni: '42457823',
    phone: '1130278000',
    paymethod: 'mastercard'
};

const product1 = {
    id: 1,
    productName: 'Razer BlackWidow' ,
    description: 'Teclado mecancio con switches razer green y retroiluminación RGB',
    price: 30000, 
    stock: 4,
}

const product2 = {
    id: 2,
    productName: 'Thermalteke Smart Bx1 750W' ,
    description: 'Fuente de alimentación ATX con iluminacion RBG y certificación 80 Plus Bronze',
    price: 25000, 
    stock: 3
}

const product3 = {
    id: 3,
    productName: 'NVIDIA RTX 3050' ,
    description: 'Placa De Video Gigabyte Rtx 3050 Gaming Oc 8gb windforce X3',
    price: 80000, 
    stock: 5
}

const product4 = {
    id: 4,
    productName: 'Intel Core I5-12600K' ,
    description: 'Procesador de 10 núcleos y 4.9GHz de frecuencia, con gráfica Intel UHD Graphics 770',
    price: 40000, 
    stock: 1
}

/****************************************************************************************************/
describe('Servidor de pruebas: CARRITO', () => {

    let urlCarrito;

    // const p1 = addProduct(product1);
    // const p2 = addProduct(product2);
    // const p3 = addProduct(product3);
    // const p4 = addProduct(product4);

    // const products = [p1, p2, p3, p4];

    const u1 = addUser(user1);
    const u2 = addUser(user2);

    before(async ()=>{
        const port = await conectar()
        urlCarrito = `http://localhost:${port}/api/carrito`
    })

    after(async ()=>{
        await desconectar();
    })

    beforeEach(() => {
        deleteCarritos()
    })

    afterEach(() => {
        deleteCarritos()
    })

    //-------------------------------------------------------------------------------------
    describe('el servidor esta escuchando', () => {

        describe('al pedirle los carritos', () => {
            it('lo devuelve', async () => {
                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product2, u1.id)
                await addToCarrito(product3, u1.id)

                await addToCarrito(product1, u2.id)
                await addToCarrito(product4, u2.id)

                const {data: carritosObtenidos, status} = await axios.get(urlCarrito);
                assert.strictEqual(status, 200);
                const carritosActuales = getCarritos();
                assert.deepStrictEqual(carritosObtenidos, carritosActuales);
            })
        })

        describe('al pedirle un carrito especifico, segun su identificador', () => {
            it('lo devuelve', async () => {
                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product2, u1.id)
                const carrito1 = await addToCarrito(product3, u1.id)

                await addToCarrito(product1, u2.id)
                await addToCarrito(product4, u2.id)

                const { data: carritoObtenido, status } = await axios.get(urlCarrito + '/' + carrito1.id)
                assert.strictEqual(status, 200)

                assert.deepStrictEqual(carritoObtenido, carrito1)
            })
        })

        describe('al pedirle productos de un carrito en especifico, segun el ID del cliente', () => {
            it('devuelve un array con los productos', async () => {
                await addToCarrito(product1, u2.id)
                await addToCarrito(product4, u2.id)

                const { data: productosObtenidos, status } = await axios.get(urlCarrito, 
                    { params: { idUser: u2.id } }
                )
                assert.strictEqual(status, 200)

                const carrito = getCarritoByUserId(u2.id)
                const productsCarrito = carrito.products
                assert.deepStrictEqual(productosObtenidos, productsCarrito)
            })
        })

        describe('al mandarle un nuevo producto', () => {
            it('lo agrega con los demas', async () => {
                await addToCarrito(product2, u1.id)
                const carrito = await addToCarrito(product3, u1.id)

                const productoNuevo = {
                    id: 5,
                    productName: 'Intel Core i9-12900K' ,
                    description: 'Procesador de 16 (8P+8E) núcleos y 5,2 GHz de frecuencia',
                    price: 85000, 
                    stock: 10
                }

                const nuevosDatos = {np: productoNuevo, c: carrito}

                const { status, data: carritoNuevo } = await axios.put(urlCarrito, nuevosDatos)
                assert.strictEqual(status, 200)

                const carritoBuscado = getCarritoById(carrito.id)
                assert.deepStrictEqual(carritoBuscado, carritoNuevo)
            })
        }) 

        describe('al pedirle que elimine un producto especifico', () => {
            it('se borra el mismo', async () => {
                await addToCarrito(product2, u1.id)
                await addToCarrito(product1, u1.id)
                const carritoViejo = await addToCarrito(product1, u1.id)
                
                assert.ok(carritoViejo.products.length === 3)

                const datos = {c: carritoViejo, dp: product1}

                const { status, data: carritoNuevo } = await axios.put(urlCarrito, datos)
                assert.strictEqual(status, 200);

                assert.ok(carritoNuevo.products.length === 2)
            })
        })

        describe('al pedirle que se borren todos los productos del carrito, segun su ID', () => {
            it('se eliminan y no se devuelve nada', async () => {
                await addToCarrito(product3, u2.id)
                const carrito = await addToCarrito(product3, u2.id)

                assert.ok(carrito.products.length > 0)

                const { status } = await axios.delete(urlCarrito + '/' + carrito.id)
                assert.strictEqual(status, 204);

                const carritoSinProductos = getCarritoById(carrito.id);

                assert.ok(carritoSinProductos.products.length === 0)
            })
        })

        /************************** TESTS CON ERROR ***************************************/
        describe('al pedirle un carrito que no existe', () => {
            it('lanza un error 404', async () => {
                await assert.rejects(
                    axios.get(urlCarrito + '/unIdQueNoExiste'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al pedirle un carrito que cuyo ID del cliente no existe', () => {
            it('lanza un error 404', async () => {                    
                await assert.rejects(
                    axios.get(urlCarrito, { params: { idUser: 'noExisteID' } }),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al agregar un producto sin stock', () => {
            it('no se realiza la accion y lanza un error 400', async () => {
                const carrito = await addToCarrito(product1, u1.id)
                const productoSinStock = {
                    id: 5,
                    productName: 'Intel Core i9-12900K' ,
                    description: 'Procesador de 16 (8P+8E) núcleos y 5,2 GHz de frecuencia',
                    price: 85000, 
                    stock: 0
                }

                const carritoAntes = getCarritoById(carrito.id);

                const nuevosDatos = {np: productoSinStock, c: carrito}

                await assert.rejects((async (error) => {
                    assert.strictEqual(error.response.status, 400)
                    return true
                })(
                    axios.put(urlCarrito, nuevosDatos),
                )); 

                const carritoDespues = getCarritoById(carrito.id);

                assert.deepStrictEqual(carritoDespues, carritoAntes)
            })
        })

        describe('al pedirle que se vacie un carrito cuyo no existe', () => {
            it('lanza un error 404', async () => {                    
                await assert.rejects(
                    axios.delete(urlCarrito + '/unIdQueNoExiste'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al pedirle que elimine un producto que no existe', () => {
            it('no se realiza la accion y lanza un error 400', async () => {
                await addToCarrito(product2, u1.id)
                await addToCarrito(product1, u1.id)
                const carritoViejo = await addToCarrito(product1, u1.id)
                
                assert.ok(carritoViejo.products.length === 3)

                const nuevosDatos = {dp: null, c: carritoViejo}

                await assert.rejects((async (error) => {
                    assert.strictEqual(error.response.status, 400)
                    return true
                })(
                    axios.put(urlCarrito, nuevosDatos),
                )); 
                
                const carritoNuevo = getCarritoById(carritoViejo.id)

                assert.ok(carritoNuevo.products.length === 3)
            })
        })

    })
})