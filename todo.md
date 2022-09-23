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

1. 顶部导航栏添加当前表单名
2. 单表页面设置全表搜索, partners users inventory inventoryinfo whs departs
3. 检查page中加载项, 常用数据转移至default.vue中加载
4. default.vue中设施按钮禁用逻辑
5. 项目打包前清除所有console.log
6. admin帐号限制一点登录, 防止depart/wh, id前端生成冲突
7. 单据查找; <https://vxetable.cn/v3/#/table/grid/edit>
8. 打印模板设置
9. 物料计划
10. 当前入库单上级单据整单入库, 允许拆分入库

- 权限

| 页面    | 操作       | 用户       |
| ------- | --------- | ---------- |
| partners/users/inventory/inventoryinfo/whs/departs     | CRUD  | admin |
| others     | R  | all users |
| others     | CU  | depart users |
| others     | D  | creator |

- 测试

1. 函数冗余
2. 增删改查
3. 状态关联

## app

### app_express

### uni-app

1. 溯源最近一条记录详细展示签收人信息, 其余点击展开时查询
