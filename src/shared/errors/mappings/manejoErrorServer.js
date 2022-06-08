export default function manejadorDeErrores(error, req, res, next) {
    switch (error.tipo) {
        case 'MISSING_FILE':
            res.status(400)
            break
        case 'NOT_AUTHENTICATED':
            res.status(401)
            break
        case 'NOT_AUTHORIZED':
            res.status(403)
            break
        case 'NOT_FOUND':
            res.status(404)
            break
        case 'NO_CONTENT':
            res.status(204)
            break
        default:
            res.status(200)
    }
    res.json({ msg: 'error - ' + error.message })
}