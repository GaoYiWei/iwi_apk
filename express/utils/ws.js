const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 9998 })
module.exports = {
    listen: () => {
        wss.on('connection', (ws, req) => {
            ws.ip = req.socket.remoteAddress
            ws.on('message', msg => {
                var msg = JSON.parse(JSON.parse(msg.toString()))
                if(msg['user']=='admin') {
                    wss.clients.forEach(c => {
                        if(ws.ip!=c.ip && c.readyState==1) {
                            c.send(JSON.stringify({ data: null, callback: msg['callback']}))
                        }
                    })
                }
            })
        })
    }
}