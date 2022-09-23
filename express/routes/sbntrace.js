const  sequelize = require('../utils/mysql')
module.exports = {
    insert : (req, res) => {
        var list = [ sequelize.sbntrace, req.body]
        sequelize.insert(list).then(data => {
            if(data==200) {
                res.sendStatus(200)
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
            return
        })
    },
    delete :  (req, res) => {
        var list = [ sequelize.sbntrace, req.query]
        sequelize.delete(list).then(data => {
            if(data==200) {
                res.sendStatus(200)
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
            return
        })
    },
    select :  (req, res) => {
        var list = [ sequelize.sbntrace, req.query]
        sequelize.select(list).then(data => {
            res.send(data)
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
            return
        })
    }
}