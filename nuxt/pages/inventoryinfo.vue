<template>
    <div>
        <vxe-toolbar>
          <template #buttons>
            <vxe-button icon="vxe-icon-square-plus" @click="insertEvent()">新增</vxe-button>
            <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" @keyup="searchEvent" clearable @clear="clearEvent"></vxe-input>
          </template>
        </vxe-toolbar>
        <vxe-table
            border
            stripe
            resizable
            show-overflow
            ref="xTable"
            height="680"
            :row-config="{isHover: true}"
            :data="tableList"
            @cell-dblclick="cellDBLClickEvent">
            <vxe-column field="pn" title="料号" width="120"></vxe-column>
            <vxe-column field="name" title="品名" width="200"></vxe-column>
            <vxe-column field="model" title="型号" width="120"></vxe-column>
            <vxe-column field="namedesc" title="品名描述" width="300"></vxe-column>
            <vxe-column field="manufact" title="厂家" width="200"></vxe-column>
            <vxe-column field="size" title="尺寸" width="150"></vxe-column>
            <vxe-column field="volume" title="体积" width="120"></vxe-column>
            <vxe-column field="netw" title="净重" width="80"></vxe-column>
            <vxe-column field="grossw" title="毛重" width="80"></vxe-column>
            <vxe-column field="created" title="创建人" show-overflow width="90"></vxe-column>
            <vxe-column field="createdat" title="创建时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="edited" title="编辑人" show-overflow width="90"></vxe-column>
            <vxe-column field="editedat" title="编辑时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="audited" title="审核人" show-overflow width="90"></vxe-column>
            <vxe-column field="auditedat" title="审核时间" :visible="false"></vxe-column>
        </vxe-table>

        <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="800" min-width="600" min-height="600" :loading="submitLoading" resize destroy-on-close>
            <template #default>
                <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="saveEvent">
                    <vxe-form-item title="基本信息" title-align="left" :title-width="200" :span="24" :title-prefix="{icon: 'vxe-icon-comment'}"></vxe-form-item>
                    <vxe-form-item field="pn" title="料号" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.pn" placeholder="请输入料号" :readonly="selectRow==null?false:true" @change="getInventoryInfo()"></vxe-input>
                    </template>
                    </vxe-form-item>
                    <vxe-form-item field="name" title="品名" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.name" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="model" title="型号" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.model" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="namedesc" title="品名描述" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.namedesc" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="size" title="尺寸" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.size" placeholder="单位cm, 例: 26*38*10" @change="getVolume()"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="volume" title="体积" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.volume" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="netw" title="净重" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.netw" placeholder="请输入净重, 单位kg"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="grossw" title="毛重" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.grossw" placeholder="请输入毛重, 单位kg"></vxe-input>
                        </template>
                    </vxe-form-item> 
                    <vxe-form-item :span="24">
                        <template #default="{}">
                            <div style="border-bottom: 1px lightgray solid "></div>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="created" title="创建人" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.created" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="createdat" title="创建时间" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.createdat" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="edited" title="编辑人" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.edited" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="editedat" title="编辑时间" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.editedat" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="audited" title="审核人" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.audited" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="auditedat" title="审核时间" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.auditedat" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item align="center" title-align="left" :span="24">
                        <template #default>
                            <vxe-button type="submit">提交</vxe-button>
                            <vxe-button @click="auditEvent()" :disabled="isEdit?false:true">{{auditBtn}}</vxe-button>
                            <vxe-button @click="deleteEvent()" :disabled="isEdit&&!formData.audited?false:true">删除</vxe-button>
                        </template>
                    </vxe-form-item>
                </vxe-form>
            </template>
        </vxe-modal>
    </div>

</template>

<script>
import XEUtils from 'xe-utils'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            tableData: [],
            tableList: [],
            formData: {
                pn: null,
                size: null,
                volume: null,
                netw: null,
                grossw: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null
            },
            formDataTemp: null,
            formRules: {
                pn: [
                    { required: true, message: '请输入料号' },
                    { min: 9, max: 9, message: '长度限制 9 个字符' }
                ],
                size: [
                    { required: true, message: '单位cm, 例: 26*38*10' },
                    {
                        validator ({ itemValue }) {                            
                            var pattern = /^[0-9]*\*[0-9]*\*[0-9]*$/ 
                            if(!pattern.test(itemValue)) {
                                return new Error('尺寸由数字和*组成')
                            }
                        }
                    }
                ],
                netw: [
                    { required: true, message: '请输入净重, 单位kg' }
                ],
                grossw: [
                    { required: true, message: '请输入毛重, 单位kg' }
                ]
            }, 
            selectRow: null,
            filterName: '',
            showEdit: false,
            departsList: [],
            submitLoading: false,
            isEdit: false
        }
    },
    computed: {
        ...mapState(['inventory']),
        auditBtn() {
            return this.formData.audited ? '弃审' : '审核'
        }  
    },
    mounted() {
        console.log(this.inventory)
        this.$axios({
            method: 'GET',
            url: '/api/inventoryinfo'
        }).then(res => {            
            var data
            res.data['inventoryinfo'].forEach(item => {
                data = Object.assign(item, { name: this.inventory[item.pn].name, model: this.inventory[item.pn].model, namedesc: this.inventory[item.pn].namedesc, manufact: this.inventory[item.pn].manufact })
                this.tableData.push(data)
            })
            this.tableList = this.tableData
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
    },
    methods : {
        insertEvent() {
            this.formData = {
                pn: null,
                name: null,
                model: null,
                namedesc: null,
                manufact: null,
                created: this.$store.state.user.name,
                createdat: new Date().toLocaleString('chinese', { hour12: false }),
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null,
                status: 0,
                deactivateat: null
            }                
            this.selectRow = null
            this.showEdit = true
            this.isEdit = false
        },
        cellDBLClickEvent({ row }) {
            this.formData = {
                pn: row.pn,
                size: row.size,
                volume: row.volume,
                netw: row.netw,
                grossw: row.grossw,
                created: row.created,
                createdat: row.createdat,
                edited: row.edited,
                editedat: row.editedat,
                audited: row.audited,
                auditedat: row.auditedat
            }            
            this.selectRow = row
            this.showEdit = true
            this.isEdit = true
            this.getInventoryInfo()
            this.formDataTemp = JSON.stringify(this.formData)
        },
        saveEvent(e) {
            var $table = this.$refs.xTable
            if(!this.valiteW()) { return }
            this.submitLoading = true
            if (this.selectRow) {
                if(this.formDataTemp==JSON.stringify(this.formData)) {
                    this.$message({ message: '数据未修改, 此次未提交'})
                    this.submitLoading = false
                    return
                }
                var w={ pn: null }, v, msg='保存成功'
                w['pn'] = this.formData['pn']                
                if(e!='auditEvent') {
                    this.formData.edited = this.$store.state.user.name
                    this.formData.editedat = new Date().toLocaleString('chinese', { hour12: false })
                } else if(e=='auditEvent') {
                    if(this.formData.audited) {
                        msg = '已审核'
                    } else {
                        msg = '已弃审'
                    }
                }
                v = JSON.parse(JSON.stringify(this.formData))
                delete v['pn']
                this.$axios({
                    method: 'PATCH',
                    url: '/api/inventoryinfo',
                    params: { w: w, v: v }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.isEdit = false
                        this.$message({ message: msg, type: 'success' })
                        Object.assign(this.selectRow, this.formData)
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else {
                this.tableData.forEach(item => {
                    if(this.formData.pn==item.pn) {
                        this.$message({ message: '料号重复', type: 'error' })
                        this.submitLoading = false
                        return
                    }
                })
                this.$axios({
                    method: 'POST',
                    url: '/api/inventoryinfo',
                    data: [this.formData]
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.$message({ message: '保存成功', type: 'success' })
                        $table.insert(this.formData)  
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            }
        },
        auditEvent() {
            if(this.formData.audited) {
                this.formData.audited = null
                this.formData.auditedat = null
            } else {
                if(this.formDataTemp!=JSON.stringify(this.formData)) {
                    this.$message({ message: '数据已修改, 请保存后审核', type: 'warning'})
                    return
                }
                this.formData.audited = this.$store.state.user.name
                this.formData.auditedat = new Date().toLocaleString('chinese', { hour12: false })
            }
            this.saveEvent('auditEvent')
        },
        deleteEvent() {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var k = { pn: null }
                k['pn'] = this.formData.pn
                this.$axios({
                    method: 'DELETE',
                    url: '/api/inventoryinfo',
                    params: k
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.$refs.xTable.remove(this.selectRow)
                        this.$message({ message: '删除成功', type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            })
        },
        getVolume() {
            if(this.formData.size) {
                var pattern = /^[0-9]*\*[0-9]*\*[0-9]*$/, v = 1, arr = this.formData.size.match(/[0-9]+/g)
                if(!pattern.test(this.formData.size)) {
                    return
                }
                arr.forEach(item => {
                    v = Number(item) * v
                }) 
                this.formData.volume = v / 1000000
            }
        },
        valiteW() {
            if(Number(this.formData.netw)>Number(this.formData.grossw)) {
                this.$message({ message: '毛重不得小于净重', type: 'error' })
                this.formData.grossw = null
                return false
            }
            return true
        },
        getInventoryInfo() {
            if(this.formData.pn.length==9) {
                var data=this.$refs.xTable.getTableData().tableData
                if(this.inventory[this.formData.pn]) {
                    this.formData.name = this.inventory[this.formData.pn].name
                    this.formData.model = this.inventory[this.formData.pn].model
                    this.formData.namedesc = this.inventory[this.formData.pn].namedesc
                } else {
                    this.formData.pn = null
                    this.formData.name = null
                    this.formData.model = null
                    this.formData.namedesc = null
                    this.$message({ message: '料号不存在, 请刷新后再试', type: 'warning' })
                }
                if(!this.isEdit) {
                    data.forEach(item => {
                        if(item.pn==this.formData.pn) {
                            this.formData.pn = null
                            this.formData.name = null
                            this.formData.model = null
                            this.formData.namedesc = null
                            this.$message({ message: '当前物料信息已存在', type: 'warning' })
                            return
                        }
                    })
                }
            } else {
                this.formData.name = null
                this.formData.model = null
                this.formData.namedesc = null
            }
        },
        searchEvent() {
            const filterName = XEUtils.toValueString(this.filterName).trim().toLowerCase()
            if (filterName) {
                const searchProps = ['pn', 'name', 'model', 'namedesc', 'manufact']
                const rest = this.tableData.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1))
                this.tableList = rest.map(row => {
                    return Object.assign({}, row)
                })
            } else {
                this.tableList = this.tableData
            }
        },
        clearEvent() {
            this.tableList = this.tableData
        },
        getName(row) {
            if(!row.pn) { return }
            if(this.inventory[row.pn]) {
                return this.inventory[row.pn].name
            } else {
                return null
            }
        },
        getModel(row) {
            if(!row.pn) { return }
            if(this.inventory[row.pn]) {
                return this.inventory[row.pn].model
            } else {
                return null
            }
        },
        getNamedesc(row) {
            if(!row.pn){ return }
            if(this.inventory[row.pn]) {
                return this.inventory[row.pn].namedesc
            } else {
                return null
            }
        },
        getManufact(row) {
            if(!row.pn){ return }
            if(this.inventory[row.pn]) {
                return this.inventory[row.pn].manufact
            } else {
                return null
            }
        }
    }
}
</script>

<style scoped>
.keyword-lighten {
    color: #000;
    background-color: #FFFF00;
}
</style>
