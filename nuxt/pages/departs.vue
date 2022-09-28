<template>
    <div>
        <vxe-toolbar> 
            <template #buttons>
                <el-tooltip content="选中ID添加下级部门" placement="top">
                    <vxe-button icon="el el-icon-plus" @click="insertEvent()">新增</vxe-button>
                    <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" @keyup="searchEvent"></vxe-input>
                </el-tooltip>
            </template>
        </vxe-toolbar>  
        <vxe-table
            resizable
            show-overflow
            highlight-hover-row
            ref="xTable"
            row-key
            :data="tableList"
            :row-config="{isHover: true}"
            :tree-config="{rowField:'id', accordion: true, line: true, expandAll: true}"
            :radio-config="{trigger: 'row', labelField: 'name', highlight: true, range: true, strict: false}"
            @cell-dblclick="cellDBLClickEvent">        
            <vxe-column field="name" title="名称" type="radio" tree-node></vxe-column>
            <vxe-column field="created" title="创建人"></vxe-column>
            <vxe-column field="createdat" title="创建时间"></vxe-column>
            <vxe-column field="edited" title="编辑人"></vxe-column>
            <vxe-column field="editedat" title="编辑时间"></vxe-column>
            <vxe-column field="status" title="状态" formatter="formatStatus"></vxe-column>
            <vxe-column field="deactivateat" title="停用时间"></vxe-column>
        </vxe-table>
        <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="600" min-width="400" min-height="300" :loading="submitLoading" resize destroy-on-close>
            <template #default>
                <vxe-form ref="partnersForm" :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="saveEvent">
                    <vxe-form-item title="基本信息" title-align="left" :title-width="200" :span="24" :title-prefix="{icon: 'vxe-icon-comment'}"></vxe-form-item>
                    <vxe-form-item field="id" title="ID" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.id" readonly></vxe-input>
                    </template>
                    </vxe-form-item>
                    <vxe-form-item field="name" title="名称" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.name" placeholder="请输入名称" @change="checkName()"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="status" title="状态" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <span>{{statusInputBox}}</span>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="deactivateat" title="停用时间" :visible="formData.deactivateat ? true : false" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.deactivateat"></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="created" title="创建人" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.created" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="createdat" title="创建时间" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.createdat" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="edited" title="编辑人" :span="12" :item-render="{}">
                        <template #default="{ data }">
                            <vxe-input v-model="data.edited" readonly></vxe-input>
                        </template>
                    </vxe-form-item>
                    <vxe-form-item field="editedat" title="编辑时间" :span="12" :item-render="{}">
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
export default {
    data() {
        return {
            selectRow: null,
            showEdit: false,
            submitLoading: false,
            filterName: '',
            tableList: [],
            formData: {
                id: null,
                name: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null,
                status: null,
                deactivateat: null
            },
            formDataTemp: null,
            formRules: {
                name: [
                    { required: true, message: '请输入名称' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符' }
                ]            
            },
            tableData: [],
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
            var r = [], arr = res.data['departs']
            arr.forEach(item => {
                if(item.id<10) {
                    r.push(item)
                }
            })
            for(var i=0;i<arr.length;i++) {
                if(arr[i]['id']>100) {
                    for(var j=0;j<r.length;j++) {
                        if(parseInt(arr[i]['id']/100)==r[j]['id']) {
                            if(!r[j]['children']) { r[j]['children'] = [] }
                            r[j]['children'].push(arr[i])
                        }
                    }
                }
            }
            this.tableList = r
            this.tableData = r
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
    },
    methods : {
        cellDBLClickEvent({ row }) {
            this.formData = {
                id: row.id,
                name: row.name,             
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
            this.isEdit = true
            this.formDataTemp = JSON.parse(JSON.stringify(this.formData))
        },
        insertEvent () {
            var id = 1
            if(this.$refs.xTable.selectRow) {
                this.selectRow = this.$refs.xTable.selectRow
                if(this.selectRow.id>100) {
                    this.$message({ message: '不支持2层以上组织架构', type: 'warning' })
                    return
                }
                if(this.selectRow.children && this.selectRow.children.length!=0) {
                    id = this.selectRow.children.length + 1
                }
                id = this.selectRow.id * 100 + id
            } else {
                if(this.tableData.length!=0) {
                    id = this.tableData.length + 1
                }
            }
            this.formData = {
                id: id,
                name: null,
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
        saveEvent() {
            this.submitLoading = true
            var $table = this.$refs.xTable
            if(this.isEdit) {      
                this.$nuxt.$emit('isEdit', this.formDataTemp, this.formData, res => {
                    if(!res) {
                        this.$message({ message: '数据未修改, 此次未提交'})
                        return
                    }
                })
                var w = { id: null }, v = JSON.parse(JSON.stringify(this.formData))
                w['id'] = this.formData['id']
                delete v['id']
                this.formData.edited = this.$store.state.user.name
                this.formData.editedat = new Date().toLocaleString('chinese', { hour12: false })
                this.$axios({
                    method: 'PATCH',
                    url: '/api/departs',
                    params: { w: w, v: v }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.isEdit = false
                        this.$message({ message: '保存成功', type: 'success' })
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
                var d = JSON.parse(JSON.stringify(this.formData))
                this.$axios({
                    method: 'POST',
                    url: '/api/departs',
                    data: [d]
                }).then(res => {
                    this.submitLoading = false                 
                    if(res.data=='OK') {
                        this.showEdit = false
                        this.$message({ message: '保存成功', type: 'success' })
                        if(this.formData.id<10) {
                            this.tableData.push(this.formData)
                        } else {
                            this.tableData.forEach(item => {
                                if(item.id==parseInt(this.formData.id/100)) {
                                    if(!item.children) { item.children = [] }
                                    item.children.push(this.formData)
                                    return
                                }
                            })
                        }                        
                        $table.reloadData(this.tableData)
                    } else {
                        this.$message({ message: res.data, type: 'error' })
                    }                  
                }).catch(err => {
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
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
            this.saveEvent()
            Object.assign(this.selectRow, this.formData)
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
                        url: '/api/departs',
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
        checkName() {
            var status = true, data=this.$refs.xTable.getTableData().tableData
            a:for(var i=0;i<data.length;i++) {
                if(data[i].name==this.formData.name) {
                    status = false
                    break a
                }
                if(data[i].children) {
                    for(var j=0;j<data[i].children.length;j++) {
                        if(data[i].children[j].name==this.formData.name) {
                            status = false
                            break a
                        }
                    }
                }
            }
            if(!status) {
                this.$message({ message: '名称已存在', type: 'error' })
                this.formData.name = null
            }
            return status
        },
        searchEvent () {
            const filterName = XEUtils.toValueString(this.filterName).trim().toLowerCase()
            if(filterName) {
                const filterRE = new RegExp(filterName, 'gi')
                const searchProps = ['name', 'role', 'age', 'address']
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
        }
    }
}
</script>
