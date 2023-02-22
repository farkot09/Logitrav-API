const Programacion = require('../schemas/programacion.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ObjectId = require('mongoose').Types.ObjectId;
const XLSX = require('xlsx');
const fs = require('fs');
const ChasisServices = require('./chasis.service');


const servicesChasis = new ChasisServices();


class ProgramacionServices {
  constructor() {
    this.resultado = [];
  }

  async cargarProgramacion() {
    const path = require('path');
    const dirPath = path.join(__dirname, '../uploads/PROGRAMACION.xlsx');
    const workbook = XLSX.readFile(dirPath);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );

    for (let i = 0; i < xlData.length; i++) {
        await servicesChasis.buscarPorChasis(xlData[i].CHASIS).then((res) => {
          if (res.data.length !== 0) {
            const newNumeracion = new Programacion({
              id_chasis: res.data[0]._id,
              chasis: res.data[0].chasis,
              conductor: xlData[i].CONDUCTOR,
              cedula: xlData[i].CEDULA,
              placa: xlData[i].PLACA,
              planilla: xlData[i].PLANILLA,
              transporte: xlData[i].TRANSPORTE,
              fecha_programacion: new Date()
            });
            newNumeracion
              .save()
              .then((res) => {
                return (this.resultado = errorHandler(
                  false,
                  201,
                  'upload Success',
                  res
                ));
              })
              .catch((err) => {
                this.resultado = errorHandler(true, 500, 'upload faile', err);
              });
          } else {
            this.resultado = errorHandler(true, 500, 'Data not found', {});
          }
        });
      }

    fs.unlinkSync(dirPath);
    return this.resultado;
  }

  async todas() {
    await Programacion.find({})
      .then((data) => {
        this.resultado = errorHandler(false, 200, 'OK', data);
      })
      .catch((error) => {
        this.resultado = errorHandler(true, 400, 'Error, not found', error);
      });
    return this.resultado;
  }
 

  async agrupadosPlanilla() {
   await Programacion.aggregate([{
   
    $group:{
      _id:"$planilla",
      "cantidad":{$sum:1},
      records:{$push:"$$ROOT"}
      
    }
    
   }]).then((data) => {
    this.resultado = errorHandler(false, 200, 'OK', data);
  })
  .catch((error) => {
    this.resultado = errorHandler(true, 400, 'Error, not found', error);
  });

    return this.resultado;
  }

  async buscarPorPlanilla(data) {
    
    
    if(isNaN(data)){
      return this.resultado = errorHandler(true, 400, 'Not at Number Planilla', data);
    }

    await Programacion.find({planilla: data}).then((res) => {      
      if (res.length > 0) {
        this.resultado = errorHandler(false, 200, 'OK', res);
      } else {
        this.resultado = errorHandler(true, 400, 'Not data Found', res);
      }
    });
  
  return this.resultado;
}

  async buscarPorPlaca(data) {    

  await Programacion.find({placa: data}).then((res) => {
    if (res) {
      this.resultado = errorHandler(false, 200, 'OK', res);
    } else {
      this.resultado = errorHandler(true, 400, 'Not data Found', res);
    }
  });

return this.resultado;
}
   

  async actualizarPlanilla(data) {
    const {conductor, cedula, placa, planilla, transporte} = data

    await Programacion.updateMany({planilla}, {$set:{conductor,cedula,placa, transporte}}).then((res) => {
      if (res) {
        this.resultado = errorHandler(false, 200, `${res.matchedCount} Fields Afecteds`, res);
      } else {
        this.resultado = errorHandler(true, 400, 'Not data Found', res);
      }
    })


    return this.resultado;
  }

  async eliminarPlanilla(planilla) {
    
      await Programacion.deleteMany({ planilla: planilla }).then((res) => {
        if (res.deletedCount > 0) {          
          this.resultado = errorHandler(false, 200, `${res.deletedCount} field Deleted`, planilla);
        } else {
          this.resultado = errorHandler(true, 400, 'Planilla Not Exist', planilla);
        }
      });
     
    return this.resultado;
  }

  async eliminarChasisDePlanilla(planilla, data) {
    const {chasis} = data

    const id_chasis = await servicesChasis.buscarPorChasis(chasis)
    if (id_chasis.error === true) {
      return this.resultado = errorHandler(true, 400, 'Chasis Not Exist', chasis);
    }

    await Programacion.deleteOne({id_chasis: id_chasis.data[0]._id}).then((r) => {
      if (r.deletedCount > 0) {
        this.resultado = errorHandler(false, 200, `${r.deletedCount} fields deleted`, chasis); 
      }else{
        this.resultado = errorHandler(true, 204, `${chasis} exist But, Not scheduled`, chasis); 
      }
    })
    
    
   
  return this.resultado;
}

async AgregarChasisAPlanilla(data) {

  const {planilla, chasis} = data
  const id_chasis = await servicesChasis.buscarPorChasis(chasis)
  if (id_chasis.error === true) {
    return this.resultado = errorHandler(true, 400, 'Chasis Not Exist', chasis);
  }

  const v_planilla = await this.buscarPorPlanilla(planilla)
  if (v_planilla.error === true) {
    return this.resultado = errorHandler(true, 400, 'Planilla Not Exist', planilla);
  }
  
  const newProgramacion = new Programacion({
    id_chasis:id_chasis.data[0]._id,
    chasis:id_chasis.data[0].chasis,
    conductor:v_planilla.data[0].conductor,
    cedula:v_planilla.data[0].cedula,
    placa:v_planilla.data[0].placa,
    planilla:v_planilla.data[0].planilla,
    transporte:v_planilla.data[0].transporte,
    fecha_programacion: new Date()
  })

  await newProgramacion.save().then((r) => {       
    if (r) {
      this.resultado = errorHandler(false, 200, `Created`, chasis); 
    }
  }).catch((e) => {    
    this.resultado = errorHandler(true, 500, e, chasis);
  })
  
  
 
return this.resultado;
}

async buscarPorChasis(chasis) {
      
  await Programacion.find({chasis: chasis}).then((res) => {        
    if (res.length > 0) {
      this.resultado = errorHandler(false, 200, 'OK', res);
    } else {
      this.resultado = errorHandler(true, 400, 'OK', res);
    }
  });

return this.resultado;
}

}

module.exports = ProgramacionServices;