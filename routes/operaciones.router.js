const express = require('express');
const router = express.Router();
const OperacionesServices = require("../services/operaciones.service")
const multer = require("multer")


let nombreArchivo = {}
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "uploads/")
  },
  filename: function(req,file,cb){
    nombreArchivo = "NUMERACION.xlsx";
    cb(null, nombreArchivo)
  }
})

const upload = multer({storage: storage})

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




//------------INICIO RUTAS DE RECIBOENPATIO --------------//

router.post('/recibo/', async(req, res) => {
  const body = req.body 
  const data = await service.recibo(body)
  res.status(data.statusCode).json(data) 
    
});

router.get('/recibo/motonave/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.reciboPorMotonave(id)
  res.status(data.statusCode).json(data)    
  
});


//------------FIN RUTAS DE RECIBOENPATIO --------------//



//------------INICIO RUTAS DE TOMA --------------//

router.post('/toma/', async(req, res) => {
  const body = req.body 
  const data = await service.toma(body)
  res.status(data.statusCode).json(data) 
    
});

router.get('/toma/motonave/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.tomaPorMotonave(id)
  res.status(data.statusCode).json(data)    
  
});

//------------FIN RUTAS DE TOMA --------------//



//------------INICIO RUTAS DE NUMERACION --------------//

router.get('/numeracion/', async(req, res) => {  
  const data = await service.todasNumeracion()
  res.status(data.statusCode).json(data)  
    
});

router.post('/cargarNumeracion/',upload.single("miArchvo"), async(req, res) => {  
  const data = await service.cargarNumeracion()
  res.status(data.statusCode).json(data)  
    
});

//------------FIN RUTAS DE NUMERACION --------------//



//----- INICIO DE SERVICIOS DE REVISION ------------------//

router.post('/revision/', async(req, res) => {
  const body = req.body 
  const data = await service.revision(body)
  res.status(data.statusCode).json(data)    
    
});

router.get('/revision/motonave/:id', async(req, res) => {
  const id = req.params.id
  const data = await service.revisionPorMotonave(id)
  res.status(data.statusCode).json(data)    
  
});

//----- FIN DE SERVICIOS DE REVISION ------------------//

module.exports = router;