const { Sequelize, DataTypes } = require('sequelize')
const conf = {
    dialect: 'mysql',
    host: '192.168.0.137',
    port: '3306',
    logging: false,
    timezone: '+08:00',
    pool: {
        min: 1,
        max: 10,
        acquire: 30000,
        idle: 1000
    },
    dialectOptions: {
        dateStrings: true,
        typeCast(field, next) {
            if(field.type == 'DATE') {
                return field.string()
            }
            return next()
        }
    }
}
const sequelize = new Sequelize('iwi', 'sa', 'GYW7043710100gyw', conf)
sequelize.authenticate().then(() => {
    console.log('MySQL is connected...')
}).catch(err => {
    console.log(err)
})

const departs = sequelize.define('departs', {
    id: {
        type: DataTypes.INTEGER(3).UNSIGNED
    },
    name: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    deactivateat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const whs = sequelize.define('whs', {
    id: {
        type: DataTypes.INTEGER(4).UNSIGNED
    },
    name: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    deactivateat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const partners = sequelize.define('partners', {
    id: {
        type: DataTypes.STRING(6)
    },
    name: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    liaision: {
        type: DataTypes.STRING(10)
    },
    tel: {
        type: DataTypes.STRING(11)
    },
    abbr: {
        type: DataTypes.STRING(15)
    },
    code: {
        type: DataTypes.STRING(18)
    },
    cat: {
        type: DataTypes.STRING(4)
    },
    bank: {
        type: DataTypes.STRING(50)
    },
    bc: {
        type: DataTypes.STRING(50)
    },
    level: {
        type: DataTypes.INTEGER(1)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    deactivateat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'partners_abbr', using: 'BTREE', fields: [{ attribute: 'abbr', length: 4 }] }
    ]
})
const users = sequelize.define('users', {
    account: {
        type: DataTypes.STRING(30),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(10)
    },
    pwd: {
        type: DataTypes.STRING(20)
    },
    depart: {
        type: DataTypes.STRING(10)
    },
    tel: {
        type: DataTypes.BIGINT(11)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    deactivateat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'users_name', using: 'BTREE', fields: [{ attribute: 'name', length: 2 }] }
    ]
})
const inventory = sequelize.define('inventory', {
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(30)
    },
    model: {
        type: DataTypes.STRING(30)
    },
    namedesc: {
        type: DataTypes.STRING(40)
    },
    manufact: {
        type: DataTypes.STRING(15)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    deactivateat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'inventory_pn', using: 'BTREE', fields: [{ attribute: 'pn', length: 4 }] },
        { name: 'inventory_name', using: 'BTREE', fields: [{ attribute: 'name', length: 3 }] }
    ]
})
const inventoryinfo = sequelize.define('inventoryinfo', {
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    size: {
        type: DataTypes.STRING(20)
    },
    volume: {
        type: DataTypes.FLOAT
    },
    netw: {
        type: DataTypes.FLOAT
    },
    grossw: {
        type: DataTypes.FLOAT
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'inventoryinfo_pn', using: 'BTREE', fields: [{ attribute: 'pn', length: 4 }] }
    ]
})
const bom_m = sequelize.define('bom_m', {
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    level: {
        type: DataTypes.INTEGER(1).UNSIGNED
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    deactivateat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'bom_m_pn', using: 'BTREE', fields: [{ attribute: 'pn', length: 4 }] }
    ]
})
const bom_c = sequelize.define('bom_c', {
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    cpn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const substitutes_m = sequelize.define('substitutes_m', {
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'substitutes_m_pn', using: 'BTREE', fields: [{ attribute: 'pn', length: 4 }] }
    ]
})
const substitutes_c = sequelize.define('substitutes_c', {
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    substitutes: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    priority: {
        type: DataTypes.FLOAT
    },
    prop: {
        type: DataTypes.FLOAT
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    deactivateat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'substitutes_c_pn', using: 'BTREE', fields: [{ attribute: 'pn', length: 4 }] }
    ]
})
const po_m = sequelize.define('po_m', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    contract: {
        type: DataTypes.STRING(30)
    },
    deliverat: {
        type: DataTypes.DATEONLY
    },
    vendor: {
        type: DataTypes.STRING(15)       
    },
    cat: {
        type: DataTypes.STRING(8)
    },
    cnee: {
        type: DataTypes.STRING(10)
    },
    addr: {
        type: DataTypes.STRING(100)
    },
    tel: {
        type: DataTypes.BIGINT(11)
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'po_m_id', using: 'BTREE', fields: [{ attribute: 'id', length: 7}] },
        { name: 'po_m_contract', using: 'BTREE', fields: [{ attribute: 'contract', length: 10 }] }
    ]
})
const po_c = sequelize.define('po_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    taxrate: {
        type: DataTypes.FLOAT
    },
    taxincluded: {
        type: DataTypes.DECIMAL(8,2) 
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const receipt_m = sequelize.define('receipt_m', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    cat: {
        type: DataTypes.STRING(8)
    },
    wh: {
        type: DataTypes.STRING(20)
    },
    superiorid: {
        type: DataTypes.STRING(10)
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'receipt_m_superiorid', using: 'BTREE', fields: [{ attribute: 'superiorid', length: 7 }] }
    ]
})
const receipt_c = sequelize.define('receipt_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const so_m = sequelize.define('so_m', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    contract: {
        type: DataTypes.STRING(30)
    },
    deliverat: {
        type: DataTypes.DATEONLY
    },
    buyer: {
        type: DataTypes.STRING(15)        
    },
    cat: {
        type: DataTypes.STRING(8)
    },
    cnee: {
        type: DataTypes.STRING(15)
    },
    addr: {
        type: DataTypes.STRING(100)
    },
    tel: {
        type: DataTypes.BIGINT(11)
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'so_m_contract', using: 'BTREE', fields: [{ attribute: 'contract', length: 10 }] }
    ]
})
const so_c = sequelize.define('so_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    taxrate: {
        type: DataTypes.FLOAT
    },
    taxincluded: {
        type: DataTypes.DECIMAL(8,2) 
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const delivery_m = sequelize.define('delivery_m', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    cat: {
        type: DataTypes.STRING(8)
    },
    wh: {
        type: DataTypes.STRING(20)
    },
    superiorid: {
        type: DataTypes.STRING(10)
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'delivery_m_superiorid', using: 'BTREE', fields: [{ attribute: 'superiorid', length: 7 }] }
    ]
})
const delivery_c = sequelize.define('delivery_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const transfer_m = sequelize.define('transfer_m',{
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    iwh: {
        type: DataTypes.STRING(20)
    },
    owh: {
        type: DataTypes.STRING(20)
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const transfer_c = sequelize.define('transfer_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const picklist_m = sequelize.define('picklist_m',{
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    cat: {
        type: DataTypes.STRING(8)   
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const picklist_c = sequelize.define('picklist_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
},{
    freezeTableName: true,
    timestamps: false
})
const producewh_m = sequelize.define('producewh_m', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    cat: {
        type: DataTypes.STRING(8)  
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const producewh_c = sequelize.define('producewh_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const disassemb_m = sequelize.define('disassemb_m', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    sbn: {
        type: DataTypes.STRING(18)
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const disassemb_c = sequelize.define('disassemb_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    wh: {
        type: DataTypes.STRING(20)
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const borrow_m = sequelize.define('borrow_m',{
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    usedfor: {
        type: DataTypes.STRING(100)
    },
    prebackat: {
        type: DataTypes.DATE
    },
    comment: {
        type: DataTypes.STRING(100)
    },
    created: {
        type: DataTypes.STRING(10)
    },
    createdat: {
        type: DataTypes.DATE
    },
    edited: {
        type: DataTypes.STRING(10)
    },
    editedat: {
        type: DataTypes.DATE
    },
    audited: {
        type: DataTypes.STRING(10)
    },
    auditedat: {
        type: DataTypes.DATE
    },
    delivered: {
        type: DataTypes.STRING(10)
    },
    deliveredat: {
        type: DataTypes.DATE
    },
    received: {
        type: DataTypes.STRING(10)
    },
    receivedat: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const borrow_c = sequelize.define('borrow_c', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    pn: {
        type: DataTypes.STRING(9),
        primaryKey: true
    },
    qty: {
        type: DataTypes.FLOAT
    },
    comment: {
        type: DataTypes.STRING(100)
    }
}, {
    freezeTableName: true,
    timestamps: false
})
const sbntrace = sequelize.define('sbntrace', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    sbn: {
        type: DataTypes.STRING(18)
    },
    cat: {
        type: DataTypes.STRING(10)   
    },
    orderid: {
        type: DataTypes.STRING(10)
    },
    qty: {
        type: DataTypes.FLOAT
    },
    created: {
        type: DataTypes.STRING(20)
    },
    createdat: {
        type: DataTypes.DATE
    }   
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        { name: 'sbntrace_sbn', using: 'BTREE', fields: [{ attribute: 'sbn', length: 8 }] },
        { name: 'sbntrace_orderid', using: 'BTREE', fields: [{ attribute: 'orderid', length: 4 }] }
    ]
})

// sequelize.sync().then(()=>{
//     users.create({account: '1144806425@qq.com',name: 'admin',pwd: '7509603916',tel: '18550442412',depart: 'admin',created: 'admin',createdat: Date(),status: 1}).then( res => {
//         console.log('模型已同步到数据库') 
//         console.log(res.toJSON())
//     }).catch(err => console.log(err))
// }).catch(err => console.log(err))
const { QueryTypes } = require('sequelize');
module.exports = {
    // 写入: [ model, [ table_values ] ], model为sequelize中的模型, table_values为JSON
    insert: async function insert(list) {
        const t = await sequelize.transaction()
        try {
            for(var i=0;i<list.length;i+=2) {
                await list[i].bulkCreate(list[i+1], { transaction: t })
            }        
            await t.commit()
            return 200
        } catch(err) {
            await t.rollback()
            return err
        }
    },
    // 删除: [ model, where ], where为JSON
    delete: async function del(list) {
        const t = await sequelize.transaction()
        try {
            for(var i=0;i<list.length;i+=2) {
                await list[i].destroy({ where: list[i+1] }, { transaction: t })
            }
            await t.commit
            return 200
        } catch(err) {
            await t.rollback()
            return err
        }
    },
    // 修改, 用于单表修改, 审核 & 状态变更: [ model, where, val ], where & val 均为JSON
    change: async function change(list) {
        const t = await sequelize.transaction()
        try {
            for(var i=0;i<list.length;i+=3) {
                await list[i].update(list[i+2], { where: list[i+1] }, { transaction: t })
            }
            await t.commit()
            return 200
        } catch(err) {
            await t.rollback()
            return err
        }
    },
    // 编辑, 用于子母表修改: [ model, [val] ], val为JSON
    update: async function update(list) {
        var w = {}
        if(Object.keys(list[1][0]).includes('id')) {
            w['id'] = list[1][0]['id']            
        } else {
            w['pn'] = list[1][0]['pn']
        }
        const t = await sequelize.transaction()
        try {
            for(var i=0;i<list.length;i+=2) {
                await list[i].destroy({ where: w }, { transaction: t })
                await list[i].bulkCreate(list[i+1], { transaction: t })
            }  
            await t.commit()
            return 200
        } catch(err) {
            await t.rollback()
            return err
        }
    },
    // 查找: [ model, where ], where为JSON
    select: async function select(list) {
        var r = {}
        for(var i=0;i<list.length;i+=2) {
            var val = await list[i].findAll({ where: list[i+1]=={} ? null : list[i+1], raw: true })
            r[list[i].name] = val
        }
        return r
    },
    // 调用存储过程: CALL stock;
    call: async function query(sql) {
        const query = await sequelize.query({ query: sql }, { raw: true, type: sequelize.QueryTypes.SELECT })
        return query[0]
    },
    // 单号: table_name
    orderid: async function orderid(obj) {
        var r = await obj.max('id')
        if(!r) { r = 0 }
        return r
    },
    departs,
    whs,
    partners,
    users,
    inventory,
    inventoryinfo,
    bom_m,
    bom_c,
    substitutes_m,
    substitutes_c,
    po_m,
    po_c,
    receipt_m,
    receipt_c,
    so_m,
    so_c,
    delivery_m,
    delivery_c,
    transfer_m,
    transfer_c,
    picklist_m,
    picklist_c,
    producewh_m,
    producewh_c,
    disassemb_m,
    disassemb_c,
    borrow_m,
    borrow_c,
    sbntrace
}