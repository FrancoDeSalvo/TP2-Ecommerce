import express from 'express'
import {
    getUsers,
    addUser,
    getUserByUsername,
    getUsersById,
    deleteUserById,
    replaceUser
} from './entidades/users.js'

const app = express()

app.use(express.json())


/*********************************************************************/
app.get('/', (req, res) => {
    res.send('<h1>Ecommerce</h1>')
})


app.get('/users', (req, res) => {
    let users;
    const username = req.query.username;
    if (username) {
        users = getUserByUsername(username);
    } else {
        users = getUsers();
    }
    res.json(users)
})


app.get('/users/:id', (req, res) => {
    try {
        const user = getUsersById(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

app.post('/users', (req, res) => {
    try {
        const user = req.body
        const addedUser = addUser(user)
        res.status(201).json(addedUser)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

app.delete('/users/:id', (req, res) => {
    try {
        deleteUserById(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

app.put('/users/:id', (req, res) => {
    try {
        const userUpdate = req.body
        const usersUpdated = replaceUser(req.params.id, userUpdate)
        res.json(usersUpdated)
    } catch (error) {
        if (error.tipo == 'not found') {
            res.status(404).json({
                error: error.message
            })
        } else {
            res.status(400).json({
                error: error.message
            })
        }
    }
})

/*********************************************************************/
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