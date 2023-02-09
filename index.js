require('dotenv').config();
require('./config/db');
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { errorHandler } = require('./middlewares/error.handler');
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola mi server en Express');
});

routerApi(app);
app.use(errorHandler);

app.listen(port);
