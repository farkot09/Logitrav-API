const { verifyToken } = require("../helpers/generateToken")

const checkAuth = async(req, res, next) => {
    try {
        
        const token = req.headers.authorization !== undefined ? req.headers.authorization.split(" ").pop() : null
        const tokenData = await verifyToken(token)        
        if (tokenData !== null) {
            next()
        } else {
            res.status(401)
            res.send({
                error:true,
                statusCode:401,
                img_statusCode:`https://http.cat/401`,
                message:"Unathorized",
                data:[]
            })
        }
    } catch (error) {
        res.status(500)
        res.send({
            error:true,
            statusCode:500,
            img_statusCode:`https://http.cat/500`,
            message:"Error to validate Token",
            data:[]
        })
    }
}

module.exports = checkAuth