import assert, { doesNotThrow } from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server/server.js'

import {
    addToCarrito, deleteCarritos, getCarritos, getCarritoById, createCarrito
} from '../src/carrito/services/serviceCarrito.js'

import {addProduct} from '../src/products/services/products.js'

import {addUser} from '../src/users/services/users.js'

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

const p1 = {
    id: 1,
    productName: 'Razer BlackWidow' ,
    description: 'Teclado mecancio con switches razer green y retroiluminación RGB',
    price: 30000, 
    stock: 4,
}

const p2 = {
    id: 2,
    productName: 'Thermalteke Smart Bx1 750W' ,
    description: 'Fuente de alimentación ATX con iluminacion RBG y certificación 80 Plus Bronze',
    price: 25000, 
    stock: 3
}

const p3 = {
    id: 3,
    productName: 'NVIDIA RTX 3050' ,
    description: 'Placa De Video Gigabyte Rtx 3050 Gaming Oc 8gb windforce X3',
    price: 80000, 
    stock: 5
}

const p4 = {
    id: 4,
    productName: 'Intel Core I5-12600K' ,
    description: 'Procesador de 10 núcleos y 4.9GHz de frecuencia, con gráfica Intel UHD Graphics 770',
    price: 40000, 
    stock: 1
}

const product1 = await addProduct(p1);
const product2 = await addProduct(p2);
const product3 = await addProduct(p3);
const product4 = await addProduct(p4);

const u1 = await addUser(user1);
const u2 = await addUser(user2);

/****************************************************************************************************/
describe('Servidor de pruebas: CARRITO', async () => {

    let urlCarrito;

    before(async ()=>{
        const port = await conectar()
        urlCarrito = `http://localhost:${port}/api/carrito`
    })

    after(async ()=>{
        await desconectar();
    })

    beforeEach(async () => {
        await deleteCarritos()
    })

    afterEach(async() => {
        await deleteCarritos()
    })

    //-------------------------------------------------------------------------------------
    describe('el servidor esta escuchando', () => {

        describe('al pedirle los carritos', () => {
            it('lo devuelve', async () => {
                await createCarrito(u1.id);
                await createCarrito(u2.id);
                
                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product2, u1.id)
                await addToCarrito(product3, u1.id)

                await addToCarrito(product1, u2.id)
                await addToCarrito(product4, u2.id)

                const {data: carritosObtenidos, status} = await axios.get(urlCarrito);
                assert.strictEqual(status, 200);
                const carritosActuales = await getCarritos();
                assert.deepStrictEqual(carritosObtenidos, carritosActuales);
            })
        })

        describe('al pedirle un carrito especifico, segun su identificador', () => {
            it('lo devuelve', async () => {
                await createCarrito(u1.id);
                await createCarrito(u2.id);

                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product2, u1.id)
                await addToCarrito(product3, u1.id)

                await addToCarrito(product1, u2.id)
                await addToCarrito(product4, u2.id)

                const carrito2 = await getCarritoById(u2.id)

                const { data: carritoObtenido, status } = await axios.get(urlCarrito + '/' + carrito2.id)
                assert.strictEqual(status, 200)

                assert.deepStrictEqual(carritoObtenido, carrito2)
            })
        })

        describe('al pedirle productos de un carrito en especifico, segun el ID', () => {
            it('devuelve un array con los productos', async () => {
                await createCarrito(u2.id);

                await addToCarrito(product1, u2.id)
                await addToCarrito(product4, u2.id)

                const carrito = await getCarritoById(u2.id)

                const { data: productosObtenidos, status } = await axios.get(urlCarrito + '/productos/' + carrito.id)
                assert.strictEqual(status, 200)

                const carritoEncontrado = await getCarritoById(u2.id)
                const productsCarrito = carritoEncontrado.products
                assert.deepStrictEqual(productosObtenidos, productsCarrito)
            })
        })

        describe('al mandarle un nuevo producto', () => {
            it('lo agrega con los demas', async () => {
                await createCarrito(u1.id);
                
                await addToCarrito(product2, u1.id)
                await addToCarrito(product3, u1.id)
                const carrito = await getCarritoById(u1.id)
                
                assert.deepStrictEqual(carrito.products.length, 2)

                const p5 = {
                    productName: 'Intel Core i9-12900K' ,
                    description: 'Procesador de 16 (8P+8E) núcleos y 5,2 GHz de frecuencia',
                    price: 85000, 
                    stock: 1
                }

                const productoNuevo = await addProduct(p5);
                const nuevosDatos = {np: productoNuevo, c: carrito}

                const { status, data: carritoNuevo } = await axios.put(urlCarrito + '/agregarProducto', nuevosDatos)
                assert.strictEqual(status, 200)

                const encontrado = await getCarritoById(u1.id)

                assert.deepStrictEqual(carritoNuevo.products.length, 3)
                assert.deepStrictEqual(carritoNuevo, encontrado)
            })
        }) 

        describe('al pedirle que elimine un producto especifico y la cantidad', () => {
            it('se borra/n el/los mismo/s', async () => {
                await createCarrito(u1.id);
                
                await addToCarrito(product2, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)
                
                const carritoViejo = await getCarritoById(u1.id)

                assert.deepStrictEqual(carritoViejo.products.length, 5)

                const datos = {c: carritoViejo, dp: product1, amount: 3}

                const { status, data: carritoNuevo } = await axios.put(urlCarrito + '/remover/', datos)
                assert.strictEqual(status, 200);

                const encontrado = await getCarritoById(u1.id)

                assert.deepStrictEqual(carritoNuevo.products.length, 2)
                assert.deepStrictEqual(carritoNuevo, encontrado)
            })
        })

        describe('al pedirle que se borren todos los productos del carrito, segun su ID', () => {
            it('se eliminan y no se devuelve nada', async () => {
                await createCarrito(u2.id);

                await addToCarrito(product3, u2.id)
                await addToCarrito(product3, u2.id)

                const carrito = await getCarritoById(u2.id)

                assert.deepStrictEqual(carrito.products.length, 2)

                const { status } = await axios.delete(urlCarrito + '/' + carrito.id)
                assert.strictEqual(status, 204);

                const carritoSinProductos = await getCarritoById(carrito.id);

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
                    axios.get(urlCarrito + '/unIdDeClienteQueNoExiste'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al agregar un producto sin stock', () => {
            it('no se realiza la accion y lanza un error 400', async () => {
                await createCarrito(u1.id);
                
                const carrito = await addToCarrito(product1, u1.id)
                const productoSinStock = {
                    id: 5,
                    productName: 'Intel Core i9-12900K' ,
                    description: 'Procesador de 16 (8P+8E) núcleos y 5,2 GHz de frecuencia',
                    price: 85000, 
                    stock: 0
                }

                const nuevosDatos = {np: productoSinStock, c: carrito}

                await assert.rejects(
                    axios.put(urlCarrito + '/agregarProducto', nuevosDatos),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )

                const carritoDespues = await getCarritoById(carrito.id);

                assert.deepStrictEqual(carritoDespues.products.length, 1)
            })
        })

        describe('al pedirle que elimine un producto que no existe', () => {
            it('no se realiza la accion y lanza un error 400', async () => {
                await createCarrito(u1.id);
                
                await addToCarrito(product2, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product1, u1.id)

                const carrito = await getCarritoById(u1.id)
                
                assert.ok(carrito.products.length === 3)

                const nuevosDatos = {dp: null, c: carrito, amount: 1}

                await assert.rejects(
                    axios.put(urlCarrito + '/remover', nuevosDatos),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
                
                const carritoNuevo = await getCarritoById(u1.id)
                assert.ok(carritoNuevo.products.length === 3)
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

    })
})