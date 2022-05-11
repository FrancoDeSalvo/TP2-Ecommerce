import express from 'express'
import { routerUsers } from '../src/users/routerUsers.js'
import { routerProducts } from '../src/products/routerProducts.js'
import { routerVentas } from '../src/ventas/routerVentas.js'

const app = express()

app.use(express.json())

app.use('/api/users', routerUsers)
app.use('/api/products', routerProducts)
app.use('/api/ventas', routerVentas)
 
let server;

export function conectar(port = 0) {
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            resolve(server.address().port)
        })
        server.on('error', error => {
            reject(error)
        })
    })
}

export function desconectar() {
    return new Promise((resolve, reject) => {
        server.close(error => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}