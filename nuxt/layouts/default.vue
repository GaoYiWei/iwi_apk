<template>
    <div class="full">
        <div id="header">
            <el-menu router mode="horizontal">
                <el-submenu index="1">
                    <template slot="title">销售管理</template>
                    <el-menu-item index="so">销售订单</el-menu-item>
                    <el-menu-item index="borrow">借用单</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">采购管理</template>
                    <el-menu-item index="po">采购订单</el-menu-item>
                    <el-menu-item index="borrow">借用单</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">生产管理</template>
                    <el-menu-item index="producewh">入库单</el-menu-item>
                    <el-menu-item index="picklist">领料单</el-menu-item>
                    <el-menu-item index="borrow">借用单</el-menu-item>
                    <el-menu-item index="disassemb">拆解单</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">库存管理</template>
                    <el-menu-item index="receipt">入库单</el-menu-item>
                    <el-menu-item index="delivery">出库单</el-menu-item>
                    <el-menu-item index="transfer">调拨单</el-menu-item>
                    <el-menu-item index="borrow">借用单</el-menu-item>
                </el-submenu>
                <el-menu-item index="sbntrace">物料溯源</el-menu-item>
                <el-submenu index="6">
                    <template slot="title">基础数据</template>
                    <el-submenu index="6-1">
                        <template slot="title">物料</template>
                        <el-menu-item index="inventory">存货档案</el-menu-item>
                        <el-menu-item index="inventoryinfo">基础信息</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="bom">BOM</el-menu-item>
                    <el-menu-item index="substitute">替代料</el-menu-item>
                    <el-menu-item index="users">用户</el-menu-item>
                    <el-menu-item index="departs">部门</el-menu-item>
                    <el-menu-item index="whs">仓库</el-menu-item>
                    <el-menu-item index="partners">合作单位</el-menu-item>
                </el-submenu>
            </el-menu>
            <i class="iconfont icon-yonghu login" @click="showLogin()"></i>
            <el-dialog
                title="登录"
                :visible.sync="showLoginForm"
                width="25%"
                center>
                <el-form :model="loginForm" ref="loginForm">
                    <el-form-item
                        prop="account"
                        label="账号"
                        :rules="[
                            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                        ]">
                        <el-input placeholder="请输入账号" v-model="loginForm.account" clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="pwd"
                        label="密码"
                        :rules="[
                            { required: true, message: '请输入密码', trigger: 'blur' }
                        ]">
                        <el-input placeholder="请输入密码" v-model="loginForm.pwd" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="space_around">
                            <el-button type="primary" @click="submitForm()">提交</el-button>
                            <el-button @click="showReset()">重置密码</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog
                title="重置密码"
                :visible.sync="showResetForm"
                width="25%"
                center>
                <el-form :model="resetForm" ref="resetForm">
                    <el-form-item
                        prop="account"
                        label="账号"
                        :rules="[
                            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                        ]">
                        <el-input placeholder="请输入账号" v-model="resetForm.account" clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="pwd"
                        label="密码"
                        :rules="[
                            { required: true, message: '请输入旧密码', trigger: 'blur' }
                        ]">
                        <el-input placeholder="请输入旧密码" v-model="resetForm.pwd" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="pwd"
                        label="密码"
                        :rules="[
                            { required: true, message: '请输入新密码', trigger: 'blur' }
                        ]">
                        <el-input placeholder="请输入新密码" v-model="resetForm.newpwd" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="space_around">
                            <el-button type="primary" @click="resetPwd()">提交</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <div id="body">
            <nuxt/>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showLoginForm: false,
            showResetForm: false,
            loginForm: {
                account: null,
                pwd: null,
                status: 1
            },
            resetForm: {
                account: null,
                pwd: null,
                newpwd: null
            }
        }
    },
    mounted() {
        if(localStorage.getItem('user')) {
            this.$store.commit('setUser', JSON.parse(localStorage.getItem('user')))
            var d = JSON.parse(localStorage.getItem('user'))['depart']
            if(d=='采购部') {
                this.$router.push({ name: 'po' })
            } else if(d=='生产部') {
                this.$router.push({ name: 'picklist' })
            } else if(d=='仓储部') {
                this.$router.push({ name: 'receipt' })
            }
        } else {
            this.showLoginForm = true
            this.$message({ type: 'warning', message: '当前未登录' })
        }
        this.$axios({
            method: 'GET',
            url: '/api/inventory'
        })
        .then((res) => {
            var inventory = {}
            for(var i=0;i<res.data.inventory.length;i++){
                inventory[res.data.inventory[i].pn] = res.data.inventory[i]
            }
            this.$store.commit('setInventory', inventory)
        }).catch(err => {
            this.$message({ message: err, type: 'error' })
        })
        this.$nuxt.$on('isEdit',(formData, formDataTemp, callback) => {
            var res = this.isDifferent(formData, formDataTemp)
            callback(res)
        })
        this.$nuxt.$on('btnCtrl', (btn, callback) => {
            var res = {}
            if(btn=='add') {
                res = { saveBtn: false, auditBtn: true, deleteBtn: true, editBtn: true, table: false }
            } else if(btn=='save') {
                res = { saveBtn: true, auditBtn: false, deleteBtn: false, editBtn: false, table: true }
            } else if(btn=='audit') {
                res = { saveBtn: true, auditBtn: false, deleteBtn: true, editBtn: true, table: true }
            } else if(btn=='unaudit') {
                res = { saveBtn: true, auditBtn: false, deleteBtn: false, editBtn: false, table: true }
            } else if(btn=='delete') {
                res = { saveBtn: true, auditBtn: true, deleteBtn: true, editBtn: true, table: true }
            } else if(btn=='edit') {
                res = { saveBtn: false, auditBtn: true, deleteBtn: true, editBtn: true, table: false }
            }
            callback(res)
        })
    },
    methods : {
        showLogin() {
            if(localStorage.getItem('token')) {
                this.$confirm('即将退出, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.showLoginForm = true
                    localStorage.clear()
                    this.$message({
                        type: 'success',
                        message: '已退出!'
                    })
                })
            } else {
                this.showLoginForm = true
            }
        },
        submitForm() {
            this.$refs['loginForm'].validate((valid) => {
                if(valid) {
                    this.loginForm.pwd = this.getHash(this.loginForm.pwd)
                    this.$axios({
                        url: '/api/login',
                        params: this.loginForm
                    }).then(res => {
                        if(res.data.token) {
                            localStorage.setItem('token', res.data.token)
                            localStorage.setItem('user', JSON.stringify(res.data.user))
                            this.$message({ type: 'success', message: '登录成功' })
                            this.showLoginForm = false
                        } else {
                            this.$message({ type: 'error', message: res.data.err })
                        }
                    }).catch(err => {
                        this.$message({ type: 'error', message: err })
                    })
                } else {
                    this.$message({ type: 'error', message: '账号信息错误' })
                }
            })
        },
        resetPwd() {
            this.$refs['resetForm'].validate((valid) => {
                if(valid) {
                    this.resetForm.pwd = this.getHash(this.resetForm.pwd)
                    this.resetForm.newpwd = this.getHash(this.resetForm.newpwd)
                    var w = { account: null, pwd: null }, v = { pwd: null }
                    w.account = this.resetForm.account
                    w.pwd = this.resetForm.pwd
                    v.pwd = this.resetForm.newpwd
                    this.$axios({
                        method: 'GET',
                        url: '/api/reset',
                        params: { w: w, v: v }
                    }).then(res => {        
                        if(res.data=='OK') {
                            this.$message({ message: '密码修改成功', type: 'success' })
                            this.resetForm = { account: null, pwd: null, newpwd: null }
                            this.showResetForm = false
                        } else {
                            this.$message({ message: res.data, type: 'warning' })
                        }
                    }).catch(err => {
                        this.$message({ type: 'error', message: err })
                    })
                } else {
                    this.$message({ type: 'error', message: '账号信息错误' })
                }
            })
        },
        showReset() {
            this.showResetForm = true
        },
        getHash(str, size=204820482048){ 
            var hashCode = 0
            for (var i = 0; i < str.length; i++) {
                hashCode = 37 * hashCode + str.charCodeAt(i) 
            } 
            var index = hashCode % size
            return index
        },
        isDifferent(object1, object2) {
            var o1keys=Object.keys(object1)
            var o2keys=Object.keys(object2)
            if(o2keys.length!==o1keys.length) { return true }
            for(var i=0;i<=o1keys.length-1;i++) {
                var key=o1keys[i]
                if (!o2keys.includes(key)) { return true }
                if (object2[key]!==object1[key]) { return true }
            }
            return false
        }
    }
}
</script>

<style scoped>
    .full {
        height: 100%;
        width: 100%; 
    }
    #header {
        height: 6%;
        width: 100%;
        margin-top: -0.2rem ;
        overflow: hidden;
        border-bottom: 0.2rem solid rgb(160, 160, 160);
    }
    #body {
        height: 94%;
        width: 98%;
        padding: 0 1% 0 1%;
        overflow-y: scroll;
    }
    .login{
        font-size: 3rem;
        position: fixed;
        top: 1rem;
        right: 0;
    }
</style>