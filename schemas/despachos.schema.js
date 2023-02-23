const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const DespachosSchema = new Schema({
    id_motonave: {
        type: Schema.Types.ObjectId,
        ref:"Motonave"
    },
    nombre_motonave: String,    
    numero_bl: String,    
    transporte: String,    
    condicion: String,    
    marca: String,    
    modelo: String,    
    chasis: {
        type: String,
        unique:true
    },    
    version: String,    
    color: String,    
    motor: String,    
    id_usuario_recibo: String,
    fecha_recibo: Date,
    conductor: String,
    cedula: String,
    placa: String,
    planilla: Number,
    novedad:String,
    id_usuario_despacho: String,
    fecha_despacho:Date,
})

const Despachos = model("Despacho", DespachosSchema)

module.exports = Despachos