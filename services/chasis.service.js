const Chasis = require('../schemas/chasis.schema');
const { errorHandler } = require('../middlewares/error.handler');
const ObjectId = require('mongoose').Types.ObjectId;
const MotonavesServices = require('../services/motonaves.service');
const BlsServices = require('../services/bls.service');
const XLSX = require('xlsx');
const fs = require('fs');

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
      await newChasis
        .save()
        .then((res) => {
          this.resultado = errorHandler(false, 201, 'Created', res);
        })
        .catch((err) => {
          this.resultado = errorHandler(true, 500, 'Invalid', err);
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
    await Chasis.find({ chasis: chasis }).then((res) => {
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

  async generarPlantilla(id) {
    const mn = await servicesMotonaves.buscarUno(id);
    const bls = await servicesBl.buscarPorMotonave(id);
    var item = 0;

    if (mn.data.cantidad_bls !== bls.data.length) {
      return (this.resultado = errorHandler(
        true,
        500,
        'Data Bls Quatity is not correct',
        mn.data.cantidad_bls
      ));
    }

    var headerE = [
      'item',
      'id_motonave',
      'nombre_motonave',
      'id_bl',
      'numeroBl',
      'chasis',
      'modelo',
      'version',
      'color',
      'motor',
    ];
    var dataE = [];
    for (let index = 0; index < bls.data.length; index++) {
      const element = bls.data[index];

      for (let index2 = 0; index2 < element.cantidad; index2++) {
        item++;
        var data2 = {
          item: item,
          id_motonave: mn.data._id.toString(),
          nombre_motonave: mn.data.nombre_motonave,
          id_bl: element._id.toString(),
          numeroBl: element.numero_bl,
          chasis: '',
          modelo: '',
          version: '',
          color: '',
          motor: '',
        };

        dataE.push(data2);
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(dataE, { header: headerE, skipHeader: false }),
      'Hoja1'
    );

    return (this.resultado = wb);
  }

  async cargarChasis() {
    const path = require('path');
    const dirPath = path.join(__dirname, '../uploads/CHASIS.xlsx');
    const workbook = XLSX.readFile(dirPath);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );

    for (let i = 0; i < xlData.length; i++) {
      const newChasis = new Chasis({
        id_motonave: xlData[i].id_motonave,
        id_bl: xlData[i].id_bl,
        chasis: xlData[i].chasis,
        modelo: xlData[i].modelo,
        version: xlData[i].version,
        color: xlData[i].color,
        motor: xlData[i].motor,
      });

      await newChasis
        .save()
        .then((r) => {
          this.resultado = errorHandler(
            false,
            201,
            `${i + 1} Chasis inserteds`,
            r
          );
        })
        .catch((e) => {
          this.resultado = errorHandler(true, 500, `Error At Insertd Data`, e);
        });
    }

    fs.unlinkSync(dirPath);
    return this.resultado;
  }
}

module.exports = ChasisServices;
