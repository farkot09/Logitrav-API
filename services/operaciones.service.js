const Marcacion = require('../schemas/operaciones/marcacion.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ObjectId = require('mongoose').Types.ObjectId;
const MotonavesServices = require('./motonaves.service');
const ChasisServices = require('./chasis.service');

const servicesMotonaves = new MotonavesServices();
const servicesChasis = new ChasisServices();

class OperacionesServices {
  constructor() {
    this.resultado = [];
  }
  //----- INICIO DE SERVICIOS DE MARCACION ------------------//

  async maracacion(data) {
    const { id_motonave,id_usuario, id_chasis } = data
    const newMarcacion = new Marcacion({
      id_motonave,
      id_usuario,
      id_chasis,
      fecha:Date.now()
    })

    const resChasis = await servicesChasis.buscarUno(id_chasis)

    if (resChasis.error === false) {
      await newMarcacion.save().then((res) => {
        this.resultado = errorHandler(false, 201, "Created", res)
      }).catch((err) => {
        this.resultado = errorHandler(true, 400, "Verify your Chasis", err)
      })
    }else{
      this.resultado = errorHandler(true, 400, "invalid Input", resChasis.error)
    }


    return this.resultado;
  }


  async marcacionPorMotonave(id) {
    if (ObjectId.isValid(id)) {
      await Marcacion.find({ id_motonave: id }).then((res) => {
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
  /*
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
*/
}

module.exports = OperacionesServices;