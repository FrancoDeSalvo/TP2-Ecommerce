import express from 'express'
import {getUsers, addUser} from './entidades/users.js'

const app = express()

app.use(express.json())

/*********************************************************************/
app.get('/', (req, res) => {
    res.send('<h1>Ecomerce</h1>')
})

app.get('/users', (req, res) => {
    const users = getUsers()
    res.json(users)
})

app.post('/users', (req, res) => {
    try {
        const user = req.body
        const addedUser = addUser(user)
        res.status(201).json(addedUser)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

/*********************************************************************/
let server

export function conectar() {
    return new Promise((resolve, reject) => {
        server = app.listen(3000, () => {
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
