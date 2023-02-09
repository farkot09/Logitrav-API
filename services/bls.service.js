const Bl = require('../schemas/bls.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ObjectId = require('mongoose').Types.ObjectId;
const MotonavesServices = require('../services/motonaves.service');

const servicesMotonaves = new MotonavesServices();

class BlsServices {
  constructor() {
    this.resultado = [];
  }

  async crear(data) {
    const { id_motonave, numero_bl, cantidad, marca, transporte, condicion } =
      data;
    const newBl = new Bl({
      id_motonave,
      numero_bl: numero_bl.toUpperCase().trim(),
      cantidad,
      marca: marca.toUpperCase().trim(),
      transporte: transporte.toUpperCase().trim(),
      condicion: condicion.toUpperCase().trim(),
    });

    const res = await servicesMotonaves.buscarUno(id_motonave);
    if (res.error === false) {
      await newBl
        .save()
        .then((data) => {
          if (data) {
            this.resultado = errorHandler(false, 201, 'Created', data);
          }
        })
        .catch((err) => {
          this.resultado = errorHandler(true, 500, "Cann't Create", err);
        });
    } else {
      this.resultado = errorHandler(true, 500, "Cann't Create", res);
    }

    return this.resultado;
  }

  async todas() {
    await Bl.find({})
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
      await Bl.findById({ _id: id }).then((res) => {
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
      const newData = new Bl({
        _id: id,
        id_motonave: data.id_motonave,
        numero_bl: data.numero_bl,
        cantidad: data.cantidad,
        marca: data.marca,
        transporte: data.transporte,
        condicion: data.condicion,
        fecha: data.fecha,
      });
      const ifExist = await Bl.findById({ _id: id });
      if (ifExist) {
        await Bl.findByIdAndUpdate(id, newData, { new: true })
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
      await Bl.findByIdAndDelete({ _id: id }).then((res) => {
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
      await Bl.find({ id_motonave: id }).then((res) => {
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

module.exports = BlsServices;
