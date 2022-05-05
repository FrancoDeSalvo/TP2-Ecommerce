import {Router} from 'express';

import {
    getUsers,
    addUser,
    getUserByUsername,
    getUsersById,
    deleteUserById,
    replaceUser
} from './users.js'

const routerUsers = new Router();

/*********************************************************************/
routerUsers.get('/', (req, res) => {
    res.send('<h1>Ecommerce</h1>')
})


routerUsers.get('/', (req, res) => {
    let users;
    const username = req.query.username;
    if (username) {
        users = getUserByUsername(username);
    } else {
        users = getUsers();
    }
    res.json(users)
})


routerUsers.get('/:id', (req, res) => {
    try {
        const user = getUsersById(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

routerUsers.post('/', (req, res) => {
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

routerUsers.delete('/:id', (req, res) => {
    try {
        deleteUserById(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})

routerUsers.put('/:id', (req, res) => {
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

export { routerUsers }