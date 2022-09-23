const jwt = require("jsonwebtoken")
const secret = "gaoyiwei@nodejs2022"
module.exports = {
    createToken: (info) => {
        return jwt.sign(info, secret, { expiresIn: 60 * 60 * 24 * 7 })
    },
    verifyToken: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (error, result) => {
                if(error) { reject(error) }
                resolve(result)
            })
        })
    }
}