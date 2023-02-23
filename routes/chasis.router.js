const express = require('express');
const router = express.Router();
const ChasisServices = require('../services/chasis.service');
const XLSX = require('xlsx');
const multer = require('multer');

let nombreArchivo = {};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    nombreArchivo = 'CHASIS.xlsx';
    cb(null, nombreArchivo);
  },
});

const upload = multer({ storage: storage });

const service = new ChasisServices();

router.get('/', async (req, res) => {
  const data = await service.todas();
  res.status(data.statusCode).json(data);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const data = await service.buscarUno(id);
  res.status(data.statusCode).json(data);
});

router.get('/motonave/:id', async (req, res) => {
  const id = req.params.id;
  const data = await service.buscarPorMotonave(id);
  res.status(data.statusCode).json(data);
});

router.post('/', async (req, res) => {
  const body = req.body;
  const data = await service.crear(body);
  res.status(data.statusCode).json(data);
});

router.delete('/motonave/:id', async (req, res) => {
  const id = req.params.id;
  const data = await service.eliminarPorMotonave(id);
  res.status(data.statusCode).json(data);
});

router.get('/generarPlantilla/:id', async (req, res) => {
  const id = req.params.id;
  const data = await service.generarPlantilla(id);
  const buf = XLSX.write(data, { type: 'buffer', bookType: 'xlsx' });
  res.statusCode = 200;
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="PlantillaChasis.xlsx"'
  );
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.end(buf);
});

router.post('/cargarChasis/', upload.single('miArchvo'), async (req, res) => {
  const data = await service.cargarChasis();
  res.status(200).json(data);
});

module.exports = router;