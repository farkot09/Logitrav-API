const express = require('express');
const router = express.Router();
const DespachoscionServices = require('../services/despachos.service');

const service = new DespachoscionServices();

router.post('/:planilla', async (req, res) => {
  const planilla = req.params.planilla;
  const data = await service.despachar(planilla);
  res.status(200).json(data);
});

router.post('/novedad/:chasis', async (req, res) => {
  const chasis = req.params.chasis;
  const body = req.body;
  const data = await service.registrarNovedad(chasis, body);
  res.status(200).json(data);
});

router.get('/motonave/:id', async (req, res) => {
  const id = req.params.id;  
  const data = await service.despachosPorMotonave(id);
  res.status(200).json(data);
});

router.delete('/:chasis', async (req, res) => {
  const chasis = req.params.chasis;
  const data = await service.desacerDespacho(chasis);
  res.status(200).json(data);
});

module.exports = router;