const  sequelize = require('../utils/mysql')
module.exports = {
    insert : (req, res) => {
        var list = [ sequelize.bom_m, req.body[0], sequelize.bom_c, req.body[1] ]
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
        var list = [ sequelize.bom_m, req.query, sequelize.bom_c, req.query]
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
    change :  (req, res) => {
        var list = [ sequelize.bom_m, JSON.parse(req.query['w']), JSON.parse(req.query['v'])]
        sequelize.change(list).then(data => {
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
        var list = [ sequelize.bom_m, req.query, sequelize.bom_c, req.query]
        sequelize.select(list).then(data => {
            res.send(data)
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
            return
        })
    },
    update : (req, res) => {
        var list = [ sequelize.bom_m, req.body[0], sequelize.bom_c, req.body[1]]
        sequelize.update(list).then(data => {
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
    }
}