import express, { Router } from 'express'

const permisos = {
    admin: ['pepe']
}

//========================================
// # auth.js

import jwt from 'jsonwebtoken'

const PALABRA_CLAVE = 'ortORTortORT'

function codificar(objeto) {
    const token = jwt.sign(objeto, PALABRA_CLAVE);
    return token
}

function decodificar(token) {
    const objeto = jwt.verify(token, PALABRA_CLAVE)
    return objeto
}

//====================
// # controllers.js

function getHolaController(req, res, next) {
    console.log('alguien llego a la ruta "/hola"')
    res.send('saludos!')
}
function getRootController(req, res, next) {
    console.log('alguien llego a la ruta "/"')
    res.send(`el dato es: ${req.datoLoco}`)
}

function getMiErrorController(req, res, next) {
    try {
        if (true) {
            const miError = new Error('error loco')
            miError.tipo = 'LOCO'
            throw miError
        } else {
            res.send(`el dato es: ${req.datoLoco}`)
        }
    } catch (error) {
        next(error)
    }
}

function postFotosController(req, res, next) {
    if (req.file) {
        res.json({
            info: 'foto subida con exito',
            datos: req.file
        })
    } else {
        const fotoError = new Error('falta cargar imagen')
        fotoError.tipo = 'MISSING_FILE'
        next(fotoError)
    }
}

//=======================
// # middlewares.js

function notificacionFinal(req, res, next) {
    console.log('ultimo middleware: nadie contestó')
    next()
}

function rutaImportante(req, res, next) {
    console.log(`llegó una peticion a la url ${req.url}`)
    next()
}

function rutaSoloAdmin(req, res, next) {
    // aca verifico algo sobre el cliente que envia la peticion
    const token = req.headers.authorization
    const { username } = decodificar(token)
    const user = getUser(username)
    let esAdmin = false
    if (permisos.admin.includes(user.username)) {
        esAdmin = true
    }

    if (esAdmin) {
        next()
    } else {
        const errorPermisos = new Error('acceso restringido al recurso solicitado')
        errorPermisos.tipo = 'NOT_AUTHORIZED'
        next(errorPermisos)
    }
}

function middlewareCargaDatoLoco(req, res, next) {
    console.log('dato loco: cargado')
    req.datoLoco = 22
    next()
}

// # middlewareArchivos.js --> PARA LAS FOTOS

import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniquePreffix}-${file.originalname}`)
    }
})
const upload = multer({ storage })
const extraerUnArchivo = upload.single('mi-archivo')

//=========================
// # manejoErrores.js

function manejadorDeErrores(error, req, res, next) {
    switch (error.tipo) {
        case 'LOCO':
            res.status(400)
            break
        case 'MISSING_FILE':
            res.status(400)
            break
        case 'NOT_AUTHENTICATED':
            res.status(401)
            break
        case 'NOT_AUTHORIZED':
            res.status(403)
            break
        default:
            res.status(200)
    }
    res.json({ msg: 'error - ' + error.message })
}

//========================
// # router.js
// import controllers
const routerHola = new Router()
routerHola.use((req, res, next) => {
    console.log('entrando a router hola')
    next()
})
routerHola.get('/hola', rutaImportante, getHolaController)

//===========================
// import routers
// import middlewares
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(middlewareCargaDatoLoco)
app.use('/', routerHola)
app.get('/', rutaImportante, getRootController)
app.get('/mierror', getMiErrorController)

app.post('/fotos', extraerUnArchivo, postFotosController)

app.get('/privado', rutaSoloAdmin, (req, res) => { res.send('mis secretos mejor guardados') })

app.post('/register', (req, res) => {
    const user = createUser(req.body)
    saveUser(user)
    res.send('registro ok')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    const user = getUser(username)
    if (!user) {
        return res.status(401).send('fallo autenticacion')
    }
    if (user.password !== password) {
        return res.status(401).send('fallo autenticacion')
    }
    const token = codificar({ username })
    res.json({ token })
})

app.use(notificacionFinal)
app.use(manejadorDeErrores)

/* TODO ESTO VA EN LOS ARCHIVOS DE PERSISTENCIA */
// function createUser(datos) {
//     const username = datos.username
//     const password = datos.password
//     return {
//         username, password
//     }
// }

// const usuarios = []

// function saveUser(user) {
//     usuarios.push(user)
// }

// function getUser(username) {
//     return usuarios.find(u => u.username === username)
// }