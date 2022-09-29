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
            <vxe-column field="id" title="ID" :formatter="['formatID', 6]" width="80"></vxe-column>
            <vxe-column field="name" title="名称" width="400"></vxe-column>
            <vxe-column field="abbr" title="简称" width="120"></vxe-column>
            <vxe-column field="liaision" title="联系人" width="80"></vxe-column>
            <vxe-column field="tel" title="电话" width="120"></vxe-column>
            <vxe-column field="code" title="代码" show-overflow width="180"></vxe-column>
            <vxe-column field="cat" title="分类" width="80" show-overflow :filters="catList" :filter-multiple="true"></vxe-column>
            <vxe-column field="bank" title="银行" width="130" show-overflow :filters="bankList" :filter-multiple="false"></vxe-column>
            <vxe-column field="bc" title="银行卡" width="180" show-overflow></vxe-column>
            <vxe-column field="level" title="等级" width="80" show-overflow  :filters="levelList" :filter-multiple="false"></vxe-column>
            <vxe-column field="created" title="创建人" show-overflow width="90"></vxe-column>
            <vxe-column field="createdat" title="创建时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="edited" title="编辑人" show-overflow width="90"></vxe-column>
            <vxe-column field="editedat" title="编辑时间" show-overflow :visible="false"></vxe-column>
            <vxe-column field="status" title="状态" formatter="formatStatus" show-overflow width="60"></vxe-column>
            <vxe-column field="deactivateat" title="停用时间"></vxe-column>
        </vxe-table>

        <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="800" min-width="600" min-height="300" :loading="submitLoading" resize destroy-on-close>
            <template #default>
                <vxe-form ref="partnersForm" :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="saveEvent">
                    <vxe-form-item title="基本信息" title-align="left" :title-width="200" :span="24" :title-prefix="{icon: 'vxe-icon-comment'}"></vxe-form-item>
                    <vxe-form-item field="id" title="ID" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.id" readonly></vxe-input>
                    </template>
                    </vxe-form-item>
                    <vxe-form-item field="name" title="名称" :span="10" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.name" placeholder="请输入名称"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="abbr" title="简称" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.abbr" placeholder="请输入简称"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="liaision" title="联系人" :span="7" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.liaision" placeholder="请输入联系人"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="tel" title="电话" :span="7" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.tel" placeholder="请输入电话"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="code" title="代码" :span="10" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.code" placeholder="请输入代码"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="cat" title="类型" :span="6" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-select v-model="data.cat" transfer>
                                <vxe-option v-for="item in catList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                            </vxe-select>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="bank" title="银行" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-select v-model="data.bank" transfer>
                                <vxe-option v-for="item in bankList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                            </vxe-select>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="bc" title="卡号" :span="10" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.bc" placeholder="请输入银行卡号"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="level" title="等级" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-select v-model="data.level" transfer>
                                <vxe-option v-for="item in levelList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                            </vxe-select>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="status" title="状态" :span="8" :item-render="{}">
                        <template #default="{ data }">
                            <span>{{statusInputBox}}</span>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="deactivateat" title="停用时间" :visible="formData.deactivateat ? true : false" :span="8" :item-render="{}">
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
                    <vxe-form-item align="center" title-align="left" :span="24">
                        <template #default>
                            <vxe-button type="submit">提交</vxe-button>
                            <vxe-button @click="banEvent()" :disabled="isEdit?false:true">{{banBtn}}</vxe-button>
                            <vxe-button @click="deleteEvent()" :disabled="isEdit?false:true">删除</vxe-button>
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
            catList: [
                { label: '供应商', value: '供应商' },
                { label: '客户', value: '客户' },
                { label: '双向', value: '双向' }
            ],
            bankList: [
                { label: '中国银行', value: '中国银行' },
                { label: '农业银行', value: '农业银行' },
                { label: '交通银行', value: '交通银行' },
                { label: '建设银行', value: '建设银行' },
                { label: '工商银行', value: '工商银行' },
                { label: '邮政储蓄银行', value: '邮政储蓄银行' },
                { label: '招商银行', value: '招商银行' },
                { label: '光大银行', value: '光大银行' },
                { label: '民生银行', value: '民生银行' },
                { label: '中信银行', value: '中信银行' },
                { label: '广发银行', value: '广发银行' },
                { label: '浦发银行', value: '浦发银行' }
            ],
            levelList: [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
                { label: '5', value: 5 }
            ],
            formData: {
                id: null,
                name: null,
                abbr: null,
                liaision: null,
                tel: null,
                code: null,
                bank: null,
                bc: null,
                cat: null,
                level: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                status: null,
                deactivateat: null
            },
            formRules: {
                name: [
                    { required: true, message: '请输入名称' }
                ],
                abbr: [
                    { required: true, message: '请输入简称' },
                    { min: 2, max: 5, message: '长度限制 2 到 5 个字符' }
                ],
                liaision: [
                    { required: true, message: '请输入联系人' },
                    { min: 2, max: 4, message: '长度限制 2 到 4 个字符' }
                ],
                tel: [
                    { required: true, message: '请输入联系方式' },
                    {
                        validator ({ itemValue }) {
                            var pattern = /^(0\d{2,3}-\d{7,8}(-\d{3,5}){0,1})|(((13[0-9])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8})$/ 
                            if(!pattern.test(itemValue)) {
                                return new Error('联系方式异常')
                            }
                        }
                    }
                ],
                cat: [
                    { required: true, message: '请选择分类' }
                ]
            },          
            tableData: [],
            selectRow: null,
            showEdit: false,
            submitLoading: false,
            filterName: '',
            tableList: [],
            formDataTemp: null,
            isEdit: false
        }
    },
    mounted() {
        this.$axios({
            method: 'GET',
            url: '/api/partners'
        }).then(res => {
            this.tableList = res.data['partners']
            this.tableData = res.data['partners']
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
    },
    computed: {
        banBtn() {
            return this.formData.status==1 || this.formData.status==-1 ? '停用' : '启用'
        },
        statusInputBox() {
            return this.formData.status==1 || this.formData.status==-1 ? '启用' : '停用'
        }   
    },
    methods : {
        cellDBLClickEvent({ row }) {
            this.formData = {
                id: (Array(6).join(0)+row.id).slice(-6),
                name: row.name,
                liaision: row.liaision,
                tel: row.tel,
                abbr: row.abbr,
                code: row.code,
                bank: row.bank,
                cat: row.cat,
                bc: row.bc,
                level: row.level,
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
            this.formDataTemp = JSON.parse(JSON.stringify(this.formData))
        },
        insertEvent() {
            this.$axios({
                method: 'GET',
                url: '/api/id',
                params: { id: 'partners' }
            }).then(res => {
                this.formData = {
                    id: res.data,
                    name: null,
                    abbr: null,
                    code: null,
                    liaision: null,
                    tel: null,
                    bank: null,
                    cat: null,
                    bc: null,
                    level: 1,
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
            }).catch(err => {
                this.$message({ message: err, type: 'warning' })
            })
        },
        saveEvent(e) {
            this.submitLoading = true
            if(this.selectRow) {
                if(this.formDataTemp==JSON.stringify(this.formData)) {
                    this.$message({ message: '数据未修改, 此次未提交'})
                    this.submitLoading = false
                    return
                }
                var w={}, v, msg='保存成功'
                w['id'] = this.formData['id']
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
                delete v['id']
                this.$axios({
                    method: 'PATCH',
                    url: '/api/partners',
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
                this.$axios({
                    method: 'POST',
                    url: '/api/partners',
                    data: [this.formData]
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.$message({ message: '保存成功', type: 'success' })
                        this.$refs.xTable.insert(this.formData)  
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
                    var k = { id: null }
                    k['id'] = this.formData.id
                    this.$axios({
                        method: 'DELETE',
                        url: '/api/partners',
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
        searchEvent () {
            // const filterName = XEUtils.toValueString(this.filterName).trim().toLowerCase()
            // if (filterName) {
            //     const filterRE = new RegExp(filterName, 'gi')
            //     const searchProps = ['id', 'name', 'abbr', 'liaision', 'tel', 'code']
            //     const rest = this.tableData.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1))
            //     this.tableList = rest.map(row => {
            //         const item = Object.assign({}, row)
            //         searchProps.forEach(key => {
            //             item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
            //         })
            //         return item
            //     })
            // } else {
            //     this.tableList = this.tableData
            // }
            const filterNames = XEUtils.toValueString(this.filterNames).trim().toLowerCase()
            if (filterNames) {
            const searchProps = ['id', 'name', 'abbr', 'liaision', 'tel', 'code']
            const rest = this.tableData.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterNames) > -1))
            this.tableList = rest.map(row => {
                const item = Object.assign({}, row)
                return item
            })
            } else {
            this.tableList = this.tableData
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