const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const NumeracionSchema = new Schema({  
  id_chasis: {
    type: Schema.Types.ObjectId,
    ref: 'Chasis',
    unique:true
  },
  chasis:String,
  numero:Number,
  
});

const Numeracion = model('Numeracion', NumeracionSchema);

module.exports = Numeracion;