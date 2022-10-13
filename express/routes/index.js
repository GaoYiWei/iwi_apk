var express = require('express');
var router = express.Router();
const redisClient = require('../utils/redis')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome', list: ['姓名：高义伟', '微信：g1144806425', '电话：18550442412', '邮箱：1144806425@qq.com g1144806425@outlook.com' ] });
})

var users = require('./users')
router.get('/reset', users.reset)
router.get('/login', users.login)
router.get('/users', users.select)
router.post('/users', users.insert)
router.delete('/users', users.delete)
router.patch('/users', users.change)

var departs = require('./departs')
router.get('/departs', departs.select)
router.post('/departs', departs.insert)
router.delete('/departs', departs.delete)
router.patch('/departs', departs.change)

var whs = require('./whs')
router.get('/whs', whs.select)
router.post('/whs', whs.insert)
router.delete('/whs', whs.delete)
router.patch('/whs', whs.change)

var partners = require('./partners')
router.get('/partners', partners.select)
router.post('/partners', partners.insert)
router.delete('/partners', partners.delete)
router.patch('/partners', partners.change)

var sbntrace = require('./sbntrace')
router.get('/sbntrace', sbntrace.select)
router.post('/sbntrace', sbntrace.insert)
router.delete('/sbntrace', sbntrace.delete)

var inventory = require('./inventory')
router.get('/inventory', inventory.select)
router.post('/inventory', inventory.insert)
router.delete('/inventory', inventory.delete)
router.patch('/inventory', inventory.change)

var inventoryinfo = require('./inventoryinfo')
router.get('/inventoryinfo', inventoryinfo.select)
router.post('/inventoryinfo', inventoryinfo.insert)
router.delete('/inventoryinfo', inventoryinfo.delete)
router.patch('/inventoryinfo', inventoryinfo.change)

var bom = require('./bom')
router.get('/bom', bom.select)
router.post('/bom', bom.insert)
router.put('/bom', bom.update)
router.delete('/bom', bom.delete)
router.patch('/bom', bom.change)

var substitute = require('./substitute')
router.get('/substitute', substitute.select)
router.post('/substitute', substitute.insert)
router.put('/substitute', substitute.update)
router.delete('/substitute', substitute.delete)
router.patch('/substitute', substitute.change)

var po = require('./po')
router.get('/po', po.select)
router.post('/po', po.insert)
router.put('/po', po.update)
router.delete('/po', po.delete)
router.patch('/po', po.change)

var receipt = require('./receipt')
router.get('/receipt', receipt.select)
router.post('/receipt', receipt.insert)
router.put('/receipt', receipt.update)
router.delete('/receipt', receipt.delete)
router.patch('/receipt', receipt.change)

var so = require('./so')
router.get('/so', so.select)
router.post('/so', so.insert)
router.put('/so', so.update)
router.delete('/so', so.delete)
router.patch('/so', so.change)

var delivery = require('./delivery')
router.get('/delivery', delivery.select)
router.post('/delivery', delivery.insert)
router.put('/delivery', delivery.update)
router.delete('/delivery', delivery.delete)
router.patch('/delivery', delivery.change)

var transfer = require('./transfer')
router.get('/transfer', transfer.select)
router.post('/transfer', transfer.insert)
router.put('/transfer', transfer.update)
router.delete('/transfer', transfer.delete)
router.patch('/transfer', transfer.change)

var picklist = require('./picklist')
router.get('/picklist', picklist.select)
router.post('/picklist', picklist.insert)
router.put('/picklist', picklist.update)
router.delete('/picklist', picklist.delete)
router.patch('/picklist', picklist.change)

var borrow = require('./borrow')
router.get('/borrow', borrow.select)
router.post('/borrow', borrow.insert)
router.put('/borrow', borrow.update)
router.delete('/borrow', borrow.delete)
router.patch('/borrow', borrow.change)

var producewh = require('./producewh')
router.get('/producewh', producewh.select)
router.post('/producewh', producewh.insert)
router.put('/producewh', producewh.update)
router.delete('/producewh', producewh.delete)
router.patch('/producewh', producewh.change)

var disassemb = require('./disassemb');
router.get('/disassemb', disassemb.select)
router.post('/disassemb', disassemb.insert)
router.put('/disassemb', disassemb.update)
router.delete('/disassemb', disassemb.delete)
router.patch('/disassemb', disassemb.change)

var addr = require('../public/json/cities.json')
router.get('/addr', (req, res) => {    
    res.send(JSON.stringify(addr))
})

router.get('/id', (req, res) => {
    redisClient.LPOP(req.query.id).then(data => {
        if(data) {
            res.send(data)
            if(req.query.id=='partners') {
                redisClient.RPUSH('partners', (Array(6).join(0) + (parseInt(data) + 150)).slice(-6))
            } else {
                redisClient.RPUSH(req.query.id, (Array(10).join(0) + (parseInt(data) + 150)).slice(-10))
            }            
        } else {
            res.sendStatus(404)
            return
        }        
    }).catch(err => {
        res.sendStatus(404)
        return
    })  
})

const  sequelize = require('../utils/mysql')
router.get('/call',(req, res) => {
    if(req.query.proc.substring(0,4)!='CALL') {
        res.sendStatus(403)
        return
    }
    sequelize.call(req.query.proc).then(data => {
        res.send(data)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
        return
    })
})


module.exports = router;
