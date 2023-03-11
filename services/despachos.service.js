const Despachos = require('../schemas/despachos.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ChasisServices = require('../services/chasis.service');
const ProgramacionServices = require('../services/programacion.service');
const OperacionesServices = require('../services/operaciones.service');
const ObjectId = require('mongoose').Types.ObjectId;

const servicesChasis = new ChasisServices();
const servicesProgramacion = new ProgramacionServices();
const servicesOperacion = new OperacionesServices();

class BlsServices {
  constructor() {
    this.resultado = [];
  }

  async despachar(planilla) {
    const aDespachar = await servicesProgramacion.buscarPorPlanilla(planilla);
    if (aDespachar.error === true) {
      return (this.resultado = errorHandler(
        true,
        400,
        `${aDespachar.message}`,
        aDespachar.data
      ));
    }

    for (let index = 0; index < aDespachar.data.length; index++) {
      const element = aDespachar.data[index];
      const chasis = await servicesChasis.buscarUno(element.id_chasis);
      const chasisRecibo = await servicesOperacion.reciboPorChasis(
        element.id_chasis
      );
      const newDespacho = new Despachos({
        id_motonave: chasis.data.id_motonave.id_motonave,
        nombre_motonave: chasis.data.id_motonave.nombre_motonave,
        numero_bl: chasis.data.id_bl.numero_bl,
        transporte: chasis.data.id_bl.transporte,
        condicion: chasis.data.id_bl.condicion,
        marca: chasis.data.id_bl.marca,
        modelo: chasis.data.modelo,
        chasis: chasis.data.chasis,
        version: chasis.data.version,
        color: chasis.data.color,
        motor: chasis.data.motor,
        id_usuario_recibo: chasisRecibo.data.id_usuario,
        fecha_recibo: chasisRecibo.data.fecha,
        conductor: element.conductor,
        cedula: element.cedula,
        placa: element.placa,
        planilla: element.planilla,
        novedad: 'Sin Novedad',
        id_usuario_despacho: '0000',
        fecha_despacho: new Date(),
      });

      await newDespacho
        .save()
        .then(async (r) => {
          if (index + 1 === aDespachar.data.length) {
            await servicesProgramacion.eliminarPlanilla(element.planilla);
            this.resultado = errorHandler(false, 200, `Planilla Despachada`, r);
          }
        })
        .catch((e) => {
          this.resultado = errorHandler(true, 500, `Error to save Despacho`, e);
        });
    }

    return this.resultado;
  }

  async desacerDespacho(chasis) {
    await Despachos.findOneAndRemove({ chasis })
      .then((r) => {
        if (r === null) {
          return (this.resultado = errorHandler(
            true,
            500,
            `No exist at Chasis`,
            r
          ));
        }

        this.resultado = errorHandler(false, 200, `ok`, r);
      })
      .catch((e) => {
        this.resultado = errorHandler(true, 400, `error`, e);
      });

    return this.resultado;
  }

  async registrarNovedad(chasis, data) {
    const { novedad } = data;
    const ifChasis = await Despachos.find({ chasis: chasis });
    if (ifChasis.length !== 1) {
      return (this.resultado = errorHandler(
        true,
        500,
        `verify data input`,
        ifChasis.length
      ));
    }
    ifChasis[0].novedad = novedad.trim().toUpperCase();
    const newChasis = new Despachos(ifChasis[0]);

    await Despachos.findByIdAndUpdate(newChasis._id, newChasis, {
      new: true,
    }).then((r) => {
      this.resultado = errorHandler(false, 200, `ok`, r);
    });

    return this.resultado;
  }

  async despachosPorMotonave(id) {
    if (ObjectId.isValid(id)) {
      await Despachos.find({ id_motonave: id }).then((res) => {
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
