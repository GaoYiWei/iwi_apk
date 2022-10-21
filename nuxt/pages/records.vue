<template>
    <div>
        <vxe-form :data="formData" :rules="formRules" @submit="searchEvent">
            <vxe-form-item title="分类" field="cat" :item-render="{}">
                <template #default="{ data }">
                    <vxe-select v-model="data.cat">
                        <vxe-option value="采购" label="采购"></vxe-option>
                        <vxe-option value="销售" label="销售"></vxe-option>
                        <vxe-option value="入库" label="入库"></vxe-option>
                        <vxe-option value="出库" label="出库"></vxe-option>
                        <vxe-option value="领料" label="领料"></vxe-option>
                        <vxe-option value="生产入库" label="生产入库"></vxe-option>
                        <vxe-option value="拆解" label="拆解"></vxe-option>
                        <vxe-option value="借用" label="借用"></vxe-option>
                        <vxe-option value="调拨" label="调拨"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-form-item>
            <vxe-form-item title="单号" field="id" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.id"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="料号" field="pn" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.pn"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="制单" field="creator" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.creator"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="起始时间" field="startat"  :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.startat" type="date"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="截止时间" field="endat"  :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.endat" type="date"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item>
                <template #default>
                    <vxe-button type="submit">提交</vxe-button>
                </template>
            </vxe-form-item>
        </vxe-form>
        <vxe-grid v-bind="gridOptions"  @cell-click="getEditRecord"></vxe-grid>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            formData: {
                id: null,
                cat: null,
                pn: null,
                creator: null,
                startat: null,
                endat: null
            },
            formRules: {
                cat: [
                    { required: true, message: '请选择单据类型' }
                ]
            },
            gridOptions: {
                border: true,
                resizable: true,
                height: 800,
                data: [],
                columns: []
            }
        }
    },
    computed: {
        ...mapState(['inventory'])
    },
    mounted() {
    },
    methods : {
        searchEvent() {
            if(this.formData.id){
                if(Number(this.formData.id)) {
                    this.formData.id = (Array(10).join(0) + Number(this.formData.id)).slice(-10)
                } else {
                    this.$message({ message: '单号错误', type: 'warning' })
                    return
                }
            }
            if(this.formData.pn && !this.inventory[this.formData.pn]) {
                this.$message({ message: '料号不存在', type: 'warning' })
                this.formData.pn = null
                return
            }
            this.submitLoading = true
            var sql=' WHERE 1=1', columns = [
                { type: 'seq', width: 60 },
                { field: 'id', title: 'id' },
                { field: 'created', title: '创建人' },
                { field: 'createdat', title: '创建时间' },
                { field: 'audited', title: '审核人' },
                { field: 'auditedat', title: '审核时间' },
                { field: 'pn', title: '料号' },
                { field: 'qty', title: '数量' }
            ]
            if(this.formData.cat=='采购') {
                sql = 'SELECT po_c.id, contract, vendor, cat, cnee, tel, addr, created, createdat, audited, auditedat, pn, qty FROM po_c LEFT JOIN po_m ON po_c.id=po_m.id' + sql
                columns = [
                    { type: 'seq', width: 60 },
                    { field: 'id', title: 'id' },
                    { field: 'contract', title: '合同' },
                    { field: 'vendor', title: '供应商' },
                    { field: 'cat', title: '分类' },
                    { field: 'cnee', title: '收货人' },
                    { field: 'tel', title: '电话' },
                    { field: 'addr', title: '地址' },
                    { field: 'created', title: '创建人' },
                    { field: 'createdat', title: '创建时间' },
                    { field: 'pn', title: '料号' },
                    { field: 'qty', title: '数量' }
                ]
            } else if(this.formData.cat=='销售') {
                sql = 'SELECT so_c.id, contract, buyer, cat, cnee, tel, addr, created, createdat, audited, auditedat, pn, qty FROM so_c LEFT JOIN so_m ON so_c.id=so_m.id' + sql
                columns = [
                    { type: 'seq', width: 60 },
                    { field: 'id', title: 'id' },
                    { field: 'contract', title: '合同' },
                    { field: 'buyer', title: '客户' },
                    { field: 'cat', title: '分类' },
                    { field: 'cnee', title: '收货人' },
                    { field: 'tel', title: '电话' },
                    { field: 'addr', title: '地址' },
                    { field: 'created', title: '创建人' },
                    { field: 'createdat', title: '创建时间' },
                    { field: 'pn', title: '料号' },
                    { field: 'qty', title: '数量' }
                ]
            } else if(this.formData.cat=='入库') {
                sql = 'SELECT receipt_c.id, created, createdat, audited, auditedat, pn, qty FROM receipt_c LEFT JOIN receipt_m ON receipt_c.id=receipt_m.id' + sql
            } else if(this.formData.cat=='出库') {
                sql = 'SELECT delivery_c.id, created, createdat, audited, auditedat, pn, qty FROM delivery_c LEFT JOIN delivery_m ON delivery_c.id=delivery_m.id' + sql
            } else if(this.formData.cat=='领料') {
                sql = 'SELECT picklist_c.id, created, createdat, audited, auditedat, pn, qty FROM picklist_c LEFT JOIN picklist_m ON picklist_c.id=picklist_m.id' + sql
            } else if(this.formData.cat=='生产入库') {
                sql = 'SELECT producewh_c.id, created, createdat, audited, auditedat, pn, qty FROM producewh_c LEFT JOIN producewh_m ON producewh_c.id=producewh_m.id' + sql
            } else if(this.formData.cat=='拆解') {
                sql = 'SELECT disassemb_c.id, created, createdat, audited, auditedat, pn, qty FROM disassemb_c LEFT JOIN disassemb_m ON disassemb_c.id=disassemb_m.id' + sql
            } else if(this.formData.cat=='借用') {
                sql = 'SELECT borrow_c.id, created, createdat, audited, auditedat, pn, qty FROM borrow_c LEFT JOIN borrow_m ON borrow_c.id=borrow_m.id' + sql
            } else if(this.formData.cat=='调拨') {
                sql = 'SELECT transfer_c.id, created, createdat, audited, auditedat, pn, qty FROM transfer_c LEFT JOIN transfer_m ON transfer_c.id=transfer_m.id' + sql
            }
            if(this.formData.id) {
                if(this.formData.cat=='采购') {
                    sql = sql + ' AND po_c.id="' + this.formData.id  + '"'
                } else if(this.formData.cat=='销售') {
                    sql = sql + ' AND so_c.id="' + this.formData.id  + '"'
                } else if(this.formData.cat=='入库') {
                    sql = sql + ' AND receipt_c.id="' + this.formData.id + '"'
                } else if(this.formData.cat=='出库') {
                    sql = sql + ' AND delivery_c.id="' + this.formData.id + '"'
                } else if(this.formData.cat=='领料') {
                    sql = sql + ' AND picklist_c.id="' + this.formData.id + '"'
                } else if(this.formData.cat=='生产入库') {
                    sql = sql + ' AND producewh_c.id="' + this.formData.id + '"'
                } else if(this.formData.cat=='拆解') {
                    sql = sql + ' AND disassemb_c.id="' + this.formData.id + '"'
                } else if(this.formData.cat=='借用') {
                    sql = sql + ' AND borrow_c.id="' + this.formData.id + '"'
                } else if(this.formData.cat=='调拨') {
                    sql = sql + ' AND transfer_c.id="' + this.formData.id + '"'
                } 
            }
            if(this.formData.pn) {
                sql = sql + ' AND pn="' + this.formData.pn + '"'
            }
            if(this.formData.creator) {
                sql = sql + ' AND created=' + this.formData.creator
            }
            if(this.formData.startat && this.formData.endat) {
                var t = new Date(this.formData.endat)
                sql = sql + ' AND createdat BETWEEN "' + this.formData.startat + '" AND "' +  new Date(t.setDate(t.getDate()+1)).toLocaleDateString() + '"'
            } else if(this.formData.startat && !this.formData.endat) {
                var t = new Date(this.formData.endat)
                sql = sql + ' AND createdat>"' + this.formData.startat + '"'
            }else if(!this.formData.startat && this.formData.endat) {
                var t = new Date(this.formData.endat)
                sql = sql + ' AND createdat<"' + new Date(t.setDate(t.getDate()+1)).toLocaleDateString() + '"'
            }
            this.$axios({
                method: 'GET',
                url: '/api/call',
                params: { proc: 'CALLGETRECORD' + sql }
            }).then(res => {
                this.gridOptions.data = res.data
                this.gridOptions.columns = columns
                this.submitLoading = false
            }).catch(err => {
                this.submitLoading = false
                this.$message({ message: err, type: 'error' })
            })
        },
        getEditRecord({ row }) {
            if(this.formData.cat=='采购') {
                window.open('/po?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='销售') {
                window.open('/so?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='入库') {
                window.open('/receipt?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='出库') {
                window.open('/delivery?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='领料') {
                window.open('/picklist?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='生产入库') {
                window.open('/producewh?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='拆解') {
                window.open('/disassemb?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='借用') {
                window.open('/borrow?id=' + row.id, '_blank').focus()
            } else if(this.formData.cat=='调拨') {
                window.open('/transfer?id=' + row.id, '_blank').focus()
            }
        }
    }
}
</script>
