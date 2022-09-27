# web端
<!-- TOC -->

- [web端](#web端)
  - [环境](#环境)
  - [业务逻辑](#业务逻辑)
  - [编码](#编码)
  - [初始化](#初始化)
    - [数据库](#数据库)
    - [打包nuxt](#打包nuxt)

<!-- /TOC -->

## 环境

1. MySQL & redis & nodejs

## 业务逻辑

1. 入库单: 采购入库可分批, 其余认定一次性入库
2. 出库单: 销售出库可分批, 其余认定一次性出库

## 编码

1. 料号：9位，字母/数字
2. 部门: 3位, 1位一级部门 + 2位二级部门
3. 仓库：4位，字母/数字
4. 序号/批号：18位, 9位料号+4位年周+4位流水+1位序号/批次符, 1序号 & 0批次
5. 单号：10位，redis生成
6. 基础表状态：
    0停用
    1可用
    -1可用, 已引用
    null停用, 已引用
7. 单据表状态:
    0待审核
    1已审, 待仓库操作
    -1已审, 仓库已完成相应操作
    null已审, 仓库完成部分操作  

## 初始化

### 数据库

1. 创建MySQL数据库及用户, 在express/db/mysql.js第4、22行修改数据库连接配置, 第1056行修改初始用户信息
2. 创建redis数据库及用户, 在express/db/redis.js第2行修改数据库连接配置
3. 注释express/bin/www.js第14~87行, 取消注释express/db/mysql.js第1019~1024行
4. 根据需要在express/db/mysql.js第1020行修改admin信息
5. express文件夹下运行node ./bin/www同步表, 结束运行

    ```shell
    node ./bin/www
    ```

6. 注释express/db/mysql.js第1055~1060行取消同步, express/bin/www.js第14~87行取消注释
7. 创建存储过程, 根据需要修改DEFINER(需具有创建存储过程权限)
   - 获取采购未入库数量

    ```sql
    CREATE DEFINER=`sa`@`%` PROCEDURE `pounshiped`(in id varchar(10))
    BEGIN
            SELECT p.pn, p.qty-IFNULL(d.delivery,0) AS todelivery FROM
            (SELECT pn, qty FROM `po_c` WHERE id=id) AS p LEFT JOIN 
            (SELECT pn, SUM(qty) AS delivery FROM `receipt_c` WHERE id IN (SELECT id FROM `receipt_m` WHERE superiorid=id AND cat='采购入库')) AS d 
            ON p.pn=d.pn;
    END
    ```

   - 获取销售未出库数量

    ```sql
    CREATE DEFINER=`sa`@`%` PROCEDURE `sounshiped`(in orderid varchar(10))
    BEGIN
            SELECT p.created,p.createdat,mcomment,ccomment,p.pn, p.qty-IFNULL(d.delivery,0) AS qty FROM
            (SELECT created,createdat,`so_m`.comment AS mcomment,`so_c`.comment AS ccomment,pn, qty FROM `so_c` LEFT JOIN `so_m` ON `so_c`.id=`so_m`.id WHERE `so_m`.id=orderid) AS p LEFT JOIN 
            (SELECT pn, SUM(qty) AS delivery FROM `delivery_c` WHERE id IN (SELECT id FROM `delivery_m` WHERE superiorid=orderid AND cat='销售出库')) AS d 
            ON p.pn=d.pn 
            WHERE p.qty>IFNULL(d.delivery,0);
    END
    ```

    - 获取库存

    ```sql
    CREATE DEFINER=`sa`@`%` PROCEDURE `getstock`()
    BEGIN 
        DROP TABLE IF EXISTS stock;
        CREATE TEMPORARY TABLE stock(SELECT i.wh,i.pn,i.name,i.model,i.namedesc,IFNULL(inwh.inwh,0) - IFNULL(outwh.outwh,0) AS stock FROM (SELECT whs.id AS whid,whs.name AS wh,pn,inventory.name,model,namedesc FROM inventory CROSS JOIN whs WHERE whs.status=1) AS i LEFT JOIN (SELECT pn,wh,SUM(qty) AS inwh FROM receipt_c LEFT JOIN receipt_m ON receipt_c.id = receipt_m.id WHERE receipt_m.audited IS NOT NULL GROUP BY wh,pn) AS inwh ON i.pn = inwh.pn AND i.wh = inwh.wh LEFT JOIN (SELECT pn,wh,SUM(qty) AS outwh FROM delivery_c LEFT JOIN delivery_m ON delivery_c.id = delivery_m.id WHERE delivery_m.audited IS NOT NULL GROUP BY wh,pn) AS outwh ON i.pn = outwh.pn AND i.wh = outwh.wh);
        DROP TABLE IF EXISTS toin;
        CREATE TEMPORARY TABLE toin(SELECT pn,wh,SUM(qty) AS inwh FROM receipt_c LEFT JOIN receipt_m ON receipt_c.id = receipt_m.id WHERE receipt_m.audited IS NULL GROUP BY wh,pn);
        DROP TABLE IF EXISTS toout;
        CREATE TEMPORARY TABLE toout(SELECT pn,wh,SUM(qty) AS outwh FROM delivery_c LEFT JOIN delivery_m ON delivery_c.id = delivery_m.id WHERE delivery_m.audited IS NULL GROUP BY wh,pn);
        SELECT s.wh,s.pn,s.name,s.model,s.namedesc,s.stock,IFNULL(inwh,0) AS inwh,IFNULL(outwh,0) AS outwh FROM stock AS s LEFT JOIN toin ON s.wh = toin.wh AND s.pn = toin.pn LEFT JOIN toout ON s.wh = toout.wh AND s.pn = toout.pn ORDER BY s.wh,s.pn;
    END
    ```

    - 获取BOM层级

    ```sql
    CREATE DEFINER=`sa`@`%` PROCEDURE `updatebomlevel`()
    BEGIN
            SET @j = 0;
            UPDATE `bom_m` SET `level` = -1;
            UPDATE `bom_m` SET `level` = @j WHERE `bom_m`.`pn` NOT IN (SELECT `cpn` FROM `bom_c`);
            SET @i = row_count();
        WHILE @i <> 0 DO
                DROP TABLE IF EXISTS temp_level;
                CREATE TEMPORARY TABLE temp_level SELECT `bom_m`.`pn` FROM `bom_m` WHERE `bom_m`.`pn` IN (SELECT `cpn` FROM `bom_c` LEFT JOIN `bom_m` ON `bom_m`.`pn` = `bom_c`.`pn` WHERE `level` = @j);
                UPDATE `bom_m` SET `level` = @j + 1 WHERE `bom_m`.pn IN (SELECT pn FROM temp_level);
                SET @i = row_count();
                SET @j = @j + 1;
        END WHILE;
    END
    ```

    - 更新物料使用状态

    ```sql
    CREATE DEFINER=`sa`@`%` PROCEDURE `updatepnstatus`()
    BEGIN
            DROP TABLE IF EXISTS usedpn;
            CREATE TEMPORARY TABLE usedpn(
                    SELECT pn FROM (SELECT pn FROM `bom_c` UNION ALL SELECT pn FROM `borrow_c` UNION ALL SELECT pn FROM `delivery_c` UNION ALL SELECT pn FROM `picklist_c` UNION ALL SELECT pn FROM `po_c` UNION ALL SELECT pn FROM `producewh_c` UNION ALL SELECT pn FROM `receipt_c` UNION ALL SELECT pn FROM `so_c` UNION ALL SELECT substitutes FROM `substitutes_c` UNION ALL SELECT pn FROM `substitutes_c`) AS allpn);
            UPDATE inventory SET status = -1 WHERE status = 1 AND pn IN (SELECT pn FROM usedpn);
            UPDATE inventory SET status = null WHERE status = 0 AND pn IN (SELECT pn FROM usedpn);
    END
    ```

   - 查库存

### 打包nuxt

``` shell
npm i
npm run generate 
```