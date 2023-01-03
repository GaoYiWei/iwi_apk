<template>
    <div>
        <vxe-toolbar>
            <template #buttons>
                <vxe-button @click="insertEvent()">新增</vxe-button>
                <vxe-button @click="saveEvent()" :disabled="ctrlDisabled.saveBtn">提交</vxe-button>
                <vxe-button @click="editEvent()" :disabled="ctrlDisabled.editBtn">编辑</vxe-button>
                <vxe-button @click="deleteEvent()" :disabled="ctrlDisabled.deleteBtn">删除</vxe-button>
                <vxe-button @click="auditEvent()" :disabled="ctrlDisabled.auditBtn">{{auditBtn}}</vxe-button>
                <vxe-button @click="printEvent()">打印</vxe-button>
                <vxe-input style="position:absolute;right:1rem;" v-model="searchVal" placeholder="请输入单号" type="search" clearable @keydown="enterSearch($event)" @search-click="searchEvent()"></vxe-input>
            </template>
        </vxe-toolbar>
        <vxe-form :class="{ 'readonly': ctrlDisabled.table }" :data="formData" :rules="formRules" ref="changelibForm">
            <vxe-form-item title="单号" field="id" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.id" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="分类" field="cat" :item-render="{}">
                <template #default="{ data }">
                    <vxe-select v-model="data.cat">
                        <vxe-option value="库位调整" label="库位调整"></vxe-option>                       
                    </vxe-select>
                </template>
            </vxe-form-item>
            <vxe-form-item title="仓库" field="wh" :item-render="{}">
                <template #default="{ data }">
                    <vxe-select v-model="data.wh">
                        <vxe-option v-for="item in whList" :value="item" :label="item" :key="item"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-form-item>
            <vxe-form-item title="备注" field="comment" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.comment"></vxe-input>
                </template>
            </vxe-form-item>
        </vxe-form>
        <div style="border:1px lightgray solid">
            <vxe-toolbar style="padding-left:10px" :class="{ 'readonly': ctrlDisabled.table }">
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
                height="500"
                header-align="center"
                :row-config="{isHover: true, isCurrent: true, useKey: true, height: 40}"
                :data="tableData"
                :edit-config="{trigger: 'click', mode: 'row', activeMethod: activeRowMethod}">
                <vxe-column type="seq" title="序号" width="80"></vxe-column>
                <vxe-column field="pn" title="料号" :edit-render="{name: 'input', props: {type: 'text' }}" width="120"></vxe-column>
                <vxe-column field="qty" title="数量" :edit-render="{name: 'input', props: {type: 'number'}}" width="120"></vxe-column>
                <vxe-column field="librariesout" title="出库" :edit-render="{name: 'input', props: {type: 'text'}}" width="120"></vxe-column>
                <vxe-column field="librariesin" title="入库" :edit-render="{name: 'input', props: {type: 'text'}}" width="120"></vxe-column>
                <vxe-column field="lotno" title="批号" @change="getDepart" :edit-render="{name: 'input', props: {type: 'text' }}" width="120"></vxe-column>
                <vxe-column field="comment" title="备注" :edit-render="{name: 'input', props: {type: 'text'}}" width="200"></vxe-column>
                <vxe-column field="depart" title="部门" width="120">
                    <template #default="{ row }">
                        <span>{{ getDepart(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="name" title="名称" width="200">
                    <template #default="{ row }">
                        <span>{{ getName(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="model" title="规格" width="120">
                    <template #default="{ row }">
                        <span>{{ getModel(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="boxmodel" title="箱规" width="200">
                    <template #default="{ row }">
                        <span>{{ getBoxModel(row) }}</span>
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
            formData: {
                id: null,
                cat: null,
                wh: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null,
                comment: null
            },
            formRules: {
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
                deleteBtn: true,
                auditBtn: true,
                editBtn: true,
                table: true
            },
            stock: [],
            isInsert: false,
            lotnoInfo: []
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
            this.$message({ message: err, type: 'error' })
        })
        this.$axios({
            method: 'GET',
            url: '/api/call',
            params: { proc: 'CALL getliblotno();' }
        }).then(res => {
            this.lotnoInfo = res.data
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
    },
    methods : {
        activeRowMethod ({ row, rowIndex }) {
            return !this.ctrlDisabled.table
        },
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
                        <td style="white-space: nowrap;text-align: center">`+this.inventory[tableList[i].pn].boxmodel+`</td>
                        <td style="text-align: center">`+tableList[i].librariesout+`</td>
                        <td style="text-align: center">`+tableList[i].librariesin+`</td>
                        <td style="white-space: nowrap;text-align: center">`+tableList[i].qty+`</td>
                        <td style="text-align: center">`+this.isNull(tableList[i].comment)+`</td>
                    </tr>
                    `
                }
            }
            QRCode.toDataURL(this.formData.id).then(url => {
                const printTmpl = `
                    <table><tbody><tr><td>
                        <div class="header">调拨单</div>
                        <img class="qrcode" src="`+url+`"/>
                        <div>
                            <div class="fill-row">
                                <span class="fill-title">单号：</span>
                                <span class="fill-value">`+this.formData.id+`</span>
                                <span class="fill-title">分类：</span>
                                <span class="fill-value">`+this.formData.cat+`</span>
                                <span class="fill-title">仓库：</span>
                                <span class="fill-value">`+this.formData.wh+`</span>
                                <span class="fill-title">备注：</span>
                                <span class="fill-value">`+this.isNull(this.formData.comment)+`</span>
                            </div>
                            <table border="1" style="border-collapse: collapse; margin-top: 30px;">
                            <tr>
                                <th width="65px">序号</th>
                                <th width="100px">料号</th>
                                <th width="240px">名称</th>
                                <th width="130px">规格</th>
                                <th width="300px">箱规</th>
                                <th width="130px">出库</th>
                                <th width="130px">入库</th>
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
                                <span class="fill-value">`+this.formData.audited+`</span>
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
                    url: '/api/changelib',
                    params: { id: this.searchVal }
                }).then(res => {
                    if(res.data['changelib_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    this.submitLoading = false
                    this.formData = res.data['changelib_m'][0]
                    this.tableData = res.data['changelib_c']
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
                params: {id: 'changelib'}
            }).then(res => {
                this.formData = {
                    id: res.data,
                    cat: null,
                    wh: null,
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
            if(this.formData.created!=this.$store.state.user.name) {
                this.$message({ message: '当前帐号与该单据创建人不一致，删除失败', type: 'warning' })
                return
            }
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
                    url: '/api/changelib',
                    params: { id: this.formData.id }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.isEdit = false
                        this.formData = {
                            id: null,
                            cat: null,
                            wh: null,
                            comment: null,
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
        async auditEvent() {
            var btnStatus = this.ctrlDisabled
            this.$nuxt.$emit('btnCtrl', this.formData.audited ? 'unaudit' : 'audit', res => {
                this.ctrlDisabled = res
            })
            var audited=this.$store.state.user.name, auditedat=new Date().toLocaleString('chinese', { hour12: false }), msg='已审核'
            if(this.formData.audited) {
                audited = null
                auditedat = null
                msg = '已弃审'
            } else {
                var c=await this.checkStock()
                if(!c) {
                    this.ctrlDisabled = btnStatus
                    return
                }
            }
            var data = { w: { id: this.formData.id }, v: { audited: audited, auditedat: auditedat } }
            this.submitLoading = true
            this.$axios({
                method: 'PATCH',
                url: '/api/changelib',
                params: data
            }).then(res => {
                this.submitLoading = false
                if(res.data=='OK') {
                    this.$message({ message: msg, type: 'success' })
                    this.formData.audited = audited
                    this.formData.auditedat = auditedat
                    if(this.formData.audited) {
                        this.createIO()
                    } else  {
                        this.deleteIO()
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
        },
        saveEvent() {
            this.searchVal = null
            this.$refs['changelibForm'].validate((valid) => {
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
                            url: '/api/changelib',
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
                            this.submitLoading = false
                            this.$message({ message: err, type: 'error' })
                        })
                    } else {
                        this.$axios({
                            method: 'POST',
                            url: '/api/changelib',
                            data: data
                        }).then(res => {
                            this.submitLoading = false
                            if(res.data=='OK') {
                                this.$message({ message: '保存成功', type: 'success' })
                                this.isInsert = false
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
            var res=[[this.formData]], t=[], t1={id: this.formData.id}, r={}, tableData=this.$refs.xTable.getTableData().tableData, depart
            for(var i=0;i<tableData.length;i++) {
                if(tableData[i].pn && isNaN(tableData[i].qty) || tableData[i].pn && !tableData[i].qty || tableData[i].pn && tableData[i].qty<=0) {
                    this.$message({ message: tableData[i].pn + '未填写有效数量', type: 'warning' })
                    return
                } else if (tableData[i].pn && !tableData[i].librariesin||tableData[i].pn && !tableData[i].librariesout) {
                    this.$message({ message: tableData[i].pn + '库位不完整', type: 'warning' })
                    return
                } else if (tableData[i].pn && tableData[i].librariesin==tableData[i].librariesout) {
                    this.$message({ message: tableData[i].pn + '出入库位相同', type: 'warning' })
                    return
                } else if (tableData[i].pn && !tableData[i].lotno) {
                    this.$message({ message: tableData[i].pn + '未填写批号', type: 'warning' })
                    return
                } else if (tableData[i].pn && tableData[i].qty>0) {
                    r={}
                    depart = this.getDepart({pn: tableData[i].pn, lotno: tableData[i].lotno})
                    if(!depart) {
                        this.$message({ message: tableData[i].pn + ' ' + tableData[i].lotno + '未查询到归属部门', type: 'warning' })
                        return
                    }
                    t.push(Object.assign(r, t1, tableData[i], {depart: depart}))
                }
            }
            if(t.length==0) {
                this.$message({ message: '未填写调拨明细', type: 'error' })
                return
            }
            res.push(t)
            return res
        },
        getDepart(row) {
            if(!row.pn||!row.lotno) { return }
            for(var i=0;i<this.lotnoInfo.length;i++) {
                if(row.pn==this.lotnoInfo[i].pn&&row.lotno==this.lotnoInfo[i].lotno) {
                    return this.lotnoInfo[i].depart
                }
            }
        },
        getName(row) {
            if(!row.pn) { return }
            if(this.inventory[row.pn]) {
                if(this.inventory[row.pn].status==1||this.inventory[row.pn].status==-1||this.ctrlDisabled.table||this.isEdit){
                    var records = this.$refs.xTable.getTableData().tableData
                    for(var i=0;i<records.length;i++) {
                        if(!records[i].pn || row._X_ROW_KEY==records[i]._X_ROW_KEY) {continue}
                        if(row.pn==records[i].pn && row.libraries==records[i].libraries && row.lotno==records[i].lotno) {
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
        getBoxModel(row) {
            if(!row.pn){ return }
            if(this.inventory[row.pn]) {
                return this.inventory[row.pn].boxmodel
            } else {
                return null
            }
        },
        insertRowEvent() {
            this.$refs.xTable.insertAt({},-1)
        },
        async checkStock() {
            this.$axios({
                method: 'GET',
                url: '/api/call',
                params: { proc: 'CALL getliblotno();' }
            }).then(res => {
                this.lotnoInfo = res.data
            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            })
            var tableData=this.$refs.xTable.getTableData().tableData
            for(var i=0;i<tableData.length;i++) {
                if(tableData[i].pn) {
                    for(var j=0;j<this.lotnoInfo.length;j++) {
                        if(tableData[i].pn==this.lotnoInfo[j].pn&&tableData[i].librariesout==this.lotnoInfo[j].libraries&&tableData[i].lotno==this.lotnoInfo[j].lotno) {
                            if(tableData[i].qty>this.lotnoInfo[j].qty) {
                                this.$message({ message: tableData[i].pn + ' ' + tableData[i].librariesout + ' ' + tableData[i].lotno + ' 库存不足', type: 'warning' })
                                return false
                            }
                            break
                        }
                        if(j==this.lotnoInfo.length-1) {
                            this.$message({ message: tableData[i].pn + ' ' + tableData[i].librariesout + ' ' + tableData[i].lotno + ' 库存不足', type: 'warning' })
                            return false
                        }
                    }
                }
            }
            return true
        },
        createIO() {
            var indata=[], outdata=[], inform=[{
                id: null,
                cat: '库位调整',
                wh: this.formData.wh,
                superiorid: this.formData.id,
                comment: this.formData.comment,
                created: this.formData.created,
                createdat: this.formData.auditedat
            }], depart='', outform=[{
                id: null,
                cat: '库位调整',
                wh: this.formData.wh,
                superiorid: this.formData.id,
                comment: this.formData.comment,
                created: this.formData.created,
                createdat: this.formData.auditedat
            }]
            this.$axios({
                method: 'GET',
                url: '/api/id',
                params: {id: 'lotnoout'}
            }).then(res => {
                outform[0].id = res.data
                this.$refs.xTable.getTableData().tableData.forEach(item => {
                    if(item.pn && item.lotno) {
                        outdata.push({ id: outform[0].id, libraries: item.librariesout, pn: item.pn, qty: item.qty, lotno: item.lotno, qty: item.qty })
                    }
                })
                this.$axios({
                    method: 'POST',
                    url: '/api/lotnoout',
                    data: [outform, outdata]
                }).then(res => {
                    if(res.data=='OK') {
                        this.$message({ message: '已生成批号出库记录' + outform[0].id, type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.$message({ message: err, type: 'error' })
                })

            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            })
            this.$axios({
                method: 'GET',
                url: '/api/id',
                params: {id: 'lotnoin'}
            }).then(res => {
                inform[0].id = res.data
                this.$refs.xTable.getTableData().tableData.forEach(item => {
                    for(var i=0;i<this.lotnoInfo.length;i++) {
                        if(item.pn==this.lotnoInfo[i].pn&&item.lotno==this.lotnoInfo[i].lotno) {
                            depart = this.lotnoInfo[i].depart
                        }
                    }
                    if(item.pn && item.lotno) {
                        indata.push({ id: inform[0].id, libraries: item.librariesin, pn: item.pn, qty: item.qty, lotno: item.lotno, qty: item.qty, depart: depart })
                    }
                })
                this.$axios({
                    method: 'POST',
                    url: '/api/lotnoin',
                    data: [inform, indata]
                }).then(res => {
                    if(res.data=='OK') {
                        this.$message({ message: '已生成批号入库记录' + inform[0].id, type: 'success' })
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.$message({ message: err, type: 'error' })
                })

            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            }) 
        },
        deleteIO() {
            this.$axios({
                method: 'GET',
                url: '/api/call',
                params: { proc: 'CALL dellotno("' + this.formData.id + '");' }
            }).then(res => {
                if(res.data[0]['err']==0) {
                    this.$message({ message: '库位调整记录已删除', type: 'success' })
                } else {
                    this.$message({ message: '库位调整记录删除失败, 请手动从数据库中删除', type: 'error' })
                }
            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            })
        }
    }
}
</script>