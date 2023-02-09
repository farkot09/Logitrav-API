const express = require('express');
const router = express.Router();
const OperacionesServices = require("../services/operaciones.service")

const service = new OperacionesServices()

//------------INICIO RUTAS DE MARCACION A BORDO --------------//

router.post('/marcacion/', async(req, res) => {
  const body = req.body 
  const data = await service.maracacion(body)
  res.status(data.statusCode).json(data)    
    
});

router.get('/marcacion/motonave/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.marcacionPorMotonave(id)
  res.status(data.statusCode).json(data)    
  
});
//------------FIN RUTAS DE MARCACION A BORDO --------------//
/*


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

router.patch('/:id', async(req, res) => {
  const id = req.params.id
  const body = req.body
  const data = await service.actualizar(id, body)
  res.status(data.statusCode).json(data) 
});

router.delete('/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.eliminar(id)
  res.status(data.statusCode).json(data)    
  
});
*/

module.exports = router;