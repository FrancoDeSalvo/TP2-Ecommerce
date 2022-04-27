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

function createUser(u) {
    const users = {}

    if (!u.name && !u.usename && !u.lastname && !u.dni && !u.phone && !u.paymethod) {
        throw new Error('Los campos son obligatorios')
    }
    
    let user = {
        id: users[length(users)-1].id + 1 ,
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

export function getUsers() {
    // return users.map(u => ({ name: u.name, username: u.usename,lastname: u.lastname, dni: u.dni,phone: u.phone ,paymethod: u.paymethod }))
    return [...users];
}

export function addUser(u) {
    const user = createUser(u)
    users.push(user)
    return user;
}