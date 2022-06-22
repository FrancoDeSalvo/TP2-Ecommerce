import express from 'express'
import { routerUsers } from '../users/router/routerUsers.js'
import { routerProducts } from '../products/router/routerProducts.js'
import { routerVentas } from '../ventas/router/routerVentas.js'
import { routerCarrito } from '../carrito/router/routerCarrito.js'
import { manejadorDeErrores } from '../shared/errors/middlewares/errorHandler.js'

const app = express()

//--> Lo guarda en el body
app.use(express.json()) 

/*--> Permite leer info. que se mandan en formularios 
(podemos enviar objetos inclusive. Por eso usamos el 'extended: true') */
app.use(express.urlencoded({ extended: true })) 

//--> La gente va a poder acceder a los archivos de la carpeta 'public'. Se muestra el HTML.
app.use(express.static('public'))

app.use('/api/users', routerUsers)
app.use('/api/products', routerProducts)
app.use('/api/ventas', routerVentas)
app.use('/api/carrito', routerCarrito)
app.use(manejadorDeErrores)
 
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