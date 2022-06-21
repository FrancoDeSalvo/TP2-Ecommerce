import * as api from '../services/users.js'


export async function getUsersController (req, res, next) {
    let users;
    if (req.query.username) {
        users = await api.getUserByUsername(req.query.username);
    } else {
        users = await api.getUsers();
    }
    res.json(users)
}

export async function getUserController (req, res, next) {
    try {
        const user = await api.getUsersById(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export async function postUserController (req, res, next)  {
    try {
        const user = req.body
        const addedUser = await api.addUser(user)
        res.status(201).json(addedUser)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export async function deleteUserController (req, res, next)  {
    try {
        await api.deleteUserById(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export async function putUserController(req, res, next) {
    try {
        const userUpdate = req.body
        const usersUpdated = await api.replaceUser(req.params.id, userUpdate)
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
}