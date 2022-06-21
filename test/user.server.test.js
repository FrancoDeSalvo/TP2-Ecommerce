import assert from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server/server.js'
import {getUsers, addUser, deleteUsers, getUsersById} from '../src/users/services/users.js'
// import {getProducts, addProduct, deleteProducts, getProductById} from '../src/products/products.js'

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
describe('Servidor de pruebas: USERS', () => {

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
                const usersReales = await getUsers();
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
                const usersAntes = await getUsers();

                const {data: userAgregado, status} = await axios.post(urlUsers, user4);
                assert.strictEqual(status, 201)

                const usersActual = await getUsers();
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

                const usersActuales = await getUsers();

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

                const userBuscado = await getUsersById(userAgregado1.id)
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
                    dni: '41235689',
                    paymethod: 'mastercard',
                }
                const usersAntes = await getUsers();

                await assert.rejects((async (error) => {
                    assert.strictEqual(error.response.status, 400)
                    return true
                })(
                    axios.post(urlUsers, user),
                )); 

                const usersActual = await getUsers();
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