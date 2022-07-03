import { WebSocketServer } from 'ws'

const PORT = process.env.PORT || 4000
const ws_server = new WebSocketServer({ port: PORT })
let clients = []

ws_server.on('connection', (client, request) => {
    clients.push(client)
    console.log('Client connected')

    client.on('close', () => {
        const position = clients.indexOf(client)
        clients.splice(position, 1)
        console.log('Connection closed')
    })

    client.on('message', (data) => {
        console.log(`${request.connection.remoteAddress}: ${data}`)
        ws_server.clients.forEach(client => {
            client.send(JSON.stringify(Buffer.from(data).toString()))
        })
    })
})