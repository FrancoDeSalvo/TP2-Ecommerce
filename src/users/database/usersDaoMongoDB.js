import { database } from '../../shared/databases/mongoDbClient.js';
import { crearErrorDePersistencia } from '../../shared/errors/models/ErrorDePersistencia.js';
import { crearErrorRecursoNoEncontrado } from '../../shared/errors/models/ErrorRecursoNoEncontrado.js'
const users = database.collection('users');

export async function saveUser(user){
    try {
        await users.updateOne({ id: user.id }, { $set: user }, { upsert: true })
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function recoverUsers() {
    try {
        const usersArray = await users.find().project({ _id: 0 }).toArray();
        return usersArray
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}


export async function removeAllUsers(){
    try {
        await users.deleteMany({})
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function recoverUserByName(username){
    try {
        return await users.find({ usernames: { $all: [username] } }).project({ _id: 0 }).toArray()
    } catch (error) {
        throw crearErrorDePersistencia()
    }
}

export async function recoverUsersById(id){
    let searched
    try {
        searched = await users.findOne({ id }, { projection: { _id: 0 } })
    } catch (error) {
        throw crearErrorDePersistencia()
    }
    if (!searched) {
        throw crearErrorRecursoNoEncontrado('user')
    }
    return searched
}

export async function removeUserById(id) {
    let result
    try {
        result = await users.deleteOne({ id })
    } catch (error) {
        throw crearErrorDePersistencia()
    }

    if (result.deletedCount === 0) {
        throw crearErrorRecursoNoEncontrado('user')
    }
}