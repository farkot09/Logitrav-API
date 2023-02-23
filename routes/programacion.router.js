const express = require('express');
const router = express.Router();
const ProgramacionServices = require('../services/programacion.service');
const multer = require('multer');

const service = new ProgramacionServices();

let nombreArchivo = {};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    nombreArchivo = 'PROGRAMACION.xlsx';
    cb(null, nombreArchivo);
  },
});

const upload = multer({ storage: storage });

router.post(
  '/cargarProgramacion/',
  upload.single('miArchvo'),
  async (req, res) => {
    const data = await service.cargarProgramacion();
    res.status(data.statusCode).json(data);
  }
);

router.get('/', async (req, res) => {
  const data = await service.todas();
  res.status(data.statusCode).json(data);
});

router.get('/agrupadosPlanilla', async (req, res) => {
  const data = await service.agrupadosPlanilla();
  res.status(data.statusCode).json(data);
});

router.get('/buscarPlanilla/:data', async (req, res) => {
  const dato = req.params.data;
  const data = await service.buscarPorPlanilla(dato);
  res.status(data.statusCode).json(data);
});

router.get('/buscarPlaca/:data', async (req, res) => {
  const dato = req.params.data;
  const data = await service.buscarPorPlaca(dato);
  res.status(data.statusCode).json(data);
});

router.get('/buscarPorChasis/:chasis', async (req, res) => {
  const chasis = req.params.chasis;
  const data = await service.buscarPorChasis(chasis);
  res.status(data.statusCode).json(data);
});

router.patch('/actualizarPlanilla', async (req, res) => {
  const body = req.body;
  const data = await service.actualizarPlanilla(body);
  res.status(data.statusCode).json(data);
});

router.delete('/:planilla', async (req, res) => {
  const planilla = req.params.planilla;
  const data = await service.eliminarPlanilla(planilla);
  res.status(data.statusCode).json(data);
});

router.delete('/eliminarChasis/:planilla', async (req, res) => {
  const planilla = req.params.planilla;
  const body = req.body;
  const data = await service.eliminarChasisDePlanilla(planilla, body);
  res.status(data.statusCode).json(data);
});

router.post('/agregarChasisAPlanilla', async (req, res) => {
  const body = req.body;
  const data = await service.AgregarChasisAPlanilla(body);
  res.status(200).json(data);
});

module.exports = router;