import { conectar } from '../src/server/server.js'

const port = await conectar()

console.log(`servidor inicializado en puerto ${port}`)