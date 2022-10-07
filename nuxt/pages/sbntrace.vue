<template>
    <div>
        <div style="width: 30%; margin: 3rem 0 0 4rem;">
            <vxe-toolbar>
                <template #buttons>
                <vxe-input style="width: 20rem" v-model="searchVal" placeholder="请输入SN/BN" type="search" clearable @keyup.enter.native="searchEvent()" @search-click="searchEvent()"></vxe-input>
                </template>
            </vxe-toolbar>
            <el-timeline>
                <el-timeline-item v-for="(history, index) in history" :key="index" :timestamp="new Date(history.createdat).toLocaleDateString()" placement="top">
                    <el-card>
                        <h4>更新状态：{{history.cat}} : {{history.orderid}}   数量：{{history.qty}}</h4>
                        <p style="padding-top: 20px">{{ history.created }} 提交于 {{new Date(history.createdat).toLocaleString('chinese',{hour12:false})}}</p> 
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>

    </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            searchVal: null,
            history: null
        }
    },
    computed: {
        ...mapState(['inventory'])
    },
    mounted() {
    },
    methods : {
        async searchEvent() {
            if(this.searchVal.length!=18||(this.searchVal.substr(-1)!=1&&this.searchVal.substr(-1)!=0)||!this.inventory[this.searchVal.substr(0,9)]) {
                this.$message({ message: 'SN/BN错误', type: 'error' })
                this.searchVal = null
                return
            }
            this.$axios({
                method: 'GET',
                url: '/api/sbntrace',
                params: { 'sbn': this.searchVal }
            }).then(res => {
                var list = res.data.sbntrace
                if(list.length > 0){
                    list.sort(function (a, b) {
                        if(a.createdat > b.createdat) {
                            return -1
                        } else if (a.createdat == b.createdat) {
                            return 0
                        } else {
                            return 1
                        }
                    })
                } else {
                    this.$message({ message: '未找到 '+this.searchVal+' SN/BN', type: 'info' })
                }
                this.history = list
            }).catch(err => {
                this.$message({ message: err, type: 'error' })
                return
            })
        }
    }
}
</script>
