const User = require('../schemas/users.schema');
const { errorHandler } = require('../middlewares/error.handler');
const {tokenSing} = require("../helpers/generateToken")

class BlsServices {
  constructor() {
    this.resultado = [];
  }

  async crear(data) {
    const { nombre, usuario, password, rol } = data
    const newUser = new User({
        nombre,
        usuario,
        password,
        rol,
        fecha:new Date()
    })

    await newUser.save().then((r) => {
        this.resultado = errorHandler(false, 200, 'OK', r);
    }).catch((e) => {
        this.resultado = errorHandler(true, 500, 'Errror to create user', e);
    })


    return this.resultado;
  }

  async login(data) {
    const {usuario, password} = data
    await User.find({usuario}).then((r) =>{
        if (!r) {
            return this.resultado = errorHandler(true, 400, 'invalid credentials', r);
        }
        
        if (!r[0].password === password) {
            return this.resultado = errorHandler(true, 400, 'invalid Credentials', r);
        }

        this.resultado = tokenSing({
            _id:r[0]._id,
            role:r[0].rol
        })
        
    })
    return this.resultado;
  }
/*
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

  
  */
}

module.exports = BlsServices;