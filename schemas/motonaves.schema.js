const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const motonavesSchema = new Schema({
    nombre_motonave: String,
    cantidad: Number,
    cantidad_bls: Number,
    eta: String,
    fecha_captura: Date,
    operacion:Boolean,
    estado_bls:Boolean
})

const Motonave = model("Motonave", motonavesSchema)

module.exports = Motonave
