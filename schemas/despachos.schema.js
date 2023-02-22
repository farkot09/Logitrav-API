const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const DespachosSchema = new Schema({
    id_motonave: {
        type: Schema.Types.ObjectId,
        ref:"Motonave"
    },
    id_bl: {
        type: Schema.Types.ObjectId,
        ref:"Bl"
    },
    id_chasis: {
        type: Schema.Types.ObjectId,
        ref:"Chasis"
    },
    conductor: String,
    cedula: String,
    placa: String,
    planilla: String,
    novedad:String,
    fecha_despacho:Date,
})

const Despachos = model("Despacho", DespachosSchema)

module.exports = Despachos