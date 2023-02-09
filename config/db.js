require("dotenv").config()
const mongoose = require('mongoose');
const connectionString =process.env.DATABASE_URI;

//conexion amongo dv
mongoose.set("strictQuery", false)
const dbconnect = mongoose
  .connect(connectionString)
  .then(() => {
    console.log('database Connected');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = dbconnect;