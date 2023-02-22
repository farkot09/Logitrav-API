const Chasis = require('../schemas/chasis.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ObjectId = require('mongoose').Types.ObjectId;
const MotonavesServices = require('../services/motonaves.service');
const BlsServices = require('../services/bls.service');

const servicesMotonaves = new MotonavesServices();
const servicesBl = new BlsServices();

class ChasisServices {
  constructor() {
    this.resultado = [];
  }

  async crear(data) {
    const { id_motonave, id_bl, chasis, modelo, version, color, motor } = data;
    const newChasis = new Chasis({
      id_motonave,
      id_bl,
      chasis: chasis.toUpperCase().trim(),
      modelo: modelo.toUpperCase().trim(),
      version: version.toUpperCase().trim(),
      color: color.toUpperCase().trim(),
      motor: motor.toUpperCase().trim(),
    });

    const resMotonave = await servicesMotonaves.buscarUno(id_motonave);
    const resBl = await servicesBl.buscarUno(id_bl);

    if (resMotonave.error === false && resBl.error === false) {
      await newChasis.save().then((res) => {
        this.resultado = errorHandler(false, 201, 'Created', res);
      }).catch((err) => {
        this.resultado = errorHandler(true, 500, "Invalid", err)
      });
    } else {
      this.resultado = errorHandler(true, 400, 'Verify Motonave or Bl', []);
    }

    return this.resultado;
  }
  
  async todas() {
    await Chasis.find({})
      .then((data) => {
        this.resultado = errorHandler(false, 200, 'OK', data);
      })
      .catch((error) => {
        this.resultado = errorHandler(true, 400, 'Error, not found', error);
      });
    return this.resultado;
  }
 

  async buscarUno(id) {
    if (ObjectId.isValid(id)) {
      await Chasis.findById({ _id: id }).then((res) => {
        if (res) {
          this.resultado = errorHandler(false, 200, 'OK', res);
        } else {
          this.resultado = errorHandler(true, 400, 'OK', res);
        }
      });
    } else {
      this.resultado = errorHandler(
        true,
        400,
        'id Not valid, not as ObjectId',
        []
      );
    }
    return this.resultado;
  }

  async buscarPorChasis(chasis) {
      
      await Chasis.find({chasis: chasis}).then((res) => {        
        if (res.length > 0) {
          this.resultado = errorHandler(false, 200, 'OK', res);
        } else {
          this.resultado = errorHandler(true, 400, 'OK', res);
        }
      });
    
    return this.resultado;
  }


  async eliminarPorMotonave(id) {
    if (ObjectId.isValid(id)) {
      await Chasis.deleteMany({ id_motonave: id }).then((res) => {
        if (res) {
          this.resultado = errorHandler(false, 200, 'Eliminated', id);
        } else {
          this.resultado = errorHandler(true, 400, 'id Not Exist', []);
        }
      });
    } else {
      this.resultado = errorHandler(
        true,
        400,
        "'id Not valid, not as ObjectId",
        []
      );
    }
    return this.resultado;
  }

  async buscarPorMotonave(id) {
    if (ObjectId.isValid(id)) {
      await Chasis.find({ id_motonave: id }).then((res) => {
        this.resultado = errorHandler(false, 200, 'OK', res);
      });
    } else {
      this.resultado = errorHandler(
        true,
        400,
        'id Not valid, not as ObjectId',
        []
      );
    }
    return this.resultado;
  }

}

module.exports = ChasisServices;
