const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ReciboSchema = new Schema({
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

const Recibo = model('Recibo', ReciboSchema);

module.exports = Recibo;