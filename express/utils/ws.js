const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 9998 })
module.exports = {
    listen: () => {
        wss.on('connection', client => {
            client.on('message', msg => {
                console.log(msg)
                client.send(JSON.stringify('hello, nuxt'))
            })
        })
    }
}