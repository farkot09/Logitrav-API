const Marcacion = require('../schemas/operaciones/marcacion.schema');
const Recibo = require('../schemas/operaciones/recibo.schema');
const Toma = require('../schemas/operaciones/toma.schema');
const Numeracion = require('../schemas/operaciones/numeracion.schema');
const Revision = require('../schemas/operaciones/revision.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ObjectId = require('mongoose').Types.ObjectId;
const ChasisServices = require('./chasis.service');
const XLSX = require('xlsx');
const fs = require('fs');

const servicesChasis = new ChasisServices();

class OperacionesServices {
  constructor() {
    this.resultado = [];
  }
  //----- INICIO DE SERVICIOS DE MARCACION ------------------//

  async maracacion(data) {
    const { id_motonave, id_usuario, id_chasis } = data;
    const newMarcacion = new Marcacion({
      id_motonave,
      id_usuario,
      id_chasis,
      fecha: Date.now(),
    });

    const resChasis = await servicesChasis.buscarUno(id_chasis);

    await this.marcacionPorChasis(id_chasis).then(async(res) => {
      if (res.data.length === 0) {
         if (resChasis.error === false) {
      await newMarcacion
        .save()
        .then((res) => {
          this.resultado = errorHandler(false, 201, 'Created', res);
        })
        .catch((err) => {
          this.resultado = errorHandler(true, 400, 'Verify your Chasis', err);
        });
    } else {
      this.resultado = errorHandler(
        true,
        400,
        'invalid Input',
        resChasis.error
      );
    }

      }else{
        this.resultado = errorHandler(true, 400, 'Chasis Duplicated', res.message);
      }
    })

   
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

  async marcacionPorChasis(id) {
    if (ObjectId.isValid(id)) {
      await Marcacion.find({ id_chasis: id }).then((res) => {
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

  //----- FIN DE SERVICIOS DE MARCACION ------------------//

  //----- INICIO DE SERVICIOS DE RECIBO ------------------//

  async recibo(data) {
    const { id_motonave, id_usuario, id_chasis } = data;
    const newMarcacion = new Recibo({
      id_motonave,
      id_usuario,
      id_chasis,
      fecha: Date.now(),
    });

    const resChasis = await servicesChasis.buscarUno(id_chasis);

    if (resChasis.error === false) {
      await newMarcacion
        .save()
        .then((res) => {
          this.resultado = errorHandler(false, 201, 'Created', res);
        })
        .catch((err) => {
          this.resultado = errorHandler(true, 400, 'Verify your Chasis', err);
        });
    } else {
      this.resultado = errorHandler(
        true,
        400,
        'invalid Input',
        resChasis.error
      );
    }

    return this.resultado;
  }

  async reciboPorMotonave(id) {
    if (ObjectId.isValid(id)) {
      await Recibo.find({ id_motonave: id }).then((res) => {
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

  async reciboPorChasis(id) {
    if (ObjectId.isValid(id)) {
      await Recibo.find({ id_chasis: id }).then((res) => {
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

  //----- FIN DE SERVICIOS DE MARCACION ------------------//

  //----- INICIO DE SERVICIOS DE TOMA DE IMPRONTAS ------------------//

  async toma(data) {
    const { id_motonave, id_usuario, id_chasis } = data;
    const newMarcacion = new Toma({
      id_motonave,
      id_usuario,
      id_chasis,
      fecha: Date.now(),
    });

    const resChasis = await servicesChasis.buscarUno(id_chasis);

    if (resChasis.error === false) {
      await newMarcacion
        .save()
        .then((res) => {
          this.resultado = errorHandler(false, 201, 'Created', res);
        })
        .catch((err) => {
          this.resultado = errorHandler(true, 400, 'Verify your Chasis', err);
        });
    } else {
      this.resultado = errorHandler(
        true,
        400,
        'invalid Input',
        resChasis.error
      );
    }

    return this.resultado;
  }

  async tomaPorMotonave(id) {
    if (ObjectId.isValid(id)) {
      await Toma.find({ id_motonave: id }).then((res) => {
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

  async tomaPorChasis(id) {
    if (ObjectId.isValid(id)) {
      await Toma.find({ id_chasis: id }).then((res) => {
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
  //----- FIN DE SERVICIOS DE TOMA DE IMPRONTAS ------------------//

  //----- INICIO DE SERVICIOS DE NUMERACION ------------------//

  async cargarNumeracion() {
    const path = require('path');
    const dirPath = path.join(__dirname, '../uploads/NUMERACION.xlsx');
    const workbook = XLSX.readFile(dirPath);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );

    for (let i = 0; i < xlData.length; i++) {
      await servicesChasis.buscarPorChasis(xlData[i].CHASIS).then((res) => {
        if (res.data.length !== 0) {
          const newNumeracion = new Numeracion({
            id_chasis: res.data[0]._id,
            chasis: res.data[0].chasis,
            numero: xlData[i].NUMERO,
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

  async todasNumeracion() {
    await Numeracion.find({})
      .populate('id_chasis')
      .then((data) => {
        this.resultado = errorHandler(false, 200, 'OK', data);
      })
      .catch((error) => {
        this.resultado = errorHandler(true, 400, 'Error, not found', error);
      });
    return this.resultado;
  }

  async numeracionPorChasis(id) {
    if (ObjectId.isValid(id)) {
      await Numeracion.find({ id_chasis: id }).then((res) => {
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
  //----- FIN DE SERVICIOS DE NUMERACION ------------------//

  //----- INICIO DE SERVICIOS DE REVISION ------------------//
  async revision(data) {
    const { id_motonave, id_usuario, id_chasis, numero } = data;
    const newMarcacion = new Revision({
      id_motonave,
      id_usuario,
      id_chasis,
      numero,
      fecha: Date.now(),
    });

    const resChasis = await servicesChasis.buscarUno(id_chasis);

    if (resChasis.error === false) {
      await newMarcacion
        .save()
        .then((res) => {
          this.resultado = errorHandler(false, 201, 'Created', res);
        })
        .catch((err) => {
          this.resultado = errorHandler(true, 400, 'Verify your Chasis', err);
        });
    } else {
      this.resultado = errorHandler(
        true,
        400,
        'invalid Input',
        resChasis.error
      );
    }

    return this.resultado;
  }

  async revisionPorMotonave(id) {
    if (ObjectId.isValid(id)) {
      await Revision.find({ id_motonave: id }).then((res) => {
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

  async revisionPorChasis(id) {
    if (ObjectId.isValid(id)) {
      await Revision.find({ id_chasis: id }).then((res) => {
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

  //----- FIN DE SERVICIOS DE REVISION ------------------//
}

module.exports = OperacionesServices;