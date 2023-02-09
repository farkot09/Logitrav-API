const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BlsSchema = new Schema({
    id_motonave: {
        type: Schema.Types.ObjectId,
        ref:"Motonave"
    },
    numero_bl: String,
    cantidad: Number,
    marca: String,
    transporte: String,
    condicion:String,
    fecha:Date
})

const Bl = model("Bl", BlsSchema)

module.exports = Bl