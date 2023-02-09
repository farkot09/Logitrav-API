const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ChasisSchema = new Schema({
    id_motonave: {
        type: Schema.Types.ObjectId,
        ref:"Motonave"
    },
    id_bl: {
        type: Schema.Types.ObjectId,
        ref:"Bl"
    },
    chasis: {
        type: String,
        unique: true
    },
    modelo: String,
    version: String,
    color: String,
    motor: String,
})

const Chasis = model("Chasis", ChasisSchema)

module.exports = Chasis