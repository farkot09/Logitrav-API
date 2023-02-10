const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RevisionSchema = new Schema({
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
  numero:Number,
  fecha: Date,
});

const Revision = model('Revision', RevisionSchema);

module.exports = Revision;