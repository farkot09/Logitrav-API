const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MarcacionSchema = new Schema({
  id_motonave: {
    type: Schema.Types.ObjectId,
    ref: 'Motonave',
  },
  id_usuario: String,
  id_chasis: {
    type: Schema.Types.ObjectId,
    ref: 'Chasis',
    unique: true,
  } /*  */,
  fecha: Date,
});

const Marcacion = model('Marcacion', MarcacionSchema);

module.exports = Marcacion;