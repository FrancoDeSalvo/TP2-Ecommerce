import { conectar } from './server.js'

const port = await conectar()

console.log(`servidor inicializado en puerto ${port}`)
