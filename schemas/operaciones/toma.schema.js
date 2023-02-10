const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TomaSchema = new Schema({
  id_motonave: {
    type: Schema.Types.ObjectId,
    ref: 'Motonave',
  },
  id_usuario: String,
  id_chasis: {
    type: Schema.Types.ObjectId,
    ref: 'Chasis',
    unique:true
  },
  fecha: Date,
});

const Toma = model('Toma', TomaSchema);

module.exports = Toma;