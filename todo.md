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
2. 修改出入库上级单据状态码对应的描述：待审核、待出库、已出库、已完结
3. 数据校验:edit-rules, 表体数字列检查
4. 可公用数据转移至default.vue中加载到vuex, 如仓库、库存、料号、合作商、省市县(仅采购/销售加载), 库存数据新增&查找时刷新
5. 单表页面设置全表搜索, 分页显示, partners users inventory inventoryinfo whs departs
6. admin帐号限制单点登录, 防止depart&wh, id前端生成冲突; 待办事项提醒
7. 单据查找; <https://vxetable.cn/v3/#/table/grid/edit>
8. 打印模板设置
9. 物料计划, 生成计划前使用CALL updatestatus更新BOM层级; 计划审核后自动生成相应单据
10. 库存使用redis, 数据结构 {仓库: {料号: 库存}}
11. 增加存储过程: 停用的物料在替代料中停用, 物料档案banEvent中触发
12. 拆解单审核后自动生成入库单
13. UI优化
14. 清除console.log

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
    3. 物料状态检查 ✓
    4. 编辑状态检查, 新增提示 ✓
    5. 增删改查, 删除前检查状态码
    6. 状态关联, 状态码
    7. 存储过程
  - 页面顺序
    1. partners ✓ 1 2 3 4 5
    2. departs ✓ 1 2 3 4 5
    3. users ✓ 1 2 3 4 5
    4. whs ✓ 1 2 3 4 5
    5. inventory ✓ 1 2 3 4 5
    6. inventoryinfo ✓ 1 2 3 4 5
    7. bom ✓ 1 2 3 4 5
    8. substitute ✓ 1 2 3 4 5
    9. po ✓ 1 2 3 4 5
    10. so ✓ 1 2 3 4 5
    11. borrow ✓ 1 2 3 4 5
    12. producewh ✓ 1 2 3 4 5
    13. picklist ✓ 1 2 3 4 5
    14. sbntrace ✓
    15. disassemb ✓ 1 2 3 4 5
    16. receipt
    17. delivery
    18. transfer

## app

### app_express

### uni-app

1. 溯源最近一条记录详细展示签收人信息, 其余点击展开时查询
