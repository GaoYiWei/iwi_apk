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
        <vxe-form :class="{ 'readonly': ctrlDisabled.table }" :data="formData" :rules="formRules" ref="receiptForm">
            <vxe-form-item title="单号" field="id" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.id" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="仓库" field="wh" :item-render="{}">
                <template #default="{ data }">
                    <vxe-select v-model="data.wh">
                        <vxe-option v-for="item in whList" :value="item" :label="item" :key="item"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-form-item>
            <vxe-form-item title="分类" field="cat" :item-render="{}">
                <template #default="{ data }">
                    <vxe-select v-model="data.cat" @change="showModal()">
                        <vxe-option value="采购入库" label="采购入库"></vxe-option>
                        <vxe-option value="生产入库" label="生产入库"></vxe-option>
                        <vxe-option value="销售退货" label="销售退货"></vxe-option>
                        <vxe-option value="其他入库" label="其他入库"></vxe-option>
                        <vxe-option value="调拨入库" label="调拨入库" disabled></vxe-option>                        
                    </vxe-select>
                    <vxe-modal v-model="showRelatedFrom" title="关联单据" width="1600" height="800" resize>
                        <template #default>
                            <vxe-toolbar>
                                <template #buttons>
                                    <vxe-select v-model="formData.cat">
                                        <vxe-option value="采购入库" label="采购入库"></vxe-option>
                                        <vxe-option value="生产入库" label="生产入库"></vxe-option>
                                        <vxe-option value="销售退货" label="销售退货"></vxe-option>
                                    </vxe-select>
                                    <vxe-input style="margin-left: 2rem;" v-model="modalSearchVal" placeholder="请输入单号" type="search" clearable @keydown="modalEnterSearch($event)" @search-click="modalSearchEvent()"></vxe-input>
                                    <vxe-button @click="getModalData()">确定</vxe-button>
                                </template>
                            </vxe-toolbar>
                            <vxe-form :data="modalFormData">
                                <vxe-form-item title="单号" field="id">
                                    <template #default="{ data }">
                                        <vxe-input v-model="data.id" readonly></vxe-input>
                                    </template>
                                </vxe-form-item>
                                <vxe-form-item title="制单" field="created">
                                    <template #default="{ data }">
                                        <vxe-input v-model="data.created" readonly></vxe-input>
                                    </template>
                                </vxe-form-item>
                                <vxe-form-item title="制单时间" field="createdat">
                                    <template #default="{ data }">
                                        <vxe-input v-model="data.createdat" readonly></vxe-input>
                                    </template>
                                </vxe-form-item>
                                <vxe-form-item title="备注" field="comment">
                                    <template #default="{ data }">
                                        <vxe-input v-model="data.comment" readonly></vxe-input>
                                    </template>
                                </vxe-form-item>
                            </vxe-form>
                            <vxe-table
                                border
                                stripe
                                resizable
                                ref="mTable"
                                show-overflow
                                height="660"
                                header-align="center"
                                :row-config="{isHover: true, isCurrent: true, useKey: true}"
                                :data="modalTable">
                                <vxe-column type="seq" title="序号" width="80"></vxe-column>
                                <vxe-column field="pn" title="料号" width="120"></vxe-column>
                                <vxe-column field="qty" title="数量" width="120"></vxe-column>
                                <vxe-column field="comment" title="备注" width="180"></vxe-column>
                                <vxe-column field="name" title="品名" width="180">
                                    <template #default="{ row }">
                                        <span>{{ getName(row) }}</span>
                                    </template>
                                </vxe-column>
                                <vxe-column field="model" title="型号" width="120">
                                    <template #default="{ row }">
                                        <span>{{ getModel(row) }}</span>
                                    </template>
                                </vxe-column>
                                <vxe-column field="namedesc" title="品名描述" width="200">
                                    <template #default="{ row }">
                                        <span>{{ getNamedesc(row) }}</span>
                                    </template>
                                </vxe-column>
                                <vxe-column field="manufact" title="厂家" width="170">
                                    <template #default="{ row }">
                                        <span>{{ getManufact(row) }}</span>
                                    </template>
                                </vxe-column>
                            </vxe-table>
                        </template>
                    </vxe-modal>
                </template>
            </vxe-form-item>
            <vxe-form-item title="备注" field="comment" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.comment"></vxe-input>
                </template>
            </vxe-form-item>
        </vxe-form>
        <div style="border:1px lightgray solid" :class="{ 'readonly': ctrlDisabled.table || formData.cat!='采购入库' }">
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
                height="660"
                header-align="center"
                :row-config="{isHover: true, isCurrent: true, useKey: true}"
                :data="tableData"
                :edit-config="{trigger: 'click', mode: 'row'}">
                <vxe-column type="seq" title="序号" width="80"></vxe-column>
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
            modalFormData: {
                id: null,
                created: null,
                createdat: null,
                comment: null
            },
            modalTable: [],
            modalSearchVal: '',
            formData: {
                id: null,
                wh: null,
                cat: null,
                superiorid: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null,
                comment: null
            },
            formRules: {
                cat: [
                    { required: true, message: '请选择类型' }
                ],
                wh: [
                    { required: true, message: '请选择仓库' }
                ]
            },
            dataTemp: null,
            tableData: [],
            isEdit: false,
            searchVal: '',
            ctrlDisabled: {
                saveBtn: true,
                auditBtn: true,
                deleteBtn: true,
                editBtn: true,
                table: true
            },
            showRelatedFrom: false,
            isInsert: false,
            unshipedList: []
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
        showModal() {
            if(this.formData.cat!='其他入库' && this.formData.cat!='调拨入库') {
                this.showRelatedFrom = true
            }
        },
        modalEnterSearch($event) {
            if($event.$event.key=='Enter') { 
                this.modalSearchEvent()
            }
        },
        modalSearchEvent() {
            if(Number(this.modalSearchVal)) {
                this.modalSearchVal = (Array(10).join(0) + Number(this.modalSearchVal)).slice(-10)
            } else {
                this.$message({ message: '单号错误', type: 'warning' })
                return
            }
            this.submitLoading = true
            var proc='CALL'
            if(this.formData.cat=='采购入库') {
                proc = proc + ' pounshiped("' + this.modalSearchVal + '");'
                this.$axios({
                    method: 'GET',
                    url: '/api/call',
                    params: { proc: proc }
                }).then(res => {
                    if(Object.keys(res.data).length>0) {
                        this.modalTable = Object.values(res.data)
                        this.unshipedList = Object.values(res.data)
                        this.modalFormData['id'] = this.modalSearchVal
                        this.modalFormData['created'] = Object.values(res.data)[0]['created']
                        this.modalFormData['createdat'] = Object.values(res.data)[0]['createdat']
                        this.modalFormData['comment'] = Object.values(res.data)[0]['mcomment']
                    } else {
                        this.modalTable = []
                        this.modalFormData['id'] = null
                        this.modalFormData['created'] = null
                        this.modalFormData['createdat'] = null
                        this.modalFormData['comment'] = null
                        this.$message({ message: '没有找到记录', type: 'warning' })
                    }
                    this.submitLoading = false
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else if(this.formData.cat=='生产入库') {
                this.$axios({
                    method: 'GET',
                    url: '/api/producewh',
                    params: { id: this.modalSearchVal }
                }).then(res => {
                    if(res.data['producewh_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    if(!res.data['producewh_m'][0]['audited']) {
                        this.$message({ message: '当前生产入库单未审核', type: 'warning' })
                        return
                    }
                    if(res.data['producewh_m'][0]['status']==-1) {
                        this.$message({ message: '当前生产入库单已入库', type: 'warning' })
                        return
                    }
                    this.modalTable = res.data['producewh_c']
                    this.modalFormData['id'] = res.data['producewh_m'][0]['id']
                    this.modalFormData['created'] = res.data['producewh_m'][0]['created']
                    this.modalFormData['createdat'] = res.data['producewh_m'][0]['createdat']
                    this.modalFormData['comment'] = res.data['producewh_m'][0]['comment']
                    this.submitLoading = false
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else if(this.formData.cat=='销售退货') {
                this.$axios({
                    method: 'GET',
                    url: '/api/so',
                    params: { id: this.modalSearchVal }
                }).then(res => {
                    if(res.data['so_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    if(res.data['so_m'][0]['cat']!='退货') {
                        this.$message({ message: '当前单据类型为 ' + res.data['so_m'][0]['cat'], type: 'warning' })
                        return
                    }
                    if(res.data['so_m'][0]['status']==-1) {
                        this.$message({ message: '当前销售单已入库', type: 'warning' })
                        return
                    }
                    this.modalTable = res.data['so_c']
                    this.modalFormData['id'] = res.data['so_m'][0]['id']
                    this.modalFormData['created'] = res.data['so_m'][0]['created']
                    this.modalFormData['createdat'] = res.data['so_m'][0]['createdat']
                    this.modalFormData['comment'] = res.data['so_m'][0]['comment']
                    this.submitLoading = false
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            }
        },
        getModalData() {
            this.formData.superiorid = this.modalFormData.id
            this.tableData = []
            this.modalFormData = {
                id: null,
                created: null,
                createdat: null,
                comment: null
            }
            this.modalTable.forEach(item => {
                this.tableData.push({pn: item.pn, qty: item.qty})
            })
            this.modalTable = []
            this.showRelatedFrom = false
        },
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
                    url: '/api/receipt',
                    params: { id: this.searchVal }
                }).then(res => {
                    if(res.data['receipt_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    this.submitLoading = false
                    this.formData = res.data['receipt_m'][0]
                    this.tableData = res.data['receipt_c']
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
                params: {id: 'receipt'}
            }).then(res => {
                this.formData = {
                    id: res.data,
                    wh: null,
                    cat: null,
                    superiorid: null,
                    created: this.$store.state.user.name,
                    createdat: new Date().toLocaleString('chinese', { hour12: false }),
                    edited: null,
                    editedat: null,
                    audited: null,
                    auditedat: null,
                    comment: null
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
                    url: '/api/receipt',
                    params: { id: this.formData.id }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.isEdit = false
                        this.formData = {
                            id: null,
                            wh: null,
                            cat: null,
                            comment: null,
                            status: 0,
                            superiorid: null,
                            created: null,
                            createdat: null,
                            edited: null,
                            editedat: null,
                            audited: null,
                            auditedat: null
                        }
                        this.$refs.xTable.remove()
                        this.$message({ message: '删除成功', type: 'success' })
                        this.updateStatus('del')
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
            var audited=this.$store.state.user.name, auditedat=new Date().toLocaleString('chinese', { hour12: false }), msg='审核成功',status=1
            if(this.formData.audited) {
                audited = null
                auditedat = null
                msg = '弃审成功'
                status = 0
            }
            var data = { w: { id: this.formData.id }, v: { audited: audited, auditedat: auditedat, status: status } }
            this.submitLoading = true
            this.$axios({
                method: 'PATCH',
                url: '/api/receipt',
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
            this.$refs['receiptForm'].validate(async valid => {
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
                            url: '/api/receipt',
                            data: data
                        }).then(res => {
                            this.submitLoading = false
                            if(res.data=='OK') {
                                this.$message({ message: '保存成功', type: 'success' })
                                this.isEdit = false
                                this.updateStatus()
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
                        if(this.formData.cat=='采购入库'){
                            var c=await this.checkQty()
                            if(!c) {
                                const confirmRes = await this.$confirm(
                                    '当前单据超数量入库, 是否继续?',
                                    '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }
                                ).catch(() => {
                                    this.ctrlDisabled = btnStatus
                                    this.$message.info('已取消保存')
                                })
                                if(confirmRes!=='confirm') {
                                    return
                                }
                            }     
                        }
                        this.$axios({
                            method: 'POST',
                            url: '/api/receipt',
                            data: data
                        }).then(res => {
                            this.submitLoading = false
                            if(res.data=='OK') {
                                this.$message({ message: '保存成功', type: 'success' })
                                this.isInsert = false
                                this.updateStatus()
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
                if(tableData[i].pn && tableData[i].qty>0) {     
                    r={}
                    t.push(Object.assign(r, t1, tableData[i]))
                } else if(tableData[i].pn && !tableData[i].qty || tableData[i].pn && tableData[i].qty<=0) {
                    this.$message({ message: tableData[i].pn + '未填写有效数量', type: 'error' })
                    return
                }
            }
            if(t.length==0) {
                this.$message({ message: '未填写入库明细', type: 'error' })
                return
            }
            res.push(t)
            return res
        },
        async checkQty() {
            if(this.formData.cat=='采购入库') {
                var isOver=true
                var res=await this.$axios({
                    method: 'GET',
                    url: '/api/call',
                    params: { proc: 'CALL pounshiped("' + this.formData.superiorid + '");' }
                }).catch(err => {
                    this.$message({ message: err, type: 'error' })
                })
                if(Object.keys(res.data).length>0) {
                    var tableData=this.$refs.xTable.getTableData().tableData, unshiped=Object.values(res.data)              
                    for(var i=0;i<tableData.length;i++) {
                        for(var j=0;j<unshiped.length;j++) {
                            if(tableData[i].pn==unshiped[j].pn && unshiped[j].qty<tableData[i].qty) {
                                isOver = false
                            }
                        }
                    }
                } else {
                    isOver = false
                }
                return isOver
            }
        },
        getName(row) {
            if(!row.pn) { return }
            if(this.inventory[row.pn]) {
                if(this.inventory[row.pn].status==1||this.inventory[row.pn].status==-1||this.ctrlDisabled.table||this.isEdit){
                    var records = this.$refs.xTable.getTableData().tableData
                    for(var i=0;i<records.length;i++) {
                        if(!records[i].pn || row._X_ROW_KEY==records[i]._X_ROW_KEY) {continue}
                        if(row.pn==records[i].pn) {
                            this.$message({ message: '重复添加', type: 'warning' })
                            records[i].pn = null
                            records[i].qty = null
                            return
                        }                  
                    }
                    return this.inventory[row.pn].name
                } else {
                    this.$message({ message: '料号已停用', type: 'warning' })
                    row.qty = null
                    row.pn = null
                    return
                }
            } else {
                this.$message({ message: '料号不存在, 请刷新后再试', type: 'warning' })
                row.qty = null
                row.pn = null
                return
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
        },
        insertRowEvent() {
            this.$refs.xTable.insertAt({},-1)
        },
        updateStatus(caller) {
            var data = { w: { id: this.formData.superiorid }, v: { status: null } }, msg='已入库'
            if(this.formData.cat=='采购入库') {
                this.$axios({
                    method: 'GET',
                    url: '/api/call',
                    params: { proc: 'CALL pounshiped("' + this.formData.superiorid + '");' }
                }).then(res => {
                    if(Object.keys(res.data).length>0) {
                        var r=0
                        Object.values(res.data).forEach(item => {
                            r = r + item['shiped']
                        })
                        if(r==0) {
                            data['v']['status'] = 1
                            msg = '已审核'
                        }
                    } else {
                        data['v']['status'] = -1
                        msg = '已完结'
                    }
                    this.$axios({
                        method: 'PATCH',
                        url: '/api/po',
                        params: data
                    }).then(res => {
                        if(res.data=='OK') {
                            this.$message({ message: '已变更采购单' + this.formData.superiorid + '状态为' + msg, type: 'success' })
                        } else {
                            this.$message({ message: res.data, type: 'error' })
                        }
                    }).catch(err => {
                        this.$message({ message: err, type: 'error' })
                    })
                }).catch(err => {
                    this.$message({ message: err, type: 'error' })
                })
            } else if(this.formData.cat=='生产入库') {
                if(caller=='del') {
                    data['v']['status'] = 1
                    msg = '待入库'
                } else {
                    data['v']['status'] = -1
                }
                this.$axios({
                    method: 'PATCH',
                    url: '/api/producewh',
                    params: data
                }).then(res => {
                    if(res.data=='OK') {
                        this.$message({ message: '已变更生产入库单' + this.formData.superiorid + '状态为' + msg, type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else if(this.formData.cat=='销售退货') {
                if(caller=='del') {
                    data['v']['status'] = 1
                    msg = '待入库'
                } else {
                    data['v']['status'] = -1
                }
                this.$axios({
                    method: 'PATCH',
                    url: '/api/so',
                    params: data
                }).then(res => {
                    if(res.data=='OK') {
                        this.$message({ message: '已变更销售单' + this.formData.superiorid + '状态为' + msg, type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            }
        }
    }
}
</script>