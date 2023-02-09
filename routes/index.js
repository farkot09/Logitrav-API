const motonavesRouter = require('./motonaves.router');
const express = require('express');

const routerApi = (app) => {
  const router = express.Router();  app.use('/api/v1', router);
  
  router.use('/motonaves', motonavesRouter);
};

module.exports = routerApi;
