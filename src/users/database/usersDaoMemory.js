const users = [];

export async function saveUser(user){
    const userId = users.findIndex(u => u.id === user.id)
    if (userId === -1) {
        users.push(user)
    } else {
        users[userId] = user
    }
}

export async function recoverUsers() {
    return copyUsers(users)
}


export async function removeAllUsers(){
    while(users.length > 0){
        users.pop();
    }
}

export async function recoverUserByName(username){
    const u = users.filter(u => u.username === username)
    return copyUsers(u)
}

export async function recoverUsersById(id){
    const user = users.find(u => u.id === id);
    if (user){
        return copyUser(user)
    }
    else{
        throw new Error('USUARIO NO ENCONTRADO')
    }
}

export async function removeUserById(id) {
    const userId = users.findIndex(u => u.id === id)
    if (userId === -1) {
        throw new Error('USUARIO NO ENCONTRADO')
    } else {
        users.splice(userId, 1)
    }
}



function copyUser(u) {
    return ({
        id: u.id,
        username: u.username,
        password: u.password,
        name: u.name, 
        lastname: u.lastname, 
        dni: u.dni,
        phone: u.phone,
        paymethod: u.paymethod
    })
}

function copyUsers(u) {
    return u.map(copyUser)
}


