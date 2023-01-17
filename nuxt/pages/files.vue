<template>
    <div>
        <div>
            <el-upload
                ref="uploader"
                action="http://192.168.5.151:9000/files"
                list-type="picture-card"
                multiple
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="postEvent">
                <i class="el-icon-plus"></i>
            </el-upload>
            <ul>
                <li v-for="item in files">
                    <i :class="item.icon"></i>
                    <span>{{ item.name }}</span>
                </li>
            </ul>
        </div>
        <div class="box">
            <ul class="list">
                <li v-for="(item, index) in fileList" :key="index">
                    <a :href="item.fileUrl ? item.fileUrl : item.imgUrl" class="img">
                        <img :src="item.imgUrl" alt="">
                        <p class="name">{{item.name}}</p>
                        <div class="datetime">{{item.time}}</div>
                    </a>
                </li>
            </ul>
        </div> 
    </div>
</template>

<script>
export default {
    data () {
        return {
            fileList: [
                { fileUrl: "http://192.168.5.151:9000/upload/技能地图.pdf",imgUrl: "http://192.168.5.151:9000/upload/logo.png", name: 'iwi', time: new Date().toLocaleString() },
                { fileUrl: null,imgUrl: "http://192.168.5.151:9000/upload/2.png", name: 'gao', time: new Date().toLocaleString() },
                { fileUrl: "http://192.168.5.151:9000/upload/技能地图.pdf",imgUrl: "http://192.168.5.151:9000/upload/logo.png", name: 'iwi', time: new Date().toLocaleString() },
                { fileUrl: null,imgUrl: "http://192.168.5.151:9000/upload/2.png", name: 'gao', time: new Date().toLocaleString() },
                { fileUrl: "http://192.168.5.151:9000/upload/技能地图.pdf",imgUrl: "http://192.168.5.151:9000/upload/logo.png", name: 'iwi', time: new Date().toLocaleString() },
                { fileUrl: null,imgUrl: "http://192.168.5.151:9000/upload/2.png", name: 'gao', time: new Date().toLocaleString() }
            ],
            files: []
        }
    },
    methods: {
        beforeUpload(file) {
            if (file.type != "image/png" && file.type != "image/jpeg" && file.type != "application/pdf") {
                this.$message.error('仅支持 JPG、PNG、PDF 格式!')
                return false
            }
        },
        postEvent(res, file) {
            if (res.status == 200) {
                this.files.push({ icon: 'el-icon-success success', name: file.name })
            } else {
                this.$notify.error({ title: '错误', message: file.name.substring(0,file.name.indexOf('.')) + res.message })
                this.files.push({ icon: 'el-icon-error error', name: file.name })
            }
        }
    }
}
</script>

<style>
    a {
        color: inherit;
        text-decoration: none;
    }
    ul {
        margin: 0 10px 0 10px;
        list-style: none;
        overflow: hidden;
    }
    .box .list li {
        margin: 40px 0 0 40px;
        padding: 20px 19px;
        width: 170px;
        border-top: 1px solid #ebeaea;
        border-left: 1px solid #ebeaea;
        border-right: 1px solid #b3b3b3;
        border-bottom: 1px solid #b3b3b3;
        float: left;
        position: relative;
    }
    .box .list li img {
        width: 100%;
        height: 160px;
        display: block;
    }
    .box .list li .name {
        line-height: 22px;
        font-size: #666;
        font-size: 14px;
    }
    .box .list .datetime {
        float: right;
        font-size: 12px;
        color: #9ca0aa;
    }
    .box .list li:hover {
        background-color: #cfcfcf;
    }
    .success {
        color: #67C23A
    }
    .error {
        color: #F56C6C
    }
</style>