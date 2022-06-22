import { crearErrorDePersistencia } from '../../shared/errors/models/ErrorDePersistencia.js';

//-----------------------------------------------------------------
export async function guardarVenta(v) {
    throw crearErrorDePersistencia()
}

//-----------------------------------------------------------------
export async function obtenerVentaPorId(id){
    throw crearErrorDePersistencia()
}

export async function obtenerVentas(){
    throw crearErrorDePersistencia()
}

export async function obtenerVentaPorNombreDeUsuario(nomUser) {
    throw crearErrorDePersistencia()
}

//-----------------------------------------------------------------
export async function actualizarEstadoACancelado(id){
    throw crearErrorDePersistencia()
}

export async function actualizarEstadoACambio(id){
    throw crearErrorDePersistencia()
}

export async function actualizarProductosCambiados(id, productosTotalesNuevos){
    throw crearErrorDePersistencia()
}

export async function actualizarDiferenciaAPagar(id, diferenciaAPagar){
    throw crearErrorDePersistencia()
}

export async function actualizarProductosYPrecio(id, carrito){
    throw crearErrorDePersistencia()
}

//----------------------------------------------------------------
export async function eliminarVentas(){
    throw crearErrorDePersistencia()
}