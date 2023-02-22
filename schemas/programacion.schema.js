const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProgramacionSchema = new Schema({        
    id_chasis: {
        type: Schema.Types.ObjectId,
        ref:"Chasis",
        unique:true
    },
    chasis:String,
    conductor: String,
    cedula: String,
    placa: String,
    planilla: Number,
    transporte: String,
    fecha_programacion:Date,
})

const Programacion = model("Programacion", ProgramacionSchema)

module.exports = Programacion