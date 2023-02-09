const express = require('express');
const router = express.Router();
const ChasisServices = require("../services/chasis.service")

const service = new ChasisServices()

router.get('/', async(req, res) => {
    const data = await service.todas()
    res.status(data.statusCode).json(data)    
    
});

router.get('/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.buscarUno(id)
  res.status(data.statusCode).json(data)    
  
});

router.get('/motonave/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.buscarPorMotonave(id)
  res.status(data.statusCode).json(data)    
  
});

router.post('/', async(req, res) => {
  const body = req.body 
  const data = await service.crear(body)
  res.status(data.statusCode).json(data) 
});


router.delete('/motonave/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.eliminarPorMotonave(id)
  res.status(data.statusCode).json(data)    
  
});



module.exports = router;