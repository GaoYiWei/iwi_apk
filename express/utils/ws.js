const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 9998 })
module.exports = {
    listen: () => {
        wss.on('connection', ws => {
            ws.on('message', msg => {
                if(JSON.parse(msg.toString())['user']=='admin') {
                    wss.clients.forEach(c => {
                        if(ws!=c && c.readyState==1) {
                            c.send(JSON.stringify({ callback: msg.toString()['callback']}))
                        }
                    })
                }
            })
        })
    }
}