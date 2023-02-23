const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UsersSchema = new Schema({     
    nombre:String,
    usuario: String,
    password: String,
    rol: String,
    fecha: Date
})

const Users = model("User", UsersSchema)

module.exports = Users