import { createUser } from '../models/User.js'
import dao from '../database/usersDao.js'

const users = [];


export function addUser(u) {
    const user = createUser(u)
    dao.saveUser(user)
    return user;
}

export function getUsers() {
    return dao.recoverUsers()
}

export function deleteUsers(){
    dao.removeAllUsers()
}

export function getUserByUsername(username) {
    return dao.recoverUserByName(username)
}

//******************************* METODOS EN BASE AL ID (DEL USUARIO) ************************************/
export function getUsersById(id){
   return dao.recoverUsersById(id)
}

export function deleteUserById(id) {
    dao.removeUserById(id)
}

export function replaceUser(id, userData) {
    const user = createUser(userData)
    user.id = id
    dao.saveUser(user)
}