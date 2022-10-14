<template>
    <div>
        <vxe-toolbar>
            <template #buttons>
                <vxe-button @click="insertEvent()">新增</vxe-button>
                <vxe-button @click="saveEvent()" :disabled="ctrlDisabled.saveBtn">提交</vxe-button>
                <vxe-button @click="editEvent()" :disabled="ctrlDisabled.editBtn">编辑</vxe-button>
                <vxe-button @click="auditEvent()" :disabled="formData.delivered?true:ctrlDisabled.auditBtn">{{auditBtn}}</vxe-button>
                <vxe-button @click="deleteEvent()" :disabled="ctrlDisabled.deleteBtn">删除</vxe-button>
                <vxe-button @click="printEvent()">打印</vxe-button>
                <vxe-input style="position:absolute;right:1rem;" v-model="searchVal" placeholder="请输入单号" type="search" clearable @keydown="enterSearch($event)" @search-click="searchEvent()"></vxe-input>
            </template>
        </vxe-toolbar>
        <vxe-form :class="{ 'readonly': ctrlDisabled.table }" :data="formData" :rules="formRules" ref="deliverForm">
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
                        <vxe-option value="销售出库" label="销售出库"></vxe-option>
                        <vxe-option value="生产领料" label="生产领料"></vxe-option>
                        <vxe-option value="采购退货" label="采购退货"></vxe-option>                      
                        <vxe-option value="其他出库" label="其他出库"></vxe-option>
                        <vxe-option value="调拨出库" label="调拨出库" disabled></vxe-option>                        
                    </vxe-select>
                    <vxe-modal v-model="showRelatedFrom" title="关联单据" width="1600" height="800" resize>
                        <template #default>
                            <vxe-toolbar>
                                <template #buttons>
                                    <vxe-select v-model="formData.cat">
                                        <vxe-option value="销售出库" label="销售出库"></vxe-option>
                                        <vxe-option value="生产领料" label="生产领料"></vxe-option>
                                        <vxe-option value="采购退货" label="采购退货"></vxe-option>
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
        <div style="border:1px lightgray solid" :class="{ 'readonly': ctrlDisabled.table || formData.cat=='生产领料' || formData.cat=='采购退货' }">
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
import QRCode from 'qrcode'
import VXETable from 'vxe-table'
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
            stock: [],
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
        printEvent() {
            const printStyle = `
                .fill-row { display: inline-block; height: 36px; margin-top: 36px; }
                .fill-title { display: inline-block; vertical-align: middle; margin-right: 4px;}
                .fill-value { vertical-align: bottom; border-bottom: 1px solid #000; margin-right: 15px;}
                .header { width: 100%; margin: 0 auto; text-align: center; font: 26px bold; justify-content: center; }
                .qrcode { height: 80px; width: 80px; margin: 0; position: fixed; top: -0.5rem; right: 0.5rem; }
            `
            var tableList = this.$refs.xTable.getTableData().tableData, printrow = ``
            for(var i=0;i<tableList.length;i++){
                if(tableList[i].pn){
                    printrow = printrow + `
                    <tr>
                        <td style="text-align: center">`+(i+1)+`</td>
                        <td style="text-align: center">`+tableList[i].pn+`</td>
                        <td style="text-align: center">`+this.inventory[tableList[i].pn].name+`</td>
                        <td style="text-align: center">`+this.inventory[tableList[i].pn].model+`</td>
                        <td style="white-space: nowrap;text-align: center">`+this.inventory[tableList[i].pn].namedesc+`</td>
                        <td style="white-space: nowrap;text-align: center">`+tableList[i].qty+`</td>
                        <td style="text-align: center">`+this.isNull(tableList[i].comment)+`</td>
                    </tr>
                    `
                }
            }
            QRCode.toDataURL(this.formData.id).then(url => {
                const printTmpl = `
                    <table><tbody><tr><td>
                        <div class="header">出库单</div>
                        <img class="qrcode" src="`+url+`"/>
                        <div>
                            <div class="fill-row">
                                <span class="fill-title">单号：</span>
                                <span class="fill-value">`+this.formData.id+`</span>
                                <span class="fill-title">仓库：</span>
                                <span class="fill-value">`+this.formData.wh+`</span>
                                <span class="fill-title">分类：</span>
                                <span class="fill-value">`+this.formData.cat+`</span>
                                <span class="fill-title">备注：</span>
                                <span class="fill-value">`+this.isNull(this.formData.comment)+`</span>
                            </div>
                            <table border="1" style="border-collapse: collapse; margin-top: 30px;">
                            <tr>
                                <th width="65px">序号</th>
                                <th width="100px">料号</th>
                                <th width="240px">品名</th>
                                <th width="130px">型号</th>
                                <th width="300px">品名描述</th>
                                <th width="80px">数量</th>
                                <th width="240px">备注</th>
                            </tr>
                            `+printrow+`
                            </table>
                            <div class="fill-row">
                                <span class="fill-title">制单：</span>
                                <span class="fill-value">`+this.formData.created+`</span>
                                <span class="fill-title">制单日期：</span>
                                <span class="fill-value">`+this.formData.createdat+`</span>
                                <span class="fill-title">编辑：</span>
                                <span class="fill-value">`+this.formData.edited+`</span>
                                <span class="fill-title">编辑日期：</span>
                                <span class="fill-value">`+this.formData.editedat+`</span>
                                <span class="fill-title">审核：</span>
                                <span class="fill-value">`+this.formData.created+`</span>
                                <span class="fill-title">审核日期：</span>
                                <span class="fill-value">`+this.formData.auditedat+`</span>
                            </div>
                        </div>
                    </td></tr></tbody></table>
                    `
                VXETable.print({
                    style: printStyle,
                    content: printTmpl
                })
            })
        },
        isNull(str) {
            if(str==null) {
                return ''
            }else{
                return str
            }
        },
        showModal() {
            if(this.formData.cat!='其他出库' && this.formData.cat!='调拨出库') {
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
            if(this.formData.cat=='销售出库') {
                proc = proc + ' sounshiped("' + this.modalSearchVal + '");'
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
            } else if(this.formData.cat=='生产领料') {
                this.$axios({
                    method: 'GET',
                    url: '/api/picklist',
                    params: { id: this.modalSearchVal }
                }).then(res => {
                    if(res.data['picklist_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    if(!res.data['picklist_m'][0]['audited']) {
                        this.$message({ message: '当前生产领料单未审核', type: 'warning' })
                        return
                    }
                    if(res.data['picklist_m'][0]['status']==-1) {
                        this.$message({ message: '当前生产领料单已出库', type: 'warning' })
                        return
                    }
                    this.modalTable = res.data['picklist_c']
                    this.modalFormData['id'] = res.data['picklist_m'][0]['id']
                    this.modalFormData['created'] = res.data['picklist_m'][0]['created']
                    this.modalFormData['createdat'] = res.data['picklist_m'][0]['createdat']
                    this.modalFormData['comment'] = res.data['picklist_m'][0]['comment']
                    this.submitLoading = false
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else if(this.formData.cat=='采购退货') {
                this.$axios({
                    method: 'GET',
                    url: '/api/po',
                    params: { id: this.modalSearchVal }
                }).then(res => {
                    if(res.data['po_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    if(res.data['po_m'][0]['cat']!='退货') {
                        this.$message({ message: '当前单据类型为 ' + res.data['po_m'][0]['cat'], type: 'warning' })
                        return
                    }
                    if(res.data['po_m'][0]['status']==-1) {
                        this.$message({ message: '当前采购单已出库', type: 'warning' })
                        return
                    }
                    this.modalTable = res.data['po_c']
                    this.modalFormData['id'] = res.data['po_m'][0]['id']
                    this.modalFormData['created'] = res.data['po_m'][0]['created']
                    this.modalFormData['createdat'] = res.data['po_m'][0]['createdat']
                    this.modalFormData['comment'] = res.data['po_m'][0]['comment']
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
                    url: '/api/delivery',
                    params: { id: this.searchVal }
                }).then(res => {
                    if(res.data['delivery_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    this.submitLoading = false
                    this.formData = res.data['delivery_m'][0]
                    this.tableData = res.data['delivery_c']
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
                params: {id: 'delivery'}
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
                    url: '/api/delivery',
                    params: { id: this.formData.id }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.isEdit = false
                        this.$refs.xTable.remove()
                        this.$message({ message: '删除成功', type: 'success' })
                        this.updateStatus({ cat: this.formData.cat, superiorid: this.formData.superiorid, e: 'del' })
                        this.formData = {
                            id: null,
                            wh: null,
                            cat: null,
                            comment: null,
                            superiorid: null,
                            created: null,
                            createdat: null,
                            edited: null,
                            editedat: null,
                            audited: null,
                            auditedat: null
                        }
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
        async auditEvent() {
            this.submitLoading = true
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
            } else {
                var c=await this.checkStock()
                if(!c) {
                    this.ctrlDisabled = btnStatus
                    return
                }
            }
            var data = { w: { id: this.formData.id }, v: { audited: audited, auditedat: auditedat, status: status } }
            this.$axios({
                method: 'PATCH',
                url: '/api/delivery',
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
            this.searchVal = null
            this.$refs['deliverForm'].validate(async valid => {
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
                            url: '/api/delivery',
                            data: data
                        }).then(res => {
                            this.submitLoading = false
                            if(res.data=='OK') {
                                this.$message({ message: '保存成功', type: 'success' })
                                this.isEdit = false
                                this.updateStatus({ cat: this.formData.cat, superiorid: this.formData.superiorid })
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
                        var c=await this.checkQty()
                        if(!c&&this.formData.cat=='销售出库') {
                            const confirmRes = await this.$confirm(
                                '当前单据超数量出库, 是否继续?',
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
                        this.$axios({
                            method: 'POST',
                            url: '/api/delivery',
                            data: data
                        }).then(res => {
                            this.submitLoading = false
                            if(res.data=='OK') {
                                this.$message({ message: '保存成功', type: 'success' })
                                this.isInsert = false
                                this.updateStatus({ cat: this.formData.cat, superiorid: this.formData.superiorid })
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
                this.$message({ message: '未填写出库明细', type: 'error' })
                return
            }
            res.push(t)
            return res
        },
        async checkQty() {
            if(this.formData.cat=='销售出库') {
                var isOver=true
                var res=await this.$axios({
                    method: 'GET',
                    url: '/api/call',
                    params: { proc: 'CALL sounshiped("' + this.formData.superiorid + '");' }
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
        updateStatus(param) {
            var data = { w: { id: param.superiorid }, v: { status: -1 } }, msg='已完结'
            if(param.cat=='销售出库') {
                this.$axios({
                    method: 'GET',
                    url: '/api/call',
                    params: { proc: 'CALL sounshiped("' + param.superiorid + '");' }
                }).then(res => {
                    if(Object.keys(res.data).length>0) {
                        var r=0
                        Object.values(res.data).forEach(item => {
                            r = r + item['shiped']
                        })
                        if(r==0) {
                            data['v']['status'] = 1
                            msg = '待出库'
                        } else {
                            data['v']['status'] = null
                            msg = '已出库'
                        }
                    }
                    this.$axios({
                        method: 'PATCH',
                        url: '/api/so',
                        params: data
                    }).then(res => {
                        if(res.data=='OK') {
                            this.$message({ message: '已变更销售单' + param.superiorid + '状态为' + msg, type: 'success' })
                        } else {
                            this.$message({ message: res.data, type: 'error' })
                        }
                    }).catch(err => {
                        this.$message({ message: err, type: 'error' })
                    })
                }).catch(err => {
                    this.$message({ message: err, type: 'error' })
                })
            } else if(param.cat=='生产领料') {
                if(param.e) {
                    data['v']['status'] = 1
                    msg = '待出库'
                }
                this.$axios({
                    method: 'PATCH',
                    url: '/api/picklist',
                    params: data
                }).then(res => {
                    if(res.data=='OK') {
                        this.$message({ message: '已变更生产领料单' + param.superiorid + '状态为' + msg, type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else if(param.cat=='采购退货') {
                if(param.e) {
                    data['v']['status'] = 1
                    msg = '待出库'
                }
                this.$axios({
                    method: 'PATCH',
                    url: '/api/po',
                    params: data
                }).then(res => {
                    if(res.data=='OK') {
                        this.$message({ message: '已变更采购单' + param.superiorid + '状态为' + msg, type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            }
        },
        async checkStock() {
            var res=true
            var res=await this.$axios({
                method: 'GET',
                url: '/api/call',
                params: { proc: 'CALL getstock();' }
            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            })
            var tableData=this.$refs.xTable.getTableData().tableData
            this.stock = Object.values(res.data)
            for(var i=0;i<tableData.length;i++) {
                if(tableData[i].pn) {
                    this.stock.forEach(item => {
                        if(item.wh==this.formData.wh&&item.pn==tableData[i].pn&&item.stock<tableData[i].qty) {
                            this.$message({ message: item.pn + '库存不足, 审核失败', type: 'error'})
                            res = false
                        }
                    })
                }
            }
            return res
        }
    }
}
</script>