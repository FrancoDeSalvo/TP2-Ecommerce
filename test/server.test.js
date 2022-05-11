import assert from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server.js'
import {getUsers, addUser, deleteUsers, getUsersById} from '../src/users/users.js'
import {getProducts, addProduct, deleteProducts, getProductById} from '../src/products/products.js'

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

const user3 = {
        username: 'jonjey',
        password: '1543',
        name: 'Jon',
        lastname: 'Jeysenger',
        dni: '40403050',
        phone: '1120304050',
        paymethod: 'american express'
    };

/****************************************************************************************************/
describe('Servidor de pruebas', () => {

    let urlUsers;

    before(async ()=>{
        const port = await conectar()
        urlUsers = `http://localhost:${port}/api/users`
    })

    after(async ()=>{
        await desconectar();
    })

    beforeEach(() => {
        deleteUsers()
    })

    afterEach(() => {
        deleteUsers()
    })

    //-------------------------------------------------------------------------------------
    describe('el servidor esta escuchando', () => {

        describe('al pedirle los usuarios', () => {
            it('devuelve un array con usuarios', async () => {
                await addUser(user1);
                await addUser(user2);
                await addUser(user3);

                const {data: usersObtenidos, status} = await axios.get(urlUsers);
                assert.strictEqual(status, 200);
                const usersReales = getUsers();
                assert.deepStrictEqual(usersObtenidos, usersReales);
            })
        })

        describe('al mandarle un usuario', () => {
            it('la agrega con las existentes', async () => {
                const user4 = {
                    username: 'jaimitoElCrack',
                    password: '5648',
                    name: 'Jaime',
                    lastname: 'Gimenez',
                    dni: '41235689',
                    phone: '1156478912',
                    paymethod: 'mastercard',
                }
                const usersAntes = getUsers();

                const {data: userAgregado, status} = await axios.post(urlUsers, user4);
                assert.strictEqual(status, 201)

                const usersActual = getUsers();
                assert.strictEqual(usersAntes.length + 1, usersActual.length);

                const userAgregadoEsperado = {id: userAgregado.id, ...user4}
                assert.deepStrictEqual(usersActual, usersAntes.concat(userAgregadoEsperado))
            })
        })

        describe('al pedirle un usuario especifico, segun su identificador', () => {
            it('devuelve ese usuario', async () => {

                const userAgregado1 = await addUser(user1)

                let userObtenido;
                const { data, status } = await axios.get(urlUsers + '/' + userAgregado1.id)
                assert.strictEqual(status, 200)
                userObtenido = data;

                assert.deepStrictEqual(userObtenido, userAgregado1)
            })
        })

        describe('al pedirle que borre un usuario especifica segun su ID', () => {
            it('se borra el mismo y no se devuelve nada', async () => {
                const userAgregado1 = await addUser(user1);
                const { status } = await axios.delete(urlUsers + '/' + userAgregado1.id)
                assert.strictEqual(status, 204);

                const usersActuales = getUsers();

                assert.ok(usersActuales.every(u => u.id !== userAgregado1.id))
            })
        })

        describe('al mandarle un usuario valido y un identificador de usuario', () => {
            it('reemplaza preexistente por nuevo', async () => {
                const userAgregado1 = await addUser(user1)

                const nuevoUsername = 'LauMartinez99'
                const datosActualizados = { ...userAgregado1, username: nuevoUsername }

                const { status } = await axios.put(urlUsers + '/' + userAgregado1.id, datosActualizados)
                assert.strictEqual(status, 200)

                const userBuscado = getUsersById(userAgregado1.id)
                assert.deepStrictEqual(userBuscado, datosActualizados)
            })
        })

        /************************** TESTS CON ERROR ***************************************/
        describe('al mandarle un usuario mal formateado', () => {
            it('no agrega nada y devuelve un error', async () => {
                const user = {
                    username: 'jaimitoElCrack',
                    password: '5648',
                    name: 'Jaime',
                    lastname: 'Gimenez',
                    dni: '41235689',
                    phone: '1156478912',
                    paymethod: 'mastercard',
                }
                const usersAntes = getUsers();

                await assert.rejects((async (error) => {
                    assert.strictEqual(error.response.status, 400)
                    return true
                })(
                    axios.post(urlUsers, user),
                )); 

                const usersActual = getUsers();
                assert.deepStrictEqual(usersActual, usersAntes)
            })
        })

        describe('al pedirle un usuario que no existe', () => {
            it('lanza un error 404', async () => {
                await assert.rejects(
                    axios.get(urlUsers + '/unIdQueNoExiste'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al eliminar un usuario que no existe', () => {
            it('lanza un error 404', async () => {
                await assert.rejects(
                    axios.delete(urlUsers + '/unIdQueNoExiste'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

    })
})




/**********************************[ PRODUCTOS ]**************************************************************/

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
                const productosReales = getProducts();
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
            }
            const productsAntes = getProducts();

            const {data: productAgregado, status} = await axios.post(urlProducts, product4);
            assert.strictEqual(status, 201)

            const productsActual = getProducts();
            assert.strictEqual(productsAntes.length + 1, productsActual.length);

            const productAgregadoEsperado = {id: productAgregado.id, ...product4}
            assert.deepStrictEqual(productsActual, productsAntes.concat(productAgregadoEsperado))
        })
    })
 

     describe('al pedirle un producto especifico, segun su identificador', () => {
        it('devuelve ese producto', async () => {

            const productAgregado1 = addProduct(product1)

            let productObtenido;
            const { data, status } = await axios.get(urlProducts + '/' + productAgregado1.id)
            assert.strictEqual(status, 200)
            productObtenido = data;

            assert.deepStrictEqual(productObtenido, productAgregado1)
        })
    })
 

    describe('al pedirle que borre un producto especifico segun su ID', () => {
        it('se borra el mismo y no se devuelve nada', async () => {
            const productAgregado1 = addProduct(product1);
            const { status } = await axios.delete(urlProducts + '/' + productAgregado1.id)
            assert.strictEqual(status, 204);

            const productsActuales = getProducts();

            assert.ok(productsActuales.every(p => p.id !== productAgregado1.id))
        })
    })

    describe('al mandarle un producto valido y un Id', () => {
        it('reemplaza preexistente por uno nuevo', async () => {
            const productAgregado1 = addProduct(product1)

            const nuevoProductName = 'Razer BlackWidow RGB'
            const datosActualizados = { ...productAgregado1, productName: nuevoProductName }

            const { status } = await axios.put(urlProducts + '/' + productAgregado1.id, datosActualizados)
            assert.strictEqual(status, 200)

            const productBuscado = getProductById(productAgregado1.id)
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
            const productsAntes = getProducts();

            await assert.rejects((async (error) => {
                assert.strictEqual(error.response.status, 400)
                return true
            })(
                axios.post(urlProducts, product),
            )); 

            const productsActual = getProducts();
            assert.deepStrictEqual(productsActual, productsAntes)
        })
    })
    
})