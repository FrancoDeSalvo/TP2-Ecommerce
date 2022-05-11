import assert from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server.js'

import {
    getVentas, addVenta, deleteVentas, getVentaById, cancelVenta
} from '../src/ventas/ventas.js'

import {
    addToCarrito, deleteCarrito
} from '../src/carrito/carrito.js'

import {addProduct} from '../src/products/products.js'

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
    productName: 'Razer BlackWidow' ,
    description: 'Teclado mecancio con switches razer green y retroiluminación RGB',
    price: 30000, 
}

const product2 = {
    productName: 'Thermalteke Smart Bx1 750W' ,
    description: 'Fuente de alimentación ATX con iluminacion RBG y certificación 80 Plus Bronze',
    price: 25000, 
}

const product3 = {
    productName: 'NVIDIA RTX 3050' ,
    description: 'Placa De Video Gigabyte Rtx 3050 Gaming Oc 8gb windforce X3',
    price: 80000, 
}

const product4 = {
    productName: 'Intel Core I5-12600K' ,
    description: 'Procesador de 10 núcleos y 4.9GHz de frecuencia, con gráfica Intel UHD Graphics 770',
    price: 40000, 
}

/****************************************************************************************************/
describe('Servidor de pruebas: VENTAS', () => {

    let urlVentas;

    const p1 = addProduct(product1);
    const p2 = addProduct(product2);
    const p3 = addProduct(product3);
    const p4 = addProduct(product4);

    const products = [p1, p2, p3, p4];

    before(async ()=>{
        const port = await conectar()
        urlVentas = `http://localhost:${port}/api/ventas`
    })

    after(async ()=>{
        await desconectar();
    })

    beforeEach(() => {
        deleteVentas()
        deleteCarrito()
    })

    afterEach(() => {
        deleteVentas()
        deleteCarrito()
    })

    //-------------------------------------------------------------------------------------
    describe('el servidor esta escuchando', () => {

        describe('al pedirle las ventas', () => {
            it('devuelve un array con las ventas', async () => {
                const carrito = await addToCarrito(products)

                await addVenta(user1, carrito);

                const {data: ventasObtenidas, status} = await axios.get(urlVentas);
                assert.strictEqual(status, 200);

                const ventasActuales = getVentas();
                assert.deepStrictEqual(ventasObtenidas, ventasActuales);
            })
        })

        describe('al pedirle una venta especifica, segun su identificador', () => {
            it('la devuelve', async () => {
                const carrito = await addToCarrito(products)
                const ventaAgregada = await addVenta(user1, carrito)

                let ventaObtenida;
                const { data, status } = await axios.get(urlVentas + '/' + ventaAgregada.id)
                assert.strictEqual(status, 200)
                ventaObtenida = data;

                assert.deepStrictEqual(ventaObtenida, ventaAgregada)
            })
        })

        describe('al pedirle las ventas de un usuario en especifico, segun su nombre de usuario', () => {
            it('las devuelve', async () => {
                const carrito = await addToCarrito(products)
                await addVenta(user1, carrito)
                await addVenta(user2, carrito)

                let ventasObtenidas;
                const { data, status } = await axios.get(urlVentas, { params: { username: 'lautyMartin'} })
                assert.strictEqual(status, 200)
                ventasObtenidas = data;
                
                const todasLasVentas = getVentas();
                const ventasDelUsuario = todasLasVentas.filter(x => x.user.username.includes('lautyMartin'))
                assert.deepStrictEqual(ventasObtenidas, ventasDelUsuario)
            })
        })

        describe('al mandarle una nueva venta', () => {
            it('la agrega con las demas', async () => {
                const carrito = await addToCarrito(products)

                const nuevaVenta = {
                    user: user2,
                    carrito: carrito,
                    precio: carrito.totalPrice,
                    estado: 'REALIZADA'
                }

                const ventasAntes = getVentas();

                const {data: ventaAgregada, status} = await axios.post(urlVentas, nuevaVenta);
                assert.strictEqual(status, 201)

                const ventasAhora = getVentas();
                assert.strictEqual(ventasAntes.length + 1, ventasAhora.length);

                const ventaAgregadaEsperada = {id: ventaAgregada.id, ...nuevaVenta}
                assert.deepStrictEqual(ventasAhora, ventasAntes.concat(ventaAgregadaEsperada))
            })
        })

        describe('al pedirle que se cancele una venta, segun su ID', () => {
            it('se modifica su estado a "CANCELADO"', async () => {
                const carrito = await addToCarrito(products)
                const ventaAgregada = await addVenta(user1, carrito)

                const ventaCancelada = await cancelVenta(ventaAgregada.id);

                const { status } = await axios.put(urlVentas + '/cancel/' + ventaAgregada.id)
                assert.strictEqual(status, 200);

                const ventaBuscada = getVentaById(ventaAgregada.id)
                assert.deepStrictEqual(ventaBuscada, ventaCancelada)
            })
        })

        describe('al mandarle un nuevo producto, uno viejo y un identificador de la venta', () => {
            it('reemplaza el producto viejo por el nuevo y se cambia el estado por "CAMBIO"', async () => {

                const carrito = await addToCarrito(products)
                const ventaAgregada = await addVenta(user1, carrito)

                const productoNuevo = {
                    productName: 'Intel Core i9-12900K' ,
                    description: 'Procesador de 16 (8P+8E) núcleos y 5,2 GHz de frecuencia',
                    price: 85000, 
                }

                const productoViejo = product4;

                const datosActualizados = {np: productoNuevo, op: productoViejo}

                const { status, data } = await axios.put(urlVentas + '/change/' + ventaAgregada.id, datosActualizados)
                assert.strictEqual(status, 200)
                const nuevaVenta = data

                const ventaBuscada = getVentaById(ventaAgregada.id)
                assert.deepStrictEqual(ventaBuscada, nuevaVenta)
            })
        })

        /************************** TESTS CON ERROR ***************************************/
        describe('al mandarle una venta mal formateada', () => {
            it('no agrega nada y devuelve un error', async () => {

                const carrito = await addToCarrito(products)

                const nuevaVenta = {
                    user: user2,
                    carrito: carrito,
                }

                const ventasAntes = getVentas();

                await assert.rejects((async (error) => {
                    assert.strictEqual(error.response.status, 400)
                    return true
                })(
                    axios.post(urlVentas, nuevaVenta),
                )); 

                const ventasActuales = getVentas();
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
                const carrito = await addToCarrito(products)
                const ventaAgregada = await addVenta(user1, carrito)

                const productoViejo = p4;
                const productoNuevo = p4;

                const datosActualizados = {np: productoNuevo, op: productoViejo}

                await assert.rejects(
                    axios.put(urlVentas + '/change/' + ventaAgregada.id, datosActualizados),
                    error => {
                        assert.strictEqual(error.response.status, 400)
                        return true
                    }
                )
            })
        })

    })
})