import { crearErrorDePersistencia } from '../../shared/errors/models/ErrorDePersistencia.js' 

export async function saveUser(user){
    throw crearErrorDePersistencia()
}

export async function recoverUsers() {
    throw crearErrorDePersistencia()
}

export async function removeAllUsers(){
    throw crearErrorDePersistencia()
}

export async function recoverUserByName(username){
    throw crearErrorDePersistencia()
}

export async function recoverUsersById(id){
    throw crearErrorDePersistencia()
}

export async function removeUserById(id) {
    throw crearErrorDePersistencia()
}