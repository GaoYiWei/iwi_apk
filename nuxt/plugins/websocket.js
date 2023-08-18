import Vue from 'vue'
var ws = {
    install(Vue) {
        Vue.prototype.ws = {
            ws: null, //连接实例
            connected: false, //连接状态
            sendRetryCount: 0, //发送消息重试次数
            connectRetryCount: 0, //连接重试次数
            connect: function() {
                if(!window.WebSocket) {
                    return alert('您的浏览器不支持WebSocket')
                }
                // 连接服务器
                this.ws = new WebSocket('ws://127.0.0.1:9998')
                this.ws.onopen = () => {
                    this.connected = true
                    this.connectRetryCount = 0
                }
                // 服务关闭
                this.ws.onclose = () => {
                    this.connected = false
                    this.connectRetryCount++
                    setTimeout(() => {
                        this.connect()
                    }, 800 * this.connectRetryCount)
                }
                // 连接错误
                this.ws.onerror = () => {
                    this.connected = false
                    this.connectRetryCount++
                    setTimeout(() => {
                        this.connect()
                    }, 800 * this.connectRetryCount)
                }
                // 接收消息
                this.ws.onmessage = msg => {
                    var msg = JSON.parse(msg.data)
                    if(this.callBackMapping[msg['callback']]) {
                        this.callBackMapping[msg['callback']].call(this, msg['data'])
                    }
                }
            },
            send: function(data) {
                if(this.connected) {
                    this.sendRetryCount = 0
                    this.ws.send(JSON.stringify(data))
                } else {
                    this.sendRetryCount++
                    setTimeout(() => {
                        this.ws.send(JSON.stringify(data))
                    }, 500 * this.sendRetryCount);
                }
            },
            close: function() {
                this.connected = false
                this.sendRetryCount = 0
                this.connectRetryCount = 0
                this.ws.close()
            },
            callBackMapping: {}, //存储回调函数
            //注册回调
            registerCallBack: function(socketid, callback) {
                this.callBackMapping[socketid] = callback
            },
            //注销回调
            unregisterCallBack: function(socketid) {
                this.callBackMapping[socketid] = null
            }
        }
    }
}
Vue.use(ws)