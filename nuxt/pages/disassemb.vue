<template>
    <div>
        <vxe-toolbar>
            <template #buttons>
                <vxe-button @click="insertEvent()">新增</vxe-button>
                <vxe-button @click="saveEvent()" :disabled="ctrlDisabled.saveBtn">提交</vxe-button>
                <vxe-button @click="editEvent()" :disabled="ctrlDisabled.editBtn">编辑</vxe-button>
                <vxe-button @click="auditEvent()" :disabled="formData.delivered?true:ctrlDisabled.auditBtn">{{auditBtn}}</vxe-button>
                <vxe-button @click="deleteEvent()" :disabled="ctrlDisabled.deleteBtn">删除</vxe-button>
                <vxe-input style="position:absolute;right:1rem;" v-model="searchVal" placeholder="请输入单号" type="search" clearable @keydown="enterSearch($event)" @search-click="searchEvent()"></vxe-input>
            </template>
        </vxe-toolbar>
        <vxe-form :class="{ 'readonly': ctrlDisabled.table }" :data="formData" :rules="formRules" ref="disassembForm">
            <vxe-form-item title="单号" field="id" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.id" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="序列" field="sbn" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.sbn" @change="getInfo('sbnInput')"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="料号" :item-render="{}">
                <template #default="{}">
                    <vxe-input v-model="info.pn" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="品名" :item-render="{}">
                <template #default="{}">
                    <vxe-input v-model="info.name" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="型号" :item-render="{}">
                <template #default="{}">
                    <vxe-input v-model="info.model" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="品名描述" :item-render="{}">
                <template #default="{}">
                    <vxe-input v-model="info.namedesc" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="备注" field="comment" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.comment"></vxe-input>
                </template>
            </vxe-form-item>
        </vxe-form>
        <div style="border:1px lightgray solid" :class="{ 'readonly': ctrlDisabled.table }">
            <vxe-table
                border
                stripe
                resizable
                show-overflow
                ref="xTable"
                height="660"
                header-align="center"
                :row-config="{isHover: true, isCurrent: true, useKey: true}"
                :data="tableData"
                :edit-config="{trigger: 'click', mode: 'cell', activeMethod: activeCellMethod}">
                <vxe-column type="seq" title="序号" width="80"></vxe-column>
                <vxe-column field="wh" title="仓库" :edit-render="{}" width="120">
                    <template #edit="{ row }">
                        <vxe-select v-model="row.wh" type="text">
                            <vxe-option v-for="(item, index) in whList" :value="item" :label="item" :key="row.pn+index"></vxe-option>
                        </vxe-select>
                    </template>
                </vxe-column>
                <vxe-column field="pn" title="料号" :edit-render="{name: 'input', props: {type: 'text' }}" width="120"></vxe-column>
                <vxe-column field="qty" title="数量" :edit-render="{name: 'input', props: {type: 'number'}}" width="120"></vxe-column>
                <vxe-column field="comment" title="备注" :edit-render="{name: 'input', props: {type: 'text'}}" width="200"></vxe-column>
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
import { mapState } from 'vuex'
export default {
    data() {
        return {
            whList: [],
            formData: {
                id: null,
                sbn: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null,
                comment: null
            },
            formRules: {
                sbn: [
                    { required: true, message: '请输入序列/批次' }
                ]
            },
            info: {
                pn: null,
                name: null,
                model: null,
                namedesc: null
            },
            dataTemp: null,
            tableData: [],
            bomList: [],
            isEdit: false,
            searchVal: '',
            ctrlDisabled: {
                saveBtn: true,
                auditBtn: true,
                deleteBtn: true,
                editBtn: true,
                table: true
            },
            isInsert: false
        }
    },
    computed: {
        ...mapState(['inventory']),
        auditBtn() {
            return this.formData.audited ? '弃审' : '审核'
        }
    },
    mounted() {
        this.$axios({
            method: 'GET',
            url: '/api/whs'
        }).then(res => {
            res.data['whs'].forEach(item => {
                if(item.status==1) {
                    this.whList.push(item.name)
                }
            })
            if(this.whList.length==0) {
                this.$message({ message: '没有找到可用仓库', type: 'warning' })
                return
            }
        }).catch(err => {
            this.submitLoading = false
            this.$message({ message: err, type: 'error' })
        })
    },
    methods : {
        enterSearch($event) {
            if($event.$event.key=='Enter') { 
                this.searchEvent()
            }
        },
        searchEvent() {
                if(Number(this.searchVal)) {
                    this.searchVal = (Array(10).join(0) + Number(this.searchVal)).slice(-10)
                } else {
                    this.$message({ message: '单号错误', type: 'warning' })
                    return
                }
                this.submitLoading = true
                this.$axios({
                    method: 'GET',
                    url: '/api/disassemb',
                    params: { id: this.searchVal }
                }).then(res => {
                    if(res.data['disassemb_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    this.submitLoading = false
                    this.formData = res.data['disassemb_m'][0]
                    this.tableData = res.data['disassemb_c']
                    this.getInfo()
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
        },
        async insertEvent() {
            if(this.isInsert||this.isEdit){
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
            this.searchVal = null
            this.submitLoading = true
            this.isInsert = true
            this.$axios({
                method: 'GET',
                url: '/api/id',
                params: {id: 'disassemb'}
            }).then(res => {
                this.formData = {
                    id: res.data,
                    sbn: null,
                    created: this.$store.state.user.name,
                    createdat: new Date().toLocaleString('chinese', { hour12: false }),
                    edited: null,
                    editedat: null,
                    audited: null,
                    auditedat: null,
                    comment: null
                }
                this.info = {
                    pn: null,
                    name: null,
                    model: null,
                    namedesc: null
                }
                this.$refs.xTable.remove()
                for(var i=0;i<10;i++) {
                    this.$refs.xTable.insert({})
                }
                this.$nuxt.$emit('btnCtrl', 'add', res => {
                    this.ctrlDisabled = res
                })
            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            })
        },
        editEvent() {
            this.isEdit = true
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
                    url: '/api/disassemb',
                    params: { id: this.formData.id }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.isEdit = false
                        this.formData = {
                            id: null,
                            sbn: null,
                            comment: null,
                            created: null,
                            createdat: null,
                            edited: null,
                            editedat: null,
                            audited: null,
                            auditedat: null
                        }
                        this.info = {
                            pn: null,
                            name: null,
                            model: null,
                            namedesc: null
                        }
                        this.$refs.xTable.remove()
                        this.$message({ message: '删除成功', type: 'success' })
                        this.$axios({
                            method: 'DELETE',
                            url: '/api/sbntrace',
                            data: {sbn:this.formData.sbn,cat:'拆解',orderid:this.formData.id}
                        })
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
            var audited=this.$store.state.user.name, auditedat=new Date().toLocaleString('chinese', { hour12: false }), msg='已审核',status=1
            if(this.formData.audited) {
                audited = null
                auditedat = null
                msg = '已弃审'
                status = 0
            }
            var data = { w: { id: this.formData.id }, v: { audited: audited, auditedat: auditedat, status: status } }
            this.submitLoading = true
            this.$axios({
                method: 'PATCH',
                url: '/api/disassemb',
                params: data
            }).then(res => {
                this.submitLoading = false
                if(res.data=='OK') {
                    this.$message({ message: msg, type: 'success' })
                    this.formData.audited = audited
                    this.formData.auditedat = auditedat
                    this.formData.status = status
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
            this.searchVal = null
            this.$refs['disassembForm'].validate((valid) => {
                if(!valid) {
                    var data = this.getData()
                    var btnStatus = this.ctrlDisabled
                    if(!data) { return }
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
                            url: '/api/disassemb',
                            data: data
                        }).then(res => {
                            console.log(res)
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
                            this.submitLoading = false
                            this.$message({ message: err, type: 'error' })
                        })
                    } else {
                        this.$axios({
                            method: 'POST',
                            url: '/api/disassemb',
                            data: data
                        }).then(res => {
                            this.submitLoading = false
                            if(res.data=='OK') {
                                this.$message({ message: '保存成功', type: 'success' })
                                this.isInsert = false
                                this.$axios({
                                    method: 'POST',
                                    url: '/api/sbntrace',
                                    data: [{sbn:this.formData.sbn,cat:'拆解',orderid:this.formData.id,qty:1,created:this.formData.created,createdat:this.formData.createdat}]
                                })
                            } else {
                                this.$message({ message: res.data, type: 'error' })
                                this.ctrlDisabled = btnStatus
                            }
                        }).catch(err => {
                            this.ctrlDisabled = btnStatus
                            this.$message({ message: err, type: 'error' })
                        })
                    }
                } else {
                    this.$message({ type: 'error', message: '提交的数据错误或不完整' })
                }
            })
        },
        getData() {
            var res=[[this.formData]], t=[], t1={id: this.formData.id}, r={}, tableData=this.$refs.xTable.getTableData().tableData
            for(var i=0;i<tableData.length;i++) {
                if(!tableData[i].wh) {
                    this.$message({ message: tableData[i].pn + '未选择仓库', type: 'error' })
                    return    
                }
                for(var j=0;j<this.bomList.length;j++) {
                    if(this.bomList[j].cpn==tableData[i].pn && tableData[i].qty>this.bomList[j].qty) {
                        this.$message({ message: tableData[i].pn + '超出BOM数量', type: 'error' })
                        return
                    }
                }
                if(tableData[i].qty>=0) {     
                    r={}
                    t.push(Object.assign(r, t1, tableData[i]))
                } else if(!tableData[i].qty || tableData[i].qty<0) {
                    this.$message({ message: tableData[i].pn + '未填写有效数量', type: 'error' })
                    return
                }
            }
            res.push(t)
            return res
        },
        getInfo(trigger) {
            if(this.formData.sbn && this.formData.sbn.length==18 && this.inventory[this.formData.sbn.slice(0,9)]) {
                this.submitLoading = true
                this.info.pn = this.formData.sbn.slice(0,9)
                this.info.name = this.inventory[this.formData.sbn.slice(0,9)].name
                this.info.model = this.inventory[this.formData.sbn.slice(0,9)].model
                this.info.namedesc = this.inventory[this.formData.sbn.slice(0,9)].namedesc
                
                    this.$axios({
                        method: 'GET',
                        url: '/api/bom',
                        params: { pn: this.info.pn }
                    }).then(res => {
                        this.bomList = res.data['bom_c']
                        if(trigger=='sbnInput') {
                            this.tableData = []
                            res.data['bom_c'].forEach(item => {
                                this.tableData.push({pn: item.cpn, qty: item.qty})
                            })
                        }
                        this.submitLoading = false
                    }).catch(err => {
                        this.ctrlDisabled = btnStatus
                        this.submitLoading = false
                        this.$message({ message: err, type: 'error' })
                    })
                
            } else {
                this.$message({ message: '无效的序列号', type: 'warning' })
                this.formData.sbn = null
            }
        },
        getName(row) {
            if(!row.pn) { return }
            return this.inventory[row.pn].name
        },
        getModel(row) {
            if(!row.pn) { return }
            return this.inventory[row.pn].model
        },
        getNamedesc(row) {
            if(!row.pn){ return }
            return this.inventory[row.pn].namedesc
        },
        getManufact(row) {
            if(!row.pn){ return }
            return this.inventory[row.pn].manufact
        },
        activeCellMethod({ columnIndex }) {
            if (columnIndex==2) {
                return false
            }
            return true
        }
    }
}
</script>