
const http = require('http')
const io = require('socket.io')
const express = require('express')
const connectToMongoDB = require('./connectDB.js')

connectToMongoDB()

const app = express()
//This cors policy rules only the incoming http requests but the handshake for web sockets is ruled by the websocket cors policy.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})
app.use(express.json()) //req and res treated as json
app.use(express.urlencoded({extended:true})) // form http request recognition


const router = require('./routes/router.js')
app.use(router)

//WEBSOCKET SERVER (REAL TIME COMMUNICATION) BI DIRECTIONAL (SERVER PUSHING)
//const socketIO = require('./websocket/socketIO.js')
//const { builtinModules } = require('module')

const httpServer = http.createServer(app) //APP is just a middleware function.... the server needs to be created... this server still ruled by app
const chat_Server = new io.Server(httpServer,{
    cors : '*', //Allows requests from any domain
}) 

//chat_Server.use(socketIO.authenticateUser)
//chat_Server.on('error', socketIO.handleErrors)
chat_Server.on('connection', (socket)=>{
 
    console.log('Websocket enabled...')
    socket.on("new-message", (msg)=>{
        console.log(msg)

        chat_Server.emit("broadcast", msg)
    })}
)



httpServer.listen(7000 , ()=>{
    console.log('Server is running...')
})

module.exports = chat_Server


