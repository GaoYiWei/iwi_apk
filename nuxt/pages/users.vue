<template>
    <div>
        <vxe-toolbar>
          <template #buttons>
            <vxe-button icon="vxe-icon-square-plus" @click="insertEvent()">新增</vxe-button>
            <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" @keyup="searchEvent" clearable></vxe-input>
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
            <vxe-column field="account" title="账号" width="300"></vxe-column>
            <vxe-column field="name" title="姓名" width="120"></vxe-column>
            <vxe-column field="pwd" title="密码(HASH)" width="120"></vxe-column>
            <vxe-column field="depart" title="部门" width="80"></vxe-column>
            <vxe-column field="tel" title="电话" width="120"></vxe-column>
            <vxe-column field="created" title="创建人" show-overflow width="90"></vxe-column>
            <vxe-column field="createdat" title="创建时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="edited" title="编辑人" show-overflow width="90"></vxe-column>
            <vxe-column field="editedat" title="编辑时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="status" title="状态" formatter="formatStatus" show-overflow width="60"></vxe-column>
            <vxe-column field="deactivateat" title="停用时间" :visible="false"></vxe-column>
        </vxe-table>

        <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="1000" min-width="600" min-height="600" :loading="submitLoading" resize destroy-on-close>
            <template #default>
                <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="saveEvent">
                    <vxe-form-item title="基本信息" title-align="left" :title-width="200" :span="24" :title-prefix="{icon: 'vxe-icon-comment'}"></vxe-form-item>
                    <vxe-form-item field="account" title="账号" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.account" placeholder="请输入邮箱" :readonly="selectRow==null?false:true"></vxe-input>
                    </template>
                    </vxe-form-item>
                    <vxe-form-item field="name" title="姓名" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.name" placeholder="请输入姓名"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="depart" title="部门" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-select v-model="data.depart" transfer>
                                <vxe-option v-for="item in departsList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                            </vxe-select>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="pwd" title="密码" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.pwd" placeholder="请输入密码"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="tel" title="电话" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.tel" placeholder="请输入电话"></vxe-input>
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
                    <vxe-form-item field="created" title="创建人" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.created" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="createdat" title="创建时间" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.createdat" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="edited" title="编辑人" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.edited" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="editedat" title="编辑时间" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.editedat" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item align="center" title-align="left" :span="24">
                        <template #default>
                            <vxe-button type="submit">提交</vxe-button>
                            <vxe-button @click="banEvent()">{{banBtn}}</vxe-button>
                            <vxe-button @click="deleteEvent()">删除</vxe-button>
                        </template>
                    </vxe-form-item>
                </vxe-form>
            </template>
        </vxe-modal>
    </div>
</template>

<script>
import XEUtils from 'xe-utils'
export default {
    data() {
        return {
            tableData: [],
            tableList: [],
            formData: {
                account: null,
                name: null,
                pwd: null,
                depart: null,
                tel: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                status: 1,
                deactivateat: null
            },
            formDataTemp: null,
            formRules: {
                account: [
                    { required: true, message: '请输入账号' },
                    {
                        validator ({ itemValue}) {
                            var pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ 
                            if(!pattern.test(itemValue)) {
                                return new Error('账号需是邮箱')
                            }
                        }
                    }
                ],
                name: [
                    { required: true, message: '请输入姓名' }
                ],
                pwd: [
                    { required: true, message: '请输入密码' },
                    { min: 5, max: 20, message: '长度限制 5 到 20 个字符' }
                ],
                tel: [
                    { required: true, message: '请输入联系方式' },
                    {
                        validator ({ itemValue }) {
                            if(isNaN(itemValue)) {
                                return new Error('不能含有非数字字符')
                            }
                            if(itemValue.toString().length!=11) {
                                return new Error('长度限制 11 个字符')
                            }
                        }
                    }
                ],
                depart: [
                    { required: true, message: '请选择部门' }
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
            url: '/api/departs'
        }).then(res => {
            res.data['departs'].forEach(item => {
                this.departsList.push({ label: item.name, value: item.name })
            })
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
        this.$axios({
            method: 'GET',
            url: '/api/users'
        }).then(res => {
            this.tableList = res.data['users']
            this.tableData = res.data['users']
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
    },
    methods : {
        insertEvent() {
            this.formData = {
                account: null,
                name: null,
                pwd: null,
                depart: null,
                tel: null,
                created: this.$store.state.user.name,
                createdat: new Date().toLocaleString('chinese', { hour12: false }),
                edited: null,
                editedat: null,
                status: 1,
                deactivateat: null
            }                
            this.selectRow = null
            this.showEdit = true
            this.isEdit = false
        },
        cellDBLClickEvent({ row }) {
            this.formData = {
                account: row.account,
                name: row.name,
                depart: row.depart,
                pwd: row.pwd,
                tel: row.tel,
                created: row.created,
                createdat: row.createdat,
                edited: row.edited,
                editedat: row.editedat,
                status: row.status,
                deactivateat: row.deactivateat
            }
            this.selectRow = row
            this.showEdit = true
            this.isEdit = true
            this.formDataTemp = JSON.stringify(this.formData)
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
            this.saveEvent('banEvent')
        },
        saveEvent(e) {
            this.submitLoading = true
            var $table = this.$refs.xTable
            if (this.selectRow) {
                if(this.formDataTemp==this.formData) {
                    this.$message({ message: '数据未修改, 此次未提交'})
                    return
                }
                var w={ account: null }, v, msg='保存成功'
                w['account'] = this.formData['account']
                if(e=='banEvent') {
                    if(this.formData.status==1||this.formData.status==-1) {
                        msg = '已启用'
                    } else {
                        msg = '已停用'
                    }
                } else {
                    this.formData.edited = this.$store.state.user.name
                    this.formData.editedat = new Date().toLocaleString('chinese', { hour12: false })
                }
                v = JSON.parse(JSON.stringify(this.formData))
                delete v['account']
                this.$axios({
                    method: 'PATCH',
                    url: '/api/users',
                    params: { w: w, v: v }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.isEdit = false
                        this.$message({ message: msg, type: 'success' })
                        Object.assign(this.selectRow, this.formData)
                        this.selectRow = null
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else {
                this.tableData.forEach(item => {
                    if(this.formData.account==item.account) {
                        this.$message({ message: '账号重复', type: 'error' })
                        this.submitLoading = false
                        return
                    }
                })
                this.formData.pwd = this.getHash(this.formData.pwd)
                this.$axios({
                    method: 'POST',
                    url: '/api/users',
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
        deleteEvent() {
            if(this.formData.status==1||this.formData.status==0) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var k = { account: null }
                    k['account'] = this.formData.account
                    this.$axios({
                        method: 'DELETE',
                        url: '/api/users',
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
            } else {
                this.$message({ message: '当前记录不可删除', type: 'warning' })
            }
        },
        searchEvent () {
            const filterName = XEUtils.toValueString(this.filterName).trim().toLowerCase()
            if (filterName) {
                const filterRE = new RegExp(filterName, 'gi')
                const searchProps = ['account', 'name', 'depart', 'tel']
                const rest = this.tableData.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1))
                this.tableList = rest.map(row => {
                    const item = Object.assign({}, row)
                    searchProps.forEach(key => {
                        item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
                    })
                    return item
                })
            } else {
                this.tableList = this.tableData
            }
        },
        getHash(str, size=204820482048){ 
            var hashCode = 0
            for (var i = 0; i < str.length; i++) {
                hashCode = 37 * hashCode + str.charCodeAt(i) 
            } 
            var index = hashCode % size
            return index
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