import express from 'express'
import { routerUsers } from '../users/router/routerUsers.js'
import { routerProducts } from '../products/router/routerProducts.js'
import { routerVentas } from '../ventas/routerVentas.js'
import { routerCarrito } from '../carrito/router/routerCarrito.js'

const app = express()

app.use(express.json())

app.use('/api/users', routerUsers)
app.use('/api/products', routerProducts)
app.use('/api/ventas', routerVentas)
app.use('/api/carrito', routerCarrito)
 
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