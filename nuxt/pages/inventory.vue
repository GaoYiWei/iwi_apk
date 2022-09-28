<template>
    <div>
        <vxe-toolbar>
          <template #buttons>
            <vxe-button icon="vxe-icon-square-plus" @click="insertEvent()">新增</vxe-button>
          </template>
        </vxe-toolbar>
        <vxe-table
            border
            stripe
            resizable
            show-overflow
            ref="xTable"
            height="500"
            :row-config="{isHover: true}"
            :data="tableList"
            @cell-dblclick="cellDBLClickEvent">
            <vxe-column field="pn" title="料号" width="120"></vxe-column>
            <vxe-column field="name" title="品名" width="200"></vxe-column>
            <vxe-column field="model" title="型号" width="120"></vxe-column>
            <vxe-column field="namedesc" title="品名描述" width="300"></vxe-column>
            <vxe-column field="manufact" title="厂家" width="200"></vxe-column>
            <vxe-column field="created" title="创建人" show-overflow width="90"></vxe-column>
            <vxe-column field="createdat" title="创建时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="edited" title="编辑人" show-overflow width="90"></vxe-column>
            <vxe-column field="editedat" title="编辑时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="audited" title="审核人" show-overflow width="90"></vxe-column>
            <vxe-column field="auditedat" title="审核时间" :visible="false"></vxe-column>
            <vxe-column field="status" title="状态" formatter="formatStatus" show-overflow width="60"></vxe-column>
            <vxe-column field="deactivateat" title="停用时间" width="180"></vxe-column>
        </vxe-table>

        <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="800" min-width="600" min-height="600" :loading="submitLoading" resize destroy-on-close>
            <template #default>
                <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="saveEvent">
                    <vxe-form-item title="基本信息" title-align="left" :title-width="200" :span="24" :title-prefix="{icon: 'vxe-icon-comment'}"></vxe-form-item>
                    <vxe-form-item field="pn" title="料号" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.pn" placeholder="请输入料号" :readonly="selectRow==null?false:true"></vxe-input>
                    </template>
                    </vxe-form-item>
                    <vxe-form-item field="name" title="品名" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.name" placeholder="请输入品名"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="model" title="型号" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.model" placeholder="请输入规格型号"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="namedesc" title="品名描述" :span="24" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.namedesc" placeholder="请输入品名描述"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="manufact" title="厂家" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.manufact" placeholder="请输入厂家"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="status" title="状态" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <span>{{statusInputBox}}</span>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="deactivateat" title="停用时间" :visible="formData.deactivateat ? true : false" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.deactivateat"></vxe-input>
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
                            <vxe-button type="submit" :disabled="ctrlDisabled.saveBtn">提交</vxe-button>
                            <vxe-button @click="auditEvent()" :disabled="formData.status==-1||formData.status==null?true:ctrlDisabled.auditBtn">{{auditBtn}}</vxe-button>
                            <vxe-button @click="banEvent()" :disabled="formData.audited?false:true">{{banBtn}}</vxe-button>
                            <vxe-button @click="deleteEvent()" :disabled="ctrlDisabled.deleteBtn">删除</vxe-button>
                        </template>
                    </vxe-form-item>
                </vxe-form>
            </template>
        </vxe-modal>
    </div>

</template>

<script>

export default {
    data() {
        return {
            tableData: [],
            tableList: [],
            formData: {
                pn: null,
                name: null,
                model: null,
                namedesc: null,
                manufact: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null,
                status: 0,
                deactivateat: null
            },
            formDataTemp: null,
            formRules: {
                pn: [
                    { required: true, message: '请输入料号' },
                    { min: 9, max: 9, message: '长度限制 9 个字符' }
                ],
                name: [
                    { required: true, message: '请输入姓名' },
                    { min: 2, max: 30, message: '长度限制 2 到 30 个字符' }
                ],
                model: [
                    { required: true, message: '请输入规格型号' },
                    { min: 1, max: 20, message: '长度限制 1 到 30 个字符' }
                ],
                namedesc: [
                    { required: true, message: '请输入品名描述' },
                    {
                        validator ({ itemValue }) {
                            var pattern = /^[\u4E00-\u9FA5A-Za-z0-9;]+$/ 
                            if(!pattern.test(itemValue)) {
                                return new Error('品名描述由中英文及英文分号组成')
                            }
                            if(itemValue.toString().length<2 || itemValue.toString().length>40) {
                                return new Error('长度限制 2 到 40 个字符')
                            }
                        }
                    }
                ],
                manufact: [
                    { required: true, message: '请输入厂家' },
                    { min: 2, max: 15, message: '长度限制 2 到 15 个字符' }
                ]
            }, 
            selectRow: null,
            filterName: '',
            showEdit: false,
            departsList: [],
            submitLoading: false,
            ctrlDisabled: {
                saveBtn: true,
                auditBtn: true,
                deleteBtn: true,
                banBtn: true
            }
        }
    },
    computed: {
        auditBtn() {
            return this.formData.audited ? '弃审' : '审核'
        },
        banBtn() {
            return this.formData.status==1 || this.formData.status==-1 ? '停用' : '启用'
        },
        statusInputBox() {
            return this.formData.status==1 || this.formData.status==-1 ? '启用' : '停用'
        }   
    },
    mounted() {
        this.$axios({
            method: 'GET',
            url: '/api/inventory'
        }).then(res => {
            this.tableList = res.data['inventory']
            this.tableData = res.data['inventory']
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
            this.$nuxt.$emit('btnCtrl', 'add', res => {
                this.ctrlDisabled = res
            })
        },
        cellDBLClickEvent({ row }) {
            this.formData = {
                pn: row.pn,
                name: row.name,
                model: row.model,
                namedesc: row.namedesc,
                manufact: row.manufact,
                created: row.created,
                createdat: row.createdat,
                edited: row.edited,
                editedat: row.editedat,
                audited: row.audited,
                auditedat: row.auditedat,
                status: row.status,
                deactivateat: row.deactivateat
            }
            this.selectRow = row
            this.showEdit = true
            this.formDataTemp = JSON.stringify(this.formData)
            this.$nuxt.$emit('btnCtrl', 'edit', res => {
                this.ctrlDisabled = res
            })
        },
        banEvent() {
            if(this.formData.status==0){
                this.formData.status=1
                this.formData.deactivateat = null
            } else if(this.formData.status==1){
                this.formData.status=0
                this.formData.deactivateat = new Date().toLocaleString('chinese', { hour12: false })
            } else if(this.formData.status==-1){
                this.formData.status=null
                this.formData.deactivateat = new Date().toLocaleString('chinese', { hour12: false })
            } else if(this.formData.status==null){
                this.formData.status=-1
                this.formData.deactivateat = null
            }
            this.saveEvent()
            Object.assign(this.selectRow, this.formData)
        },
        saveEvent() {
            this.submitLoading = true
            var $table = this.$refs.xTable
            if (this.selectRow) {
                if(this.formDataTemp==this.formData) {
                    this.$message({ message: '数据未修改, 此次未提交'})
                    return
                }
                this.formData.edited = this.$store.state.user.name
                this.formData.editedat = new Date().toLocaleString('chinese', { hour12: false })
                var w = { pn: null }, v = JSON.parse(JSON.stringify(this.formData))
                w['pn'] = this.formData['pn']
                delete v['pn']
                console.log({ w: w, v: v })
                this.$axios({
                    method: 'PATCH',
                    url: '/api/inventory',
                    params: { w: w, v: v }
                }).then(res => {
                    console.log(res)
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.$message({ message: '保存成功', type: 'success' })
                        Object.assign(this.selectRow, this.formData)
                        this.$nuxt.$emit('btnCtrl', 'save', res => {
                            this.ctrlDisabled = res
                        })
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
                    url: '/api/inventory',
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
            this.formData.audited = this.$store.state.user.name
            this.formData.auditedat = new Date().toLocaleString('chinese', { hour12: false })
            this.saveEvent()
            this.$nuxt.$emit('btnCtrl', this.formData.audited ? 'unaudit' : 'audit', res => {
                this.ctrlDisabled = res
            })
        },
        deleteEvent() {
            if(this.formData.status==1||this.formData.status==0) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var k = { pn: null }
                    k['pn'] = this.formData.pn
                    this.$axios({
                        method: 'DELETE',
                        url: '/api/inventory',
                        params: k
                    }).then(res => {
                        this.submitLoading = false
                        if(res.data=='OK') {
                            this.showEdit = false
                            this.$refs.xTable.remove(this.selectRow)
                            this.$message({ message: '删除成功', type: 'success' })
                            this.$nuxt.$emit('btnCtrl', 'delete', res => {
                                this.ctrlDisabled = res
                            })
                        } else {
                            this.$message({ message: res.data, type: 'error' })
                        }
                    }).catch(err => {
                        this.submitLoading = false
                        this.$message({ message: err, type: 'error' })
                    })
                })
            } else {
                this.$message({ message: '当前记录不可删除', type: 'warning' })
            }
        }
    }
}
</script>
