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
        <vxe-form :class="{ 'readonly': ctrlDisabled.table }" :data="formData" :rules="formRules" ref="soForm">
            <vxe-form-item title="单号" field="id" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.id" readonly></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="分类" field="cat" :item-render="{}">
                <template #default="{ data }">
                    <vxe-select v-model="data.cat">
                        <vxe-option value="销售" label="销售"></vxe-option>
                        <vxe-option value="退货" label="退货"></vxe-option>
                        <vxe-option value="借用" label="借用"></vxe-option>
                    </vxe-select>
                </template>
            </vxe-form-item>
            <vxe-form-item title="合同" field="contract" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.contract" @blur="validContract()"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="发货时间" field="deliverat"  :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.deliverat" type="date"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="客户" field="buyer" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.buyer" placeholder="代码/简称" @blur="getBuyerEvent()"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="收货人" field="cnee" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.cnee" @blur="getCneeEvent()"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="电话" field="tel" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.tel"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="地址" field="addr" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.addr" @click="showAddrForm=true" readonly></vxe-input>
                    <vxe-modal v-model="showAddrForm" title="收货地址" width="1000" height="600" resize remember>
                        <template #default>
                        <vxe-form ref="addrForm" :rules="addrRules" :data="addrData" title-align="right" title-width="60" @submit="editAddrEvent">
                            <vxe-form-item title="省" field="province" span="6">
                                <template #default="{ data }">
                                    <vxe-select v-model="data.province">
                                        <vxe-option v-for="item in provinceList" :value="item" :label="item" :key="item"></vxe-option>
                                    </vxe-select>
                                </template>
                            </vxe-form-item>
                            <vxe-form-item title="市" field="city" span="8">
                                <template #default="{ data }">
                                    <vxe-select v-model="data.city">
                                        <vxe-option v-for="item in cityList" :value="item" :label="item" :key="item"></vxe-option>
                                    </vxe-select>
                                </template>
                            </vxe-form-item>
                            <vxe-form-item title="县" field="county" span="10">
                                <template #default="{ data }">
                                    <vxe-select v-model="data.county">
                                        <vxe-option v-for="item in countyList" :value="item" :label="item" :key="item"></vxe-option>
                                    </vxe-select>
                                </template>
                            </vxe-form-item>
                            <vxe-form-item title="详细地址" field="detail" span="24">
                                <template #default="{ data }">
                                    <vxe-input v-model="data.detail"></vxe-input>
                                </template>
                            </vxe-form-item>
                            <vxe-form-item align="center" span="24">
                            <template #default>
                                <vxe-button type="submit" status="primary">确定</vxe-button>
                                <vxe-button type="reset">重置</vxe-button>
                            </template>
                            </vxe-form-item>
                        </vxe-form>
                        </template>
                    </vxe-modal>
                </template>
            </vxe-form-item>
            <vxe-form-item title="备注" field="comment" :item-render="{}">
                <template #default="{ data }">
                    <vxe-input v-model="data.comment"></vxe-input>
                </template>
            </vxe-form-item>
            <vxe-form-item title="状态" field="status" :item-render="{}">
                <template #default="{}">
                    <vxe-input v-model="status"></vxe-input>
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
                height="660"
                header-align="center"
                :row-config="{isHover: true, isCurrent: true, useKey: true}"
                :data="tableData"
                :edit-config="{trigger: 'click', mode: 'row'}">
                <vxe-column type="seq" title="序号" width="80"></vxe-column>
                <vxe-column field="pn" title="料号" :edit-render="{name: 'input', props: {type: 'text' }}" width="120"></vxe-column>
                <vxe-column field="qty" title="数量" :edit-render="{name: 'input', props: {type: 'number'}}" width="120"></vxe-column>
                <vxe-column field="taxincluded" title="含税价" :edit-render="{name: 'input', props: {type: 'number'}}" width="120"></vxe-column>
                <vxe-column field="taxrate" title="税率" :edit-render="{name: 'input', props: {type: 'number'}}" width="120"></vxe-column>
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
            addr: {},
            formData: {
                id: null,
                contract: null,
                deliverat: null,
                buyer: null,
                cat: null,
                cnee: null,
                addr: null,
                tel: null,
                created: null,
                createdat: null,
                edited: null,
                editedat: null,
                audited: null,
                auditedat: null,
                status: 0,
                comment: null
            },
            formRules: {
                contract: [
                    { required: true, message: '请输入合同号' }
                ],
                deliverat: [
                    { required: true, message: '请输入发货时间' },
                    {
                        validator ({ itemValue }) {
                            var y=new Date().getFullYear(), m=new Date().getMonth()+1, d=new Date().getDate()
                            if(Date.parse(itemValue)<Date.parse(y + '/' + m + '/' + d)) {
                                return new Error('发货日期不能早于今日')
                            }
                        }
                    }
                ],
                buyer: [
                    { required: true, message: '请选择客户' }
                ],
                cat: [
                    { required: true, message: '请选择类型' }
                ],
                cnee: [
                    { required: true, message: '请输入收货人' },
                    { min: 2, max: 4, message: '姓名长度异常' }
                ],
                addr: [
                    { required: true, message: '请选择地址' }
                ],
                tel: [
                    { required: true, message: '请输入电话' },
                    {
                        validator ({ itemValue }) {
                            var pattern = /^(0\d{2,3}-\d{7,8}(-\d{3,5}){0,1})|(((13[0-9])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8})$/ 
                            if(!pattern.test(itemValue)) {
                                return new Error('联系方式异常')
                            }
                        }
                    }
                ]
            },
            addrData: {
                province: null,
                city: null,
                county: null,
                detail: null
            },
            addrRules: {
                province: [
                    { required: true, message: '请选择省' }
                ],
                city: [
                    { required: true, message: '请选择市' }
                ],
                county: [
                    { required: true, message: '请选择区/市/县' }
                ],
                detail: [
                    { required: true, message: '请输入详细地址'}
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
            showAddrForm: false,
            provinceList: [],
            buyerList: [],
            cneeList: {},
            contractList: [],
            isInsert: false
        }
    },
    computed: {
        ...mapState(['inventory']),
        status() {
            if(this.formData.status==0) {
                return '待审核'
            } else if(this.formData.status==1) {
                return '待出库'
            } else if(this.formData.status==-1) {
                return '已完结'
            } else {
                return '有出库'
            }
        },
        auditBtn() {
            return this.formData.audited ? '弃审' : '审核'
        },
        cityList() {
            if(this.addrData['province']) {
                return this.addr['city'][this.addrData.province]
            } else {
                return []
            }            
        },
        countyList() {
            if(this.addrData['city']) {
                return this.addr['county'][this.addrData.province][this.addrData.city]
            } else  {
                return []
            }
        }
    },
    mounted() {
        if(this.$route.query.id) {
            setTimeout(() => {
                this.searchVal = this.$route.query.id
                this.searchEvent()
            }, 300)
        }
        this.submitLoading = true
        if(!localStorage.getItem('addr')) {
            this.$axios({
                method: 'GET',
                url: '/api/addr'
            }).then(res => {
                localStorage.setItem('addr', JSON.stringify(res.data))
                this.addr = res.data
                this.provinceList = this.addr['province']
            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            })
        } else {
            this.addr = JSON.parse(localStorage.getItem('addr'))
            this.provinceList = this.addr['province']
        }
        this.$axios({
            method: 'GET',
            url: '/api/partners'
        }).then(res => {           
            var buyer={id:null,abbr:null,status:null,cat:null}
            res.data['partners'].forEach(item => {
                buyer={ id: item.id, abbr: item.abbr, status: item.status, cat: item.cat }
                this.buyerList.push(buyer)
            })
            this.submitLoading = false
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
                        <div class="header">销售单</div>
                        <img class="qrcode" src="`+url+`"/>
                        <div>
                            <div class="fill-row">
                                <span class="fill-title">单号：</span>
                                <span class="fill-value">`+this.formData.id+`</span>
                                <span class="fill-title">分类：</span>
                                <span class="fill-value">`+this.formData.cat+`</span>
                                <span class="fill-title">合同：</span>
                                <span class="fill-value">`+this.formData.contract+`</span>
                                <span class="fill-title">发货时间：</span>
                                <span class="fill-value">`+this.formData.deliverat+`</span>
                                <span class="fill-title">客户：</span>
                                <span class="fill-value">`+this.formData.buyer+`</span>
                                <span class="fill-title">收货人：</span>
                                <span class="fill-value">`+this.formData.cnee+`</span>
                                <span class="fill-title">电话：</span>
                                <span class="fill-value">`+this.formData.tel+`</span>
                                <span class="fill-title">地址：</span>
                                <span class="fill-value">`+this.formData.addr+`</span> 
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
        getCneeEvent() {
            if(this.cneeList[this.formData.cnee]) {
                this.formData.tel = this.cneeList[this.formData.cnee]['tel']
                this.formData.addr = this.cneeList[this.formData.cnee]['addr']
            }
        },
        getBuyerEvent() {
            var code = null
            if(Number(this.formData.buyer)) {
                code = (Array(6).join(0) + (parseInt(this.formData.buyer))).slice(-6)
                for(var i=0;i<this.buyerList.length;i++){
                    if(code==this.buyerList[i].id){
                        if(this.buyerList[i].status==0||this.buyerList[i].status==null){
                            this.$message({ message: '当前客户已停用！', type: 'warning' })
                            this.formData.buyer = null
                            return
                        }
                        if(this.buyerList[i].cat=='供应商') {
                            this.$message({ message: '此合作商类别为供应商', type: 'warning' })
                            this.formData.buyer = null
                            return
                        }
                        this.formData.buyer = this.buyerList[i].abbr
                        return
                    }
                    if(i==this.buyerList.length-1){
                        this.$message.error('未匹配到对应的客户！')
                        this.formData.buyer = null
                        return
                    }
                }
            } else {
                var reg = new RegExp('\w*'+this.formData.buyer+'\w*','gi')
                for(var i=0;i<this.buyerList.length;i++) {
                    if(reg.test(this.buyerList[i].abbr)) {
                        if(this.buyerList[i].status==0||this.buyerList[i].status==null){
                            this.$message({ message: '当前客户已停用！', type: 'warning' })
                            this.formData.buyer = null
                            return
                        }
                        if(this.buyerList[i].cat=='供应商') {
                            this.$message({ message: '此合作商类别为供应商', type: 'warning' })
                            this.formData.buyer = null
                            return
                        }
                        this.formData.buyer = this.buyer[i].abbr
                        return
                    }
                    if(i==this.buyerList.length-1){
                        this.$message.error('未匹配到对应的客户！')
                        this.formData.buyer = null
                        return
                    }
                }
            }
        },
        editAddrEvent() {
            this.$refs['addrForm'].validate(valid => {
                if(!valid) {
                    this.formData.addr = this.addrData.province + ' ' + this.addrData.city + ' ' + this.addrData.county + ' ' + this.addrData.detail
                    this.showAddrForm = false
                }
            })
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
                    url: '/api/so',
                    params: { id: this.searchVal }
                }).then(res => {
                    if(res.data['so_m'].length==0) {
                        this.$message({ message: '没有找到记录', type: 'warning' })
                        return
                    }
                    this.submitLoading = false
                    this.formData = res.data['so_m'][0]
                    this.tableData = res.data['so_c']
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
                url: '/api/so'
            }).then(res => {
                if(res.data['so_m'].length>0) {
                    res.data['so_m'].forEach(item => {
                        this.cneeList[item.cnee] = {tel: item.tel, addr: item.addr}
                        if(item.cat=='销售') {
                            this.contractList.push(item.contract)
                        }
                    })
                }
            }).catch(err => {
                this.$message({ message: err, type: 'error' })
            })
            this.$axios({
                method: 'GET',
                url: '/api/id',
                params: {id: 'so'}
            }).then(res => {
                this.formData = {
                    id: res.data,
                    contract: null,
                    deliverat: null,
                    buyer: null,
                    cat: null,
                    cnee: null,
                    addr: null,
                    tel: null,
                    created: this.$store.state.user.name,
                    createdat: new Date().toLocaleString('chinese', { hour12: false }),
                    edited: null,
                    editedat: null,
                    audited: null,
                    auditedat: null,
                    status: 0,
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
                    url: '/api/so',
                    params: { id: this.formData.id }
                }).then(res => {
                    this.submitLoading = false
                    if(res.data=='OK') {
                        this.isEdit = false
                        this.formData = {
                            id: null,
                            contract: null,
                            deliverat: null,
                            vendor: null,
                            cat: null,
                            cnee: null,
                            addr: null,
                            tel: null,
                            created: null,
                            createdat: null,
                            edited: null,
                            editedat: null,
                            audited: null,
                            auditedat: null,
                            status: 0,
                            comment: null
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
                url: '/api/so',
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
            this.$refs['soForm'].validate((valid) => {
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
                            url: '/api/so',
                            data: data
                        }).then(res => {
                            this.submitLoading = false
                            if(res.data=='OK') {
                                this.$message({ message: '保存成功', type: 'success' })
                                this.isEdit = false
                            } else {
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
                            url: '/api/so',
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
                this.$message({ message: '未填写销售明细', type: 'error' })
                return
            }
            res.push(t)
            return res
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
        validContract() {
            if(!this.formData.cat) {
                this.$message({ message: '类别未选择', type: 'warning' })
                return
            }
            if(this.contractList.indexOf(this.formData.contract)>=0&&this.formData.cat!='退货') {
                this.formData.contract = null
                this.$message({ message: '合同号已存在', type: 'warning' })
            } else if(this.contractList.indexOf(this.formData.contract)<0&&this.formData.cat=='退货') {
                this.formData.contract = null
                this.$message({ message: '合同号不存在', type: 'warning' })
            }
        }
    }
}
</script>