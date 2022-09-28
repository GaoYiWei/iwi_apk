# ALL

## web

### web_express

### nuxt

- 页面

1. delivery
2. receipt
3. transfer
4. disassemb

- 功能

1. 顶部导航栏添加当前表单名 ✓
2. 可公用数据转移至default.vue中加载vuex, 如仓库数据、库存数据, 库存数据新增&查找时刷新
3. 单表页面设置全表搜索, partners users inventory inventoryinfo whs departs
4. 项目打包前清除所有console.log
5. admin帐号限制一点登录, 防止depart&wh, id前端生成冲突
6. 单据查找; <https://vxetable.cn/v3/#/table/grid/edit>
7. 打印模板设置
8. 物料计划
9. 库存使用redis, 数据结构 {仓库: {料号: 库存}}

- 权限

| 页面    | 操作       | 用户       |
| ------- | --------- | ---------- |
| partners/users/inventory/inventoryinfo/whs/departs     | CRUD  | admin |
| others     | R  | all users |
| others     | CU  | depart users |
| others     | D  | creator |

- 测试
  - 检查项
    1. 函数冗余
    2. 完善res.data!='OK'情况 ✓
    3. 编辑状态检查, 新增提示
    4. 增删改查, 删除前检查状态码
    5. 状态关联, 状态码
    6. 存储过程
  - 页面顺序
    1. partners ✓ 1 2 3 4 5
    2. departs ✓ 1 2 3 4 5
    3. users ✓ 1 2 3 4 5
    4. whs ✓ 1 2 3 4 5
    5. inventory
    6. inventoryinfo
    7. bom
    8. substitute
    9. po
    10. so
    11. borrow
    12. producewh
    13. picklist
    14. receipt
    15. delivery
    16. transfer
    17. disassemb
    18. sbntrace

## app

### app_express

### uni-app

1. 溯源最近一条记录详细展示签收人信息, 其余点击展开时查询
