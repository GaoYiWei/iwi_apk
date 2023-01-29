const  sequelize = require('../utils/mysql')
const jsonwebtoken = require('../utils/token')
module.exports = {
    insert : (req, res) => {
        var list = [ sequelize.users, req.body ]
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
        var list = [ sequelize.users, req.query ]
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
        var list = [ sequelize.users, JSON.parse(req.query['w']), JSON.parse(req.query['v'])]
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
        var list = [ sequelize.users, req.query ]
        sequelize.select(list).then(data => {
            res.send(data)
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
            return
        })
    },
    login :  (req, res) => {
        // 需修改为使用帐号检索用户数据，后校验密码及状态，根据校验结果返回登录结果
        var list = [ sequelize.users, req.query ]
        sequelize.select(list).then(data => {
            var msg = {token: null, err: null, user: {account: null, name: null, depart: null}}
            if(data['users'].length==1) {
                msg['token'] = jsonwebtoken.createToken(data['users'][0])
                msg['user']['account'] = data['users'][0]['account']
                msg['user']['name'] = data['users'][0]['name']
                msg['user']['depart'] = data['users'][0]['depart']
            } else {
                msg['err'] = '账号密码错误或不可用'
            }
            res.send(msg)
        }).catch(err => {
            console.log(err)
            res.sendStatus(500)
            return
        })
    },
    reset :  (req, res) => {
        var list = [ sequelize.users, JSON.parse(req.query['w']) ]
        sequelize.select(list).then(data => {
            if(data['users'].length==1) {
                list = [ sequelize.users, JSON.parse(req.query['w']), JSON.parse(req.query['v'])]
                sequelize.change(list).then(data => {
                    if(data==200) {
                        res.sendStatus(200)
                    } else {
                        res.send(data)
                    }
                })
            } else {
                res.send('旧密码错误')
            }
        }).catch(err => {
            console.log(err)
            res.send(err)
            return
        })
    }
}