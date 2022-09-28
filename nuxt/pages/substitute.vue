<template>
    <div>
        <vxe-form :data="formData">
            <vxe-form-item :span="20">
                <template #default>
                    <vxe-button @click="insertEvent()">新增</vxe-button>
                    <vxe-button @click="saveEvent()" :disabled="ctrlDisabled.saveBtn">提交</vxe-button>
                    <vxe-button @click="editEvent()" :disabled="ctrlDisabled.editBtn">编辑</vxe-button>
                    <vxe-button @click="auditEvent()" :disabled="ctrlDisabled.auditBtn">{{auditBtn}}</vxe-button>
                    <vxe-button @click="deleteEvent()" :disabled="ctrlDisabled.deleteBtn">删除</vxe-button>                    
                </template>
            </vxe-form-item>
            <vxe-form-item :span="4">
                <template #default>
                    <vxe-input v-model="searchVal" placeholder="请输入料号" type="search" clearable @keydown="enterSearch($event)" @search-click="searchEvent()"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="料号" field="pn" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.pn" placeholder="请输入料号" @blur="getInfo()" clearable :class="{'readonly': mpnDisabled}"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="品名" field="name" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.name" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="型号" field="model" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.model" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="品名描述" field="namedesc" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.namedesc" readonly></vxe-input>
                </template>
            </vxe-form-item>
        </vxe-form>
        <div style="border:1px lightgray solid" :class="{ 'readonly': ctrlDisabled.table }">
            <vxe-toolbar style="padding-left:10px">
                <template #buttons>
                <vxe-button type="text" size="mini" icon="fa vxe-icon-add" @click="insertRowEvent()">新增</vxe-button>
                <vxe-button type="text" size="mini" icon="fa vxe-icon-delete" @click="$refs.xTable.removeCurrentRow()">删除</vxe-button>
                </template>
            </vxe-toolbar>
            <vxe-table
                border
                stripe
                resizable
                show-overflow
                ref="xTable"
                height="700"
                header-align="center"
                :row-config="{isHover: true, isCurrent: true, useKey: true}"
                :data="tableData"
                :edit-config="{trigger: 'click', mode: 'row'}"
                @cell-dblclick="cellDBLClickEvent">
                <vxe-table-column width="60">
                    <template v-slot>
                        <span class="drag-btn"><i class="vxe-icon-menu"></i></span>
                    </template>
                    <template v-slot:header>
                        <vxe-tooltip content="按住后可以上下拖动排序。双击行修改状态"><i class="vxe-icon-question"></i></vxe-tooltip>
                    </template>
                </vxe-table-column>
                <vxe-column type="seq" title="优先级" width="80"></vxe-column>
                <vxe-column field="substitutes" title="料号" :edit-render="{name: 'input', props: {type: 'text' }}" width="120"></vxe-column>
                <vxe-column field="prop" title="替代率" :edit-render="{name: 'input', props: {type: 'number'}}" width="120"></vxe-column>
                <vxe-column field="name" title="品名" width="200">
                    <template #default="{ row }">
                        <span>{{ getName(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="model" title="型号" width="120">
                    <template #default="{ row }">
                        <span>{{ getModel(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="namedesc" title="品名描述" width="300">
                    <template #default="{ row }">
                        <span>{{ getNamedesc(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="manufact" title="厂家" width="200">
                    <template #default="{ row }">
                        <span>{{ getManufact(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="status" title="状态" formatter="formatStatus" show-overflow width="60"></vxe-column>
                <vxe-column field="deactivateat" title="停用时间" width="200"></vxe-column>
            </vxe-table>
        </div>
        <vxe-form :data="formData">
            <vxe-form-item field="created" title="创建人" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.created" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="createdat" title="创建时间" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.createdat" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="edited" title="编辑人" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.edited" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="editedat" title="编辑时间" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.editedat" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="audited" title="审核人" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.audited" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="auditedat" title="审核时间" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.auditedat" readonly></vxe-input>
                </template>
            </vxe-form-item>
        </vxe-form>
    </div>

</template>

<script>
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            showHelpTip1: false,
            formData: {
                pn: null,
                name: null,
                model: null,
                namedesc: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null
            },
            dataTemp: null,
            tableData: [],
            isEdit: false,
            mpnDisabled: true,
            mpnList: [],
            searchVal: '',
            ctrlDisabled: {
                saveBtn: true,
                auditBtn: true,
                deleteBtn: true,
                editBtn: true,
                table: true
            }
            
        }
    },
    computed: {
        ...mapState(['inventory']),
        auditBtn() {
            return this.formData.audited ? '弃审' : '审核'
        }
    },
    mounted() {
        this.rowDrop()
    },
    methods : {
        enterSearch($event) {
            if($event.$event.key=='Enter') { 
                this.searchEvent()
            }
        },
        searchEvent() {
            if(this.inventory[this.searchVal]) {
                this.submitLoading = true
                this.$axios({
                    method: 'GET',
                    url: '/api/substitute',
                    params: { pn: this.searchVal }
                }).then(res => {
                    if(res.data['substitutes_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    this.submitLoading = false
                    this.formData = res.data['substitutes_m'][0]
                    this.formData.name=this.inventory[this.formData.pn]['name']
                    this.formData.model=this.inventory[this.formData.pn]['model']
                    this.formData.namedesc=this.inventory[this.formData.pn]['namedesc']
                    this.tableData = res.data['substitutes_c']
                    this.ctrlDisabled.saveBtn = true
                    this.ctrlDisabled.auditBtn = false
                    this.ctrlDisabled.table = true
                    if(this.formData.audited) {
                        this.ctrlDisabled.deleteBtn = true
                        this.ctrlDisabled.editBtn = true               
                    } else {                        
                        this.ctrlDisabled.deleteBtn = false
                        this.ctrlDisabled.editBtn = false 
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else {
                this.$message({ message: '料号不存在', type: 'error' })
            }
        },
        async insertEvent() {
            this.submitLoading = true
            this.$axios({
                method: 'GET',
                url: '/api/substitute',
            }).then(res => {
                this.mpnList = []
                res.data['substitutes_m'].forEach(item => {
                    this.mpnList.push(item.pn)
                })
            }).catch(err => {
                this.submitLoading = false
                this.$message({ message: err, type: 'error' })
            })
            if(this.isEdit){
                const confirmRes = await this.$confirm(
                    '当前单据未保存, 是否继续?',
                    '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }
                ).catch(() => this.$message.info('已经取消新增'))
                if(confirmRes!=='confirm') {
                    return
                }
            }
            this.mpnDisabled = false
            this.$nuxt.$emit('btnCtrl', 'add', res => {
                this.ctrlDisabled = res
            })
            this.formData = {
                pn: null,
                name: null,
                model: null,
                namedesc: null,
                created: this.$store.state.user.name,
                createdat: new Date().toLocaleString('chinese', { hour12: false }),
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null
            }
            this.$refs.xTable.remove()
            for(var i=0;i<10;i++) {
                this.$refs.xTable.insert({status: true})
            }            
        },
        editEvent() {
            this.isEdit = true
            this.mpnDisabled = true
            this.dataTemp = JSON.stringify(this.getData())
            this.$nuxt.$emit('btnCtrl', 'edit', res => {
                this.ctrlDisabled = res
            })
        },
        deleteEvent() {
            var btnStatus = this.ctrlDisabled
            this.$nuxt.$emit('btnCtrl', 'delete', res => {
                this.ctrlDisabled = res
            })
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submitLoading = true
                this.$axios({
                    method: 'DELETE',
                    url: '/api/substitute',
                    params: { pn: this.formData.pn }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.isEdit = false
                        this.formData = {
                            pn: null,
                            name: null,
                            model: null,
                            namedesc: null,
                            created: null,
                            createdat: null,
                            edited: null,
                            editedat: null,
                            audited: null,
                            auditedat: null
                        }
                        this.$refs.xTable.remove()
                        this.$message({ message: '删除成功', type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                        this.ctrlDisabled = btnStatus
                    }
                }).catch(err => {
                    this.ctrlDisabled = btnStatus
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            }).catch(() => {
                this.ctrlDisabled = btnStatus
            })
        },
        auditEvent() {
            var btnStatus = this.ctrlDisabled
            this.$nuxt.$emit('btnCtrl', this.formData.audited ? 'unaudit' : 'audit', res => {
                this.ctrlDisabled = res
            })
            var audited=this.$store.state.user.name, auditedat=new Date().toLocaleString('chinese', { hour12: false }), msg='审核成功'
            if(this.formData.audited) {
                audited = null
                auditedat = null
                msg = '弃审成功'
            }
            var data = { w: { id: this.formData.id }, v: { audited: audited, auditedat: auditedat } }
            this.submitLoading = true
            this.$axios({
                method: 'PATCH',
                url: '/api/substitute',
                params: data
            }).then(res => {
                this.submitLoading = false
                if(res.data=='OK') {
                    this.$message({ message: msg, type: 'success' })
                    this.formData.audited = audited
                    this.formData.auditedat = auditedat
                } else {
                    this.$message({ message: res.data, type: 'error' })
                    this.ctrlDisabled = btnStatus
                }
            }).catch(err => {
                this.ctrlDisabled = btnStatus
                this.submitLoading = false
                this.$message({ message: err, type: 'error' })
            })
        },
        saveEvent() {
            var data = this.getData()
            var btnStatus = this.ctrlDisabled, mpnStatus = this.mpnDisabled            
            if(!data) { return }
            this.mpnDisabled = true
            this.$nuxt.$emit('btnCtrl', 'save', res => {
                this.ctrlDisabled = res
            })
            this.submitLoading = true
            if(this.isEdit) {
                if(this.dataTemp==JSON.stringify(data)) {
                    this.$message({ message: '数据未修改, 此次未提交'})
                    return
                }
                this.formData.edited = this.$store.state.user.name
                this.formData.editedat = new Date().toLocaleString('chinese', { hour12: false })
                this.$axios({
                    method: 'PUT',
                    url: '/api/substitute',
                    data: data
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.$message({ message: '保存成功', type: 'success' })
                        this.isEdit = false
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                        this.ctrlDisabled = btnStatus
                    }
                }).catch(err => {
                    this.ctrlDisabled = btnStatus
                    this.mpnDisabled = mpnStatus
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else {
                this.$axios({
                    method: 'POST',
                    url: '/api/substitute',
                    data: data
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.$message({ message: '保存成功', type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                        this.ctrlDisabled = btnStatus
                    }
                }).catch(err => {
                    this.ctrlDisabled = btnStatus
                    this.mpnDisabled = mpnStatus
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            }
        },
        getData() {
            var res=[[this.formData]], t=[], t1={pn: this.formData.pn}, r={}, tableData=this.$refs.xTable.getTableData().tableData
            for(var i=0;i<tableData.length;i++) {
                if(tableData[i].substitutes && tableData[i].prop>0) {     
                    r={}
                    t.push(Object.assign(r, t1, {priority: i+1}, tableData[i]))
                    console.log(t)
                } else if(tableData[i].substitutes && !tableData[i].prop || tableData[i].substitutes && tableData[i].prop<=0) {
                    this.$message({ message: tableData[i].substitutes + '未填写有效替代率', type: 'error' })
                    return
                }
            }
            if(t.length==0) {
                this.$message({ message: '未填写替代料', type: 'error' })
                return
            }
            res.push(t)
            return res
        },
        cellDBLClickEvent({ row }) {
            row.status=!row.status
            if(row.status) {
                row.deactivateat = null                
            } else {
                row.deactivateat = new Date().toLocaleString('chinese', { hour12: false })
            }
        },
        getInfo() {
            if(!this.formData.pn) { return }
            if(!this.inventory[this.formData.pn]) {
                this.formData.pn = null
                this.$message({ message: '料号不存在', type: 'error' })
                return
            }
            if(this.mpnList.indexOf(this.formData.pn) > -1){
                this.formData.pn = null
                this.$message({ message: '当前料号已存在替代料', type: 'error' })
                return              
            }
            this.formData.name = this.inventory[this.formData.pn].name
            this.formData.model = this.inventory[this.formData.pn].model
            this.formData.namedesc = this.inventory[this.formData.pn].namedesc
        },
        getName(row) {
            if(!row.substitutes) { return }
            if(this.inventory[row.substitutes]) {
                var records = this.$refs.xTable.getTableData().tableData
                for(var i=0;i<records.length;i++) {
                    if(!records[i].substitutes || row._X_ROW_KEY==records[i]._X_ROW_KEY) {continue}
                    if(records[i].substitutes==this.formData.pn) {
                        this.$message({ message: '替代料与主料号重复', type: 'warning' })
                        records[i].substitutes = null
                        records[i].prop = null
                        return
                    }
                    if(row.substitutes==records[i].substitutes) {
                        this.$message({ message: '重复添加', type: 'warning' })
                        records[i].substitutes = null
                        records[i].prop = null
                        return
                    }                  
                }
                return this.inventory[row.substitutes].name
            } else {
                this.$message({ message: '料号不存在, 请刷新页面再试', type: 'warning' })
                row.prop = null
                row.substitutes = null
                return
            }
        },
        getModel(row) {
            if(!row.substitutes) { return }
            if(this.inventory[row.substitutes]) {
                return this.inventory[row.substitutes].model
            } else {
                return null
            }
        },
        getNamedesc(row) {
            if(!row.substitutes){ return }
            if(this.inventory[row.substitutes]) {
                return this.inventory[row.substitutes].namedesc
            } else {
                return null
            }
        },
        getManufact(row) {
            if(!row.substitutes){ return }
            if(this.inventory[row.substitutes]) {
                return this.inventory[row.substitutes].manufact
            } else {
                return null
            }
        },
        rowDrop() {
            this.$nextTick(() => {
                const xTable = this.$refs.xTable
                this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
                    handle: '.drag-btn',
                    onEnd: ({ newIndex, oldIndex }) => {
                        var tableData = this.$refs.xTable.getTableData().tableData
                        tableData.splice(newIndex, 1, ...tableData.splice(oldIndex, 1, tableData[newIndex]))
                        xTable.reloadData(tableData)
                    }
                })
            })
        },
        insertRowEvent() {
            this.$refs.xTable.insertAt({status: true},-1)
        }
    }
}
</script>
