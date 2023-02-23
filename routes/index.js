const motonavesRouter = require('./motonaves.router');
const blsRouter = require('./bls.router');
const chasisRouter = require('./chasis.router');
const operacionesRouter = require('./operaciones.router');
const programacionRouter = require('./programacion.router');
const despachosRouter = require('./despachos.router');
const usersRouter = require('./users.router');
const express = require('express');
const checkAuth = require("../middlewares/auth")

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/motonaves',checkAuth, motonavesRouter);
  router.use('/bls',checkAuth, blsRouter);
  router.use('/chasis',checkAuth, chasisRouter);
  router.use('/operaciones',checkAuth, operacionesRouter);
  router.use('/programacion',checkAuth, programacionRouter);
  router.use('/despachos',checkAuth, despachosRouter);
  router.use('/usuarios', usersRouter);
};

module.exports = routerApi;
