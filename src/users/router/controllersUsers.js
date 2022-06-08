import {
    getUsers,
    addUser,
    getUserByUsername,
    getUsersById,
    deleteUserById,
    replaceUser
} from '../services/users.js'


export function getUsersController (req, res, next) {
    let users;
    if (req.query.username) {
        users = getUserByUsername(req.query.username);
    } else {
        users = getUsers();
    }
    res.json(users)
}

export function getUserController (req, res, next) {
    try {
        const user = getUsersById(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function postUserController (req, res, next)  {
    try {
        const user = req.body
        const addedUser = addUser(user)
        res.status(201).json(addedUser)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export function deleteUserController (req, res, next)  {
    try {
        deleteUserById(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export function putUserController(req, res, next) {
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
}