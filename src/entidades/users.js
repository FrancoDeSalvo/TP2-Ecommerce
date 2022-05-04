import {obtenerNuevoId} from '../reusable/ids.js';

const users = [];

function copyUser(u) {
    return ({name: u.name, username: u.usename,lastname: u.lastname, dni: u.dni,phone: u.phone ,paymethod: u.paymethod})
}

function copyUsers(u) {
    return u.map(copyUser)
}

/****************************************************************************/
function createUser(u) {

    if (!u.name && !u.usename && !u.lastname && !u.dni && !u.phone && !u.paymethod) {
        throw new Error('Los campos son obligatorios')
    }
    
    let user = {
        id: obtenerNuevoId('user'),
        username: u.username,
        password: u.password,
        name: u.name,
        lastname: u.lastname,
        dni: u.dni,
        phone: u.phone,
        paymethod: u.paymethod,
    }

    return user;
}

export function addUser(u) {
    const user = createUser(u)
    users.push(user)
    return user;
}

export function getUsers() {
    return copyUsers(users)
}

export function deleteUsers(){
    while(users.length > 0){
        users.pop();
    }
}

export function getUserByUsername(username) {
    const u = users.filter(u => u.username.includes(username))
    return copyUsers(u)
}

//******************************* METODOS EN BASE AL ID (DEL USUARIO) ************************************/
export function getUsersById(id){
    const user = users.find(u => u.id === id);
    if (user){
        return copyUser(user)
    }
    else{
        throw new Error('USUARIO NO ENCONTRADO')
    }
}

export function deleteUserById(id) {
    const userId = users.findIndex(u => u.id === id)
    if (userId === -1) {
        throw new Error('USUARIO NO ENCONTRADO')
    } else {
        users.splice(userId, 1)
    }
}

export function replaceUser(id, userData) {
    const userId = users.findIndex(u => u.id === id)
    if (userId === -1) {
        throw new Error('USUARIO NO ENCONTRADO')
    } else {
        const user = createUser(userData)
        user.id = id
        users[userId] = user
    }
}