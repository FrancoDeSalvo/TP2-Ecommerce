import assert from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server/server.js'

import {
    getVentas, addVenta, deleteVentas, getVentaById, cancelVenta
} from '../src/ventas/services/serviceVentas.js'

import {
    addToCarrito, deleteCarritos, getCarritoById, createCarrito
} from '../src/carrito/services/serviceCarrito.js'

import {addProduct} from '../src/products/services/products.js'

import {addUser} from '../src/users/services/users.js'

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
    productName: 'Razer BlackWidow' ,
    description: 'Teclado mecancio con switches razer green y retroiluminación RGB',
    price: 30000, 
    stock: 4,
}

const p2 = {
    productName: 'Thermalteke Smart Bx1 750W' ,
    description: 'Fuente de alimentación ATX con iluminacion RBG y certificación 80 Plus Bronze',
    price: 25000, 
    stock: 3
}

const p3 = {
    productName: 'NVIDIA RTX 3050' ,
    description: 'Placa De Video Gigabyte Rtx 3050 Gaming Oc 8gb windforce X3',
    price: 80000, 
    stock: 5
}

const p4 = {
    productName: 'Intel Core I5-12600K' ,
    description: 'Procesador de 10 núcleos y 4.9GHz de frecuencia, con gráfica Intel UHD Graphics 770',
    price: 40000, 
    stock: 1
}

/****************************************************************************************************/
describe('Servidor de pruebas: VENTAS', () => {

    let urlVentas;

    const product1 = addProduct(p1);
    const product2 = addProduct(p2);
    const product3 = addProduct(p3);
    const product4 = addProduct(p4);

    const u1 = addUser(user1);
    const u2 = addUser(user2);

    before(async ()=>{
        const port = await conectar()
        urlVentas = `http://localhost:${port}/api/ventas`
    })

    after(async ()=>{
        await desconectar();
    })

    beforeEach(() => {
        deleteVentas()
        deleteCarritos()
    })

    afterEach(() => {
        deleteVentas()
        deleteCarritos()
    })

    //-------------------------------------------------------------------------------------
    describe('el servidor esta escuchando', () => {

        describe('al pedirle las ventas', () => {
            it('devuelve un array con las ventas', async () => {
                await createCarrito(u1.id);
                await addToCarrito(product1, u1.id)
                await addToCarrito(product2, u1.id)
                await addToCarrito(product3, u1.id)

                const carrito = await getCarritoById(u1.id)

                await addVenta(u1, carrito);

                const {data: ventasObtenidas, status} = await axios.get(urlVentas);
                assert.strictEqual(status, 200);

                const ventasActuales = await getVentas();
                assert.deepStrictEqual(ventasObtenidas, ventasActuales);
            })
        })

        describe('al pedirle una venta especifica, segun su identificador', () => {
            it('la devuelve', async () => {
                await createCarrito(u1.id);
                await createCarrito(u2.id);

                await addToCarrito(product3, u2.id)
                const carrito2 = await getCarritoById(u2.id)
                await addVenta(u2, carrito2)

                await addToCarrito(product4, u1.id)
                await addToCarrito(product3, u1.id)
                await addToCarrito(product4, u1.id)
                const carrito1 = await getCarritoById(u1.id)
                await addVenta(u1, carrito1)

                const ventaAgregada = await getVentaById(u1.id);

                const { data: ventaObtenida, status } = await axios.get(urlVentas + '/' + ventaAgregada.id)
                assert.strictEqual(status, 200)

                assert.deepStrictEqual(ventaObtenida, ventaAgregada)
            })
        })

        describe('al pedirle las ventas de un usuario en especifico, segun su nombre de usuario', () => {
            it('las devuelve', async () => {
                await createCarrito(u1.id);
                await createCarrito(u2.id);

                await addToCarrito(product1, u1.id)
                await addToCarrito(product2, u1.id)
                const carrito1 = await getCarritoById(u1.id)
                await addVenta(u1, carrito1)

                await addToCarrito(product3, u2.id)
                const carrito2 = await getCarritoById(u2.id)
                await addVenta(u2, carrito2)

                await addToCarrito(product3, u1.id)
                await addToCarrito(product1, u1.id)
                await addToCarrito(product4, u1.id)
                const carrito3 = await getCarritoById(u1.id)
                await addVenta(u1, carrito3)

                const { data: ventasObtenidas, status } = await axios.get(urlVentas, 
                    { params: { username: 'lautyMartin'} }
                )
                assert.strictEqual(status, 200)
                
                const todasLasVentas = await getVentas();
                const ventasDelUsuario = await todasLasVentas.filter(x => x.username.includes('lautyMartin'))
                assert.deepStrictEqual(ventasObtenidas, ventasDelUsuario)
            })
        })

        describe('al mandarle una nueva venta', () => {
            it('la agrega con las demas', async () => {
                await createCarrito(u1.id);
                await createCarrito(u2.id);

                await addToCarrito(product1, u1.id)
                await addToCarrito(product2, u1.id)
                const carrito1 = await getCarritoById(u1.id) 
                await addVenta(u1, carrito1)

                const ventasAntes = await getVentas();

                await addToCarrito(product1, u2.id)                
                await addToCarrito(product2, u2.id)
                const c = await getCarritoById(u2.id)

                const nuevaVenta = {
                    user: u2,
                    carrito: c,
                }

                const {status} = await axios.post(urlVentas, nuevaVenta);
                assert.strictEqual(status, 201)

                const ventasAhora = await getVentas();
                assert.strictEqual(ventasAntes.length + 1, ventasAhora.length);
            })
        })

        describe('al pedirle que se cancele una venta, segun su ID', () => {
            it('se modifica su estado a "CANCELADO"', async () => {
                await createCarrito(u1.id);
                
                await addToCarrito(product4, u1.id)
                await addToCarrito(product2, u1.id)   
                const carrito = await getCarritoById(u1.id) 
                const venta = await addVenta(u1, carrito)

                await cancelVenta(venta.id);

                const ventaCancelada = await getVentaById(venta.id)

                const { status } = await axios.put(urlVentas + '/cancel/' + venta.id)
                assert.strictEqual(status, 200);

                const ventaBuscada = await getVentaById(u1.id)
                assert.deepStrictEqual(ventaBuscada, ventaCancelada)
            })
        })

        describe('al mandarle productos nuevos para cambiar y un identificador de la venta', () => {
            it('reemplazan los productos viejos por los nuevos y se cambia el estado por "CAMBIO"', async () => {
                await createCarrito(u1.id);
                
                await addToCarrito(product4, u1.id)
                await addToCarrito(product2, u1.id)    
                await addToCarrito(product3, u1.id)
                const carrito = await getCarritoById(u1.id) 
                await addVenta(u1, carrito)

                const ventaAgregada = await getVentaById(u1.id)

                const product5 = {
                    id: 5,
                    productName: 'Intel Core i9-12900K' ,
                    description: 'Procesador de 16 (8P+8E) núcleos y 5,2 GHz de frecuencia',
                    price: 85000, 
                    stock: 10
                }

                const productoNuevo = addProduct(product5);

                const datosActualizados = {np: [productoNuevo, product1], op: [product4, product2]}

                const { status, data: ventaObtenida } = await axios.put(urlVentas + '/change/' + ventaAgregada.id, datosActualizados)
                assert.strictEqual(status, 200)

                const ventaBuscada = await getVentaById(ventaAgregada.id)
                
                assert.deepStrictEqual(ventaObtenida, ventaBuscada)
            })
        })

        /************************** TESTS CON ERROR ***************************************/
        describe('al mandarle una venta mal formateada', () => {
            it('no agrega nada y devuelve un error', async () => {
                await createCarrito(u2.id);
                await addToCarrito(product4, u2.id)
                const nuevaVenta = {user: u2, carrito: null}

                const ventasAntes = await getVentas();

                await assert.rejects(
                    axios.post(urlVentas, nuevaVenta),
                    error => {
                        assert.strictEqual(error.response.status, 400)
                        return true
                    }
                )

                const ventasActuales = await getVentas();
                assert.deepStrictEqual(ventasActuales.length, ventasAntes.length)
            })
        })

        describe('al agregar un carrito con diferente id', () => {
            it('no se realiza la accion y lanza un error 400', async () => {
                await createCarrito(u1.id);
                await addToCarrito(product3, u1.id)
                const carritoUser1 = await getCarritoById(u1.id)

                const ventaAgregada = {user: u2, carrito: carritoUser1}

                const ventasAntes = await getVentas();

                await assert.rejects(
                    axios.post(urlVentas, ventaAgregada),
                    error => {
                        assert.strictEqual(error.response.status, 400)
                        return true
                    }
                )

                const ventasActuales = await getVentas();
                assert.deepStrictEqual(ventasActuales, ventasAntes)
            })
        })

        describe('al pedirle una venta que no existe', () => {
            it('lanza un error 404', async () => {
                await assert.rejects(
                    axios.get(urlVentas + '/idNoExistente'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al cambiarle el estado a una venta que no existe', () => {
            it('lanza un error 404', async () => {
                await assert.rejects(
                    axios.put(urlVentas + '/cancel/' + '/idNoExistente'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al querer cambiar un producto con el mismo nombre', () => {
            it('no se realiza el cambio y lanza un error 400', async () => {
                await createCarrito(u1.id);
                await addToCarrito(product3, u1.id)
                const carrito = await getCarritoById(u1.id)
                await addVenta(u1, carrito)

                const ventaAgregada = await getVentaById(u1.id)

                const productoViejo = product4;
                const productoNuevo = product4;

                const datosActualizados = {np: [productoNuevo, product1], op: [productoViejo]}

                const ventaAntes = await getVentaById(ventaAgregada.id)

                await assert.rejects(
                    axios.put(urlVentas + '/change/' + ventaAgregada.id, datosActualizados),
                    error => {
                        assert.strictEqual(error.response.status, 400)
                        return true
                    }
                )

                const ventaDespues = await getVentaById(ventaAgregada.id)
                assert.deepStrictEqual(ventaDespues, ventaAntes)
            })
        })
    })
})