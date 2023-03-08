const jwt = require("jsonwebtoken")
const { errorHandler } = require('../middlewares/error.handler');

const tokenSing = async (user) =>{
    return errorHandler(false, 200, 'OK', {token:jwt.sign({
        _id: user._id,
        role: user.role,       
    },
    process.env.SECRET_KEY,
    {
        expiresIn: "6h",
    }),dataUser:user.dataUser
           
})   
}

const verifyToken = async(token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        return null
    }
}

module.exports = { tokenSing, verifyToken }