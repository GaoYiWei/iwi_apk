<template>
    <div>
        <vxe-toolbar>
            <template #buttons>
                <vxe-button @click="editEvent()" :disabled="ctrlDisabled.editBtn">编辑</vxe-button>
                <vxe-button @click="saveEvent()" :disabled="ctrlDisabled.saveBtn">提交</vxe-button>
                <vxe-button @click="deleteEvent()" :disabled="ctrlDisabled.editBtn">删除</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-form class="readonly" :data="formData">
            <vxe-form-item title="单号" field="id" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.id"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="分类" field="cat" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.cat"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="关联单号" field="superiorid" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.superiorid"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="仓库" field="wh" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.wh"></vxe-input>
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
                <vxe-column type="seq" title="序号" width="50"></vxe-column>
                <vxe-column field="pn" title="料号" :edit-render="{name: 'input', props: {type: 'text' }}" width="120"></vxe-column>
                <vxe-column field="name" title="名称" width="160">
                    <template #default="{ row }">
                        <span>{{ getName(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="model" title="规格" width="160">
                    <template #default="{ row }">
                        <span>{{ getModel(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="boxmodel" title="箱规" width="160">
                    <template #default="{ row }">
                        <span>{{ getBoxModel(row) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="qty" title="数量" :edit-render="{name: 'input', props: {type: 'number'}}" width="120"></vxe-column>
                <vxe-column field="libraries" title="库位" :edit-render="{name: 'input', props: {type: 'text'}}" width="120"></vxe-column>
                <vxe-column field="lotno" title="批号" :edit-render="{name: 'input', props: {type: 'text' }}" width="120"></vxe-column>
                <vxe-column field="depart" title="部门" :edit-render="{name: 'input', props: {type: 'text'}}" width="120"></vxe-column>
            </vxe-table>
        </div>
        <vxe-form class="readonly" :data="formData">
            <vxe-form-item field="created" title="创建人" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.created"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="createdat" title="创建时间" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.createdat"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="edited" title="编辑人" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.edited"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item field="editedat" title="编辑时间" :span="4" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.editedat"></vxe-input>
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
            dataTemp: null,
            formData: {
                id: null,
                wh: null,
                cat: null,
                superiorid: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                comment: null
            },
            tableData: [],
            isInsert: true,
            ctrlDisabled: {
                saveBtn: true,
                editBtn: false,
                table: true
            },
            pnQty: {},
            departs: []
        }
    },
    computed: {
        ...mapState(['inventory'])
    },
    mounted() {
        if(this.$route.query.from=='receipt') {
            var formData = JSON.parse(this.$route.query.data)[0][0]
            var tableData = JSON.parse(this.$route.query.data)[1]
            for(var i=0;i<tableData.length;i++) {
                this.pnQty[tableData[i].pn]=tableData[i].qty
            }
            this.$axios({
                method: 'GET',
                url: '/api/call',
                params: { proc: 'CALLGETRECORDSELECT * FROM lotnoin_c LEFT JOIN lotnoin_m ON lotnoin_c.id=lotnoin_m.id WHERE superiorid="' + formData.id + '";' }
            }).then(res => {
                if(res.data.length==0) {
                    this.formData = formData
                    this.tableData = tableData 
                    this.$axios({
                        method: 'GET',
                        url: '/api/id',
                        params: {id: 'lotnoin'}
                    }).then(res => {
                        this.formData.superiorid = this.formData.id
                        this.formData.id = res.data
                        for(var i=0;i<tableData.length;i++) {
                            tableData[i].id = res.data
                        }
                    }).catch(err => {
                        this.$message({ message: err, type: 'error' })
                    })         
                } else {
                    this.formData = res.data[0]
                    this.formData = {
                        id: res.data[0].id,
                        wh: res.data[0].wh,
                        cat: res.data[0].cat,
                        superiorid: res.data[0].superiorid,
                        created: res.data[0].created,
                        createdat: res.data[0].createdat,
                        edited: res.data[0].edited,
                        editedat: res.data[0].editedat,
                        comment: res.data[0].comment
                    }
                    this.tableData = res.data
                    this.isInsert = false
                }
                this.submitLoading = false
            }).catch(err => {
                this.submitLoading = false
                this.$message({ message: err, type: 'error' })
            })
        } else {
            this.$router.push({path: '/'})
        }
        this.$axios({
            method: 'GET',
            url: '/api/departs'
        }).then(res => {
            this.departs = res.data
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
    },
    methods: {
        activeRowMethod ({ row, rowIndex }) {
            return !this.ctrlDisabled.table
        },
        editEvent() {
            if(!this.isInsert) {
                this.dataTemp = JSON.stringify(this.getData())
                this.formData.edited = this.$store.state.user.name
                this.formData.editedat = new Date().toLocaleString('chinese', { hour12: false })
            }
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
                    url: '/api/lotnoin',
                    params: { id: this.formData.id }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.$refs.xTable.remove()
                        this.$message({ message: '删除成功', type: 'success' })
                        this.formData = {
                            id: null,
                            wh: null,
                            cat: null,
                            superiorid: null,
                            created: null,
                            createdat: null,
                            edited: null,
                            editedat: null,
                            comment: null
                        }
                        this.$router.push({ path: '/receipt'} )
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
        saveEvent() {
            var data = this.getData()
            var btnStatus = this.ctrlDisabled
            if(!data) { return }
            if(this.checkQty(this.pnQty, data[1])) { return }
            this.$nuxt.$emit('btnCtrl', 'save', res => {
                this.ctrlDisabled = res
            })
            this.submitLoading = true
            if(!this.isInsert) {
                if(this.dataTemp==JSON.stringify(data)) {
                    this.$message({ message: '数据未修改, 此次未提交' })
                    return
                }
                this.$axios({
                    method: 'PUT',
                    url: '/api/lotnoin',
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
                    this.submitLoading = false
                    this.$message({ message: err, type: 'error' })
                })
            } else {
                this.$axios({
                    method: 'POST',
                    url: '/api/lotnoin',
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
                    this.submitLoading = false
                    this.ctrlDisabled = btnStatus
                    this.$message({ message: err, type: 'error' })
                })
            }
        },
        getData() {
            var res=[[this.formData]], t=[], t1={id: this.formData.id}, r={}, tableData=this.$refs.xTable.getTableData().tableData            
            for(var i=0;i<tableData.length;i++) {
                if(tableData[i].pn && isNaN(tableData[i].qty) || tableData[i].pn && !tableData[i].qty || tableData[i].pn && tableData[i].qty<=0) {
                    this.$message({ message: tableData[i].pn + '未填写有效数量', type: 'warning' })
                    return
                } else if (tableData[i].pn && !tableData[i].libraries) {
                    this.$message({ message: tableData[i].pn + '未填写库位', type: 'warning' })
                    return
                } else if (tableData[i].pn && !tableData[i].depart) {
                    this.$message({ message: tableData[i].pn + '未填写归属部门', type: 'warning' })
                    return
                } else if (tableData[i].pn && !tableData[i].lotno) {
                    this.$message({ message: tableData[i].pn + '未填写批号', type: 'warning' })
                    return
                } else if (!this.regLib(tableData[i].libraries)) {
                    this.$message({ message: tableData[i].pn + ' ' + tableData[i].libraries + '库位格式异常', type: 'warning' })
                    return
                } else if (!this.regLotno(tableData[i].lotno)) {
                    this.$message({ message: tableData[i].pn + ' ' + tableData[i].lotno + '批号格式异常', type: 'warning' })
                    return
                } else if (!this.regDeparts(tableData[i].depart)) {
                    this.$message({ message: tableData[i].pn + ' ' + tableData[i].depart + '部门异常', type: 'warning' })
                    return
                } else if (tableData[i].pn && tableData[i].qty>0) {
                    r={}
                    t.push(Object.assign(r, t1, {pn: tableData[i].pn, libraries: tableData[i].libraries, lotno: tableData[i].lotno, qty: tableData[i].qty, depart: tableData[i].depart}))
                }
            }
            if(t.length==0) {
                this.$message({ message: '未获取到库位批号明细', type: 'warning' })
                return
            } else {
                for(var i=0;i<t.length-1;i++) {
                    for(var j=i+1;j<t.length;j++) {
                        if(t[i].libraries==t[j].libraries && t[i].pn==t[j].pn && t[i].lotno==t[j].lotno && t[i].depart==t[j].depart) {
                            this.$message({ message: '存在库位-料号-批号-部门重复的记录', type: 'warning' })
                            return
                        }
                        if(t[i].pn==t[j].pn && t[i].lotno==t[j].lotno && t[i].depart!=t[j].depart) {
                            this.$message({ message: t[i].pn + ' ' + t[i].lotno + ' 物料部门不一致的记录', type: 'warning' })
                            return
                        }
                    }
                }
            }
            res.push(t)
            return res
        },
        checkQty(pnQty, tableData) {
            var obj = {}
            for(var i=0;i<tableData.length;i++) {
                if(obj[tableData[i].pn]) {
                    obj[tableData[i].pn] += parseFloat(tableData[i].qty)                   
                } else {
                    obj[tableData[i].pn] = parseFloat(tableData[i].qty)
                }
            }
            var o1keys=Object.keys(pnQty)
            var o2keys=Object.keys(obj)
            if(o2keys.length!==o1keys.length) {
                this.$message({ message: '与入库单存在物料差异', type: 'warning' })
                return true
            }
            for(var i=0;i<=o1keys.length-1;i++) {
                var key=o1keys[i]
                if (!o2keys.includes(key)) {
                    this.$message({ message: '存在入库单没有的料号', type: 'warning' })
                    return true
                }
                if (obj[key]!=pnQty[key]) {
                    this.$message({ message: key + '数量与入库数量不一致', type: 'warning' })
                    return true
                }
            }
            return false
        },
        getName(row) {
            if(!row.pn) { return }
            if(Object.keys(this.inventory).length==0) { return }
            if(this.inventory[row.pn]) {
                return this.inventory[row.pn].name
            } else {
                this.$message({ message: '料号不存在, 请刷新后再试', type: 'warning' })
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
        regLotno(lotno) {
            var reg=new RegExp(/^[0-9]{6}$/, 'g'), res=false
            if(reg.test(lotno)&&parseInt(lotno/10000)>21&&parseInt(lotno.toString().substring(2, 4))>0&&parseInt(lotno.toString().substring(2, 4))<13&&parseInt(lotno.toString().substring(4, 6))>0&&parseInt(lotno.toString().substring(4, 6))<32) {
                res = true
            }
            return res
        },
        regLib(lib) {
            var reg=new RegExp(/^[0-9]\-[0-9]{2}\-[0-9]{2}\-[0-9]{2}$/, 'g')
            return reg.test(lib)
        },
        regDeparts(depart) {
            return this.departs.includes(depart)
        }
    }
}
</script>