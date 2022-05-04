import assert from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server.js'
import {getUsers, addUser, deleteUsers, getUserById} from '../src/entidades/users.js'

const user1 = {
        id: 1,
        username: 'lautyMartin',
        password: '1234',
        name: 'Lautaro',
        lastname: 'Martinez',
        dni: 40457821,
        phone: 1130278092,
        paymethod: ' '  ,
    };

const user2 = {
        id: 2,
        username: 'martugonzales',
        password: '12345',
        name: 'Martina',
        lastname: 'Gonzales',
        dni: 42457823,
        phone: 1130278000,
        paymethod: ' '  ,
    };

const user3 = {
        id: 3,
        username: 'jonjey',
        password: '1543',
        name: 'Jon',
        lastname: 'Jeysenger',
        dni: 40403050,
        phone: 1120304050,
        paymethod: ' '  ,
    };

/****************************************************************************************************/
describe('Servidor de pruebas', () => {

    let serverUrl;

    before(async ()=>{
        const port = await conectar(0)
        serverUrl = `http://localhost:${port}/users`;
    })

    before(async ()=>{
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

                const {data: usersObtenidos, status} = await axios.get(serverUrl);
                const usersReales = getUsers();
                assert.strictEqual(status, 200);
                assert.deepStrictEqual(usersObtenidos, usersReales);
            })
        })

        describe('al mandarle un usuario', () => {
            it('la agrega con las existentes', async () => {
                const user = {
                    username: 'jaimitoElCrack',
                    password: '5648',
                    name: 'Jaime',
                    lastname: 'Gimenez',
                    dni: 41235689,
                    phone: 1156478912,
                    paymethod: '',
                }
                const usersAntes = getUsers();

                const {data: userAgregado, status} = await axios.post(serverUrl, user);
                assert.strictEqual(status, 201)

                const usersActual = getUsers();
                assert.strictEqual(usersAntes.length + 1, usersActual.length);

                const userAgregadoEsperado = {...user, id: userAgregado.id}
                assert.deepStrictEqual(usersActual, usersAntes.concat(userAgregadoEsperado))
            })
        })

        describe('al pedirle un usuario especifico, segun su identificador', () => {
            it('devuelve ese usuario', async () => {

                const userAgregado1 = await addUser(user1)

                let userObtenido;
                const { data, status } = await axios.get(serverUrl + '/' + userAgregado1.id)
                assert.strictEqual(status, 200)
                userObtenido = data;

                assert.deepStrictEqual(userObtenido, userAgregado1)
            })
        })

        describe('al pedirle que borre un usuario especifica segun su ID', () => {
            it('se borra el mismo y no se devuelve nada', async () => {
                const userAgregado1 = await addUser(user1);
                
                const { status } = await axios.delete(serverUrl + '/' + userAgregado1.id)
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

                const { status } = await axios.put(serverUrl + '/' + userAgregado1.id, datosActualizados)
                assert.strictEqual(status, 200)

                const userBuscado = getUserById(userAgregado1.id)
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
                    dni: 41235689,
                    phone: 1156478912,
                    paymethod: '',
                }
                const usersAntes = getUsers();

                await assert.rejects(
                    axios.post(serverUrl, user),
                    error => {
                        assert.strictEqual(error.response.status, 400)
                        return true
                    }
                )

                const usersActual = getUsers();
                assert.deepStrictEqual(usersActual, usersAntes)
            })
        })

        describe('al pedirle un usuario que no existe', () => {
            it('lanza un error 404', async () => {
                await assert.rejects(
                    axios.get(serverUrl + '/unIdQueNoExiste'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

        describe('al pedirle un usuario que no existe', () => {
            it('lanza un error 404', async () => {
                await assert.rejects(
                    axios.delete(serverUrl + '/unIdQueNoExiste'),
                    error => {
                        assert.strictEqual(error.response.status, 404)
                        return true
                    }
                )
            })
        })

    })
})