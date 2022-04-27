import { dirname } from "path";

let users = [
    {
        id: 1,
        username: 'lautyMartin',
        password: '1234',
        name: 'Lautaro',
        lastname: 'Martinez',
        dni: 40457821,
        phone: 1130278092,
        paymethod: ' '  ,
    },
    {
        id: 2,
        username: 'martugonzales',
        password: '12345',
        name: 'Martina',
        lastname: 'Gonzales',
        dni: 42457823,
        phone: 1130278000,
        paymethod: ' '  ,
    },
    {
        id: 3,
        username: 'jonjey',
        password: '1543',
        name: 'Jon',
        lastname: 'Jeysenger',
        dni: 40403050,
        phone: 1120304050,
        paymethod: ' '  ,
    }

]

function creatUser(u) {
    const users = {}

    if (!
    u.name && !
    u.usename && !
    u.lastname && !
    u.dni && !
    u.phone && !
    u.paymethod) {
        throw new Error('Los campos son obligatorios')
    }
    
    user.id = users[length(users)-1].id + 1 
    user.name = u.name  
    user.usename = u.username
    user.lastname = u.lastname
    user.din = u.dni 
    user.phone = u.phone 
    user.paymethod = u.paymethod

    return user
}

export function getUsers() {
    return users.map(u => ({ name: u.name, username: u.usename,lastname: u.lastname, dni: u.dni,phone: u.phone ,paymethod: u.paymethod }))
}

// export function agregarCarrera(datosCarrera) {
//     const carrera = crearCarrera(datosCarrera)
//     carreras.push(carrera)
//     return carrera
// }