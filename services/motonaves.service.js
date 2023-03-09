const Motonave = require('../schemas/motonaves.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ObjectId = require('mongoose').Types.ObjectId;

class motonaveService {
  constructor() {
    this.resultado = [];
  }

  async crear(data) {
    const { nombre_motonave, cantidad, cantidad_bls, eta } = data;
    const newMotonave = new Motonave({
      nombre_motonave: nombre_motonave.toUpperCase().trim(),
      cantidad,
      cantidad_bls,
      eta,
      fecha_captura: Date.now(),
      operacion: false,
      estado_bls: false,
    });

    await newMotonave
      .save()
      .then((data) => {
        this.resultado = errorHandler(false, 201, 'Created', data);
      })
      .catch((error) => {
        this.resultado = errorHandler(
          true,
          500,
          'Internal Server Error',
          error
        );
      });
    return this.resultado;
  }

  async todas() {
    await Motonave.find({})
      .then((data) => {
        this.resultado = errorHandler(false, 200, 'OK', data);
      })
      .catch((error) => {
        this.resultado = errorHandler(true, 400, 'Error, not found', error);
      });
    return this.resultado;
  }

  async activas() {
    await Motonave.find({ operacion: true })
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
      await Motonave.findById({ _id: id }).then((res) => {
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

  async actualizar(id, data) {
    if (ObjectId.isValid(id)) {
      const newData = new Motonave({
        _id: id,
        nombre_motonave: data.nombre_motonave,
        cantidad: data.cantidad,
        cantidad_bls: data.cantidad_bls,
        eta: data.eta,
        fecha_captura: data.fecha_captura,
        operacion: data.operacion,
        estado_bls: data.estado_bls,
      });
      const ifExist = await Motonave.findById({ _id: id });
      if (ifExist) {
        await Motonave.findByIdAndUpdate(id, newData, { new: true })
          .then((res) => {
            this.resultado = errorHandler(false, 201, 'Updated', res);
          })
          .catch((error) => {
            this.resultado = errorHandler(true, 500, "Cann't updated", error);
          });
      } else {
        this.resultado = errorHandler(true, 204, 'id Not Exist', []);
      }
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

  async eliminar(id) {
    if (ObjectId.isValid(id)) {
      await Motonave.findOneAndDelete({ _id: id, operacion:false }).then((res) => {
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
}

module.exports = motonaveService;
