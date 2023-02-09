const motonavesRouter = require('./motonaves.router');
const blsRouter = require('./bls.router');
const chasisRouter = require('./chasis.router');
const express = require('express');

const routerApi = (app) => {
  const router = express.Router();  app.use('/api/v1', router);
  
  router.use('/motonaves', motonavesRouter);
  router.use('/bls', blsRouter);
  router.use('/chasis', chasisRouter);
};

module.exports = routerApi;
