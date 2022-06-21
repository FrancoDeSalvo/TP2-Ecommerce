import { createUser } from '../models/User.js'
import dao from '../database/usersDao.js'

const users = [];


export async function addUser(u) {
    const user = createUser(u)
    await dao.saveUser(user)
    return user;
}

export async function getUsers() {
    return await dao.recoverUsers()
}

export async function deleteUsers(){
    await dao.removeAllUsers()
}

export async function getUserByUsername(username) {
    return await dao.recoverUserByName(username)
}

//******************************* METODOS EN BASE AL ID (DEL USUARIO) ************************************/
export async function getUsersById(id){
   return await dao.recoverUsersById(id)
}

export async function deleteUserById(id) {
    await dao.removeUserById(id)
}

export async function replaceUser(id, userData) {
    const user = createUser(userData)
    user.id = id
    await dao.saveUser(user)
}