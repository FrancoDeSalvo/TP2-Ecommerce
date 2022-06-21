/**********************************[ PRODUCTOS ]**************************************************************/
import assert from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server/server.js'
import {getProducts, addProduct, deleteProducts, getProductById} from '../src/products/services/products.js'


const product1 = {
    productName: 'Razer BlackWidow' ,
    description: 'Teclado mecancio con switches razer green y retroiluminación RGB',
    price: 30000, 
    stock: 4,
}

const product2 = {
    productName: 'Thermalteke Smart Bx1 750W' ,
    description: 'Fuente de alimentación ATX con iluminacion RBG y certificación 80 Plus Bronze',
    price: 25000, 
    stock: 3,
}

const product3 = {
    productName: 'NVIDIA RTX 3050' ,
    description: 'Placa De Video Gigabyte Rtx 3050 Gaming Oc 8gb windforce X3',
    price: 80000, 
    stock: 5
}


describe('Servidor de pruebas: PRODUCTOS', () => {

    let urlProducts;

    before(async ()=>{
        const port = await conectar()
        urlProducts = `http://localhost:${port}/api/products`;
    })

    after(async ()=>{
        await desconectar();
    })

    beforeEach(() => {
        deleteProducts()
    })

    afterEach(() => {
        deleteProducts()
    })

    //-------------------------------------------------------------------------------------


    describe('el servidor esta escuchando', () => {

        describe('al pedirle los productos', () => {
            it('devuelve un array con productos', async () => {
                addProduct(product1);
                addProduct(product2);
                addProduct(product3);

                const {data: productsObtenidos, status} = await axios.get(urlProducts);
                assert.strictEqual(status, 200);
                const productosReales = await getProducts();
                assert.deepStrictEqual(productsObtenidos, productosReales);
            })
        })

    })

     describe('al mandarle un producto', () => {
        it('lo agrega con los existentes', async () => {
            const product4 = {
                productName: 'Intel Core I5-12600K' ,
                description: 'Procesador de 10 núcleos y 4.9GHz de frecuencia, con gráfica Intel UHD Graphics 770',
                price: 40000, 
                stock: 1
            }
            const productsAntes = await getProducts();

            const {data: productAgregado, status} = await axios.post(urlProducts, product4);
            assert.strictEqual(status, 201)

            const productsActual = await getProducts();
            assert.strictEqual(productsAntes.length + 1, productsActual.length);

            const productAgregadoEsperado = {id: productAgregado.id, ...product4}
            assert.deepStrictEqual(productsActual, productsAntes.concat(productAgregadoEsperado))
        })
    })
 

     describe('al pedirle un producto especifico, segun su identificador', () => {
        it('devuelve ese producto', async () => {

            const productAgregado1 = await addProduct(product1)

            let productObtenido;
            const { data, status } = await axios.get(urlProducts + '/' + productAgregado1.id)
            assert.strictEqual(status, 200)
            productObtenido = data;

            assert.deepStrictEqual(productObtenido, productAgregado1)
        })
    })
 

    describe('al pedirle que borre un producto especifico segun su ID', () => {
        it('se borra el mismo y no se devuelve nada', async () => {
            const productAgregado1 = await addProduct(product1);
            const { status } = await axios.delete(urlProducts + '/' + productAgregado1.id)
            assert.strictEqual(status, 204);

            const productsActuales = await getProducts();

            assert.ok(productsActuales.every(p => p.id !== productAgregado1.id))
        })
    })

    describe('al mandarle un producto valido y un Id', () => {
        it('reemplaza preexistente por uno nuevo', async () => {
            const productAgregado1 = await addProduct(product1)

            const nuevoProductName = 'Razer BlackWidow RGB'
            const datosActualizados = { ...productAgregado1, productName: nuevoProductName }

            const { status } = await axios.put(urlProducts + '/' + productAgregado1.id, datosActualizados)
            assert.strictEqual(status, 200)

            const productBuscado = await getProductById(productAgregado1.id)
            assert.deepStrictEqual(productBuscado, datosActualizados)
        })
    })


    /************************** TESTS CON ERROR ***************************************/
  

    describe('al pedir un producto que no existe', () => {
        it('lanza un error 404', async () => {
            await assert.rejects(
                axios.get(urlProducts + '/inexistente'),
                error => {
                    assert.strictEqual(error.response.status, 404)
                    return true
                }
            )
        })
    })

    describe('al eliminar un producto que no existe', () => {
        it('lanza un error 404', async () => {
            await assert.rejects(
                axios.delete(urlProducts + '/inexistente'),
                error => {
                    assert.strictEqual(error.response.status, 404)
                    return true
                }
            )
        })
    })

    describe('al mandarle un producto mal formateado', () => {
        it('no agrega nada y devuelve un error', async () => {
            const product = {
                productName: 'Intel Core I5-12600K' ,
                description: null,
                price: '' ,
            }
            const productsAntes = await getProducts();

            await assert.rejects((async (error) => {
                assert.strictEqual(error.response.status, 400)
                return true
            })(
                axios.post(urlProducts, product),
            )); 

            const productsActual = await getProducts();
            assert.deepStrictEqual(productsActual, productsAntes)
        })
    })
    
})