import assert from 'assert'
import axios from 'axios'

import {conectar, desconectar} from '../src/server.js'
import {getUsers} from '../src/entidades/users.js'

describe('Servidor de pruebas', () => {

    before(async ()=>{
        await conectar();
    })

    before(async ()=>{
        await desconectar();
    })

    describe('el servidor esta escuchando', () => {

        describe('al pedirle los usuarios', () => {
            it('devuelve un array con usuarios', async () => {
                const {data: usersObtenidos, status} = await axios.get('http://localhost:3000/users');
                const usersReales = getUsers();
                assert.strictEqual(status, 200);
                assert.deepStrictEqual(usersReales, usersObtenidos);
            })
        })

        describe('al mandarle un usuario', () => {
            it('la agrega con las existentes', async () => {
                const user = {
                    // id: 2,
                    username: 'jaimitoElCrack',
                    password: '5648',
                    name: 'Jaime',
                    lastname: 'Gimenez',
                    dni: 41235689,
                    phone: 1156478912,
                    paymethod: '',
                }
                const usersAntes = getUsers();

                const {data: userAgregado, status} = await axios.post('http://localhost:3000/users', user);
                assert.strictEqual(status, 201)

                const usersActual = getUsers();
                assert.strictEqual(usersAntes.length + 1, usersActual.length);

                const userAgregadoEsperado = {...user, id: userAgregado.id}
                assert.deepStrictEqual(usersActual, usersAntes.concat(userAgregadoEsperado))
            })
        })

        describe('al mandarle un usuario mal formateado', () => {
            it('no agrega nada y devuelve un error', async () => {
                const user = {
                    // id: 2,
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
                    axios.post('http://localhost:3000/users', user),
                    error => {
                        assert.strictEqual(error.response.status, 400)
                        return true
                    }
                )

                const usersActual = getUsers();
                assert.deepStrictEqual(usersActual, usersAntes)
            })
        })
    })
})