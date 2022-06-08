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