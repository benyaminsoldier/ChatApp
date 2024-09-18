
const http = require('http')
const io = require('socket.io')
const express = require('express')
const connectToMongoDB = require('./connectDB.js')


connectToMongoDB()


const app = express() //Express is a framework that returns an "app" object with methods and properties for handling http request easily
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
const socketIO = require('./websocket/socketIO.js')
//const { builtinModules } = require('module')

const httpServer = http.createServer(app) //APP is just a middleware function.... the server needs to be created... this server still ruled by app
const chat_Server = new io.Server(httpServer,{
    cors : '*', //Allows requests from any domain
}) 

chat_Server.use(socketIO.authenticateUser) //auth middleware (socket,next)=>{next() next doesnt end the function execution you must return if the next if within a conditional}
//We can use multiple middleware an modify the socket obj accross them before connection.
//Socket can not emit before connection!!! If there is an error there is no way sending it to the client through the socket. But is not necessary.
chat_Server.on('connection', socketIO.establishConnection)
//The problem here is that Express and SocketIO are on the same file. Mongoose is encapsulated and separated but AWS inside SocketIO.

httpServer.listen(7000 , ()=>{
    console.log('Server is running...')
})

module.exports = {chat_Server}


//C:\Users\LENOVO\Documents\Canada\Calgary\BVC\courses\Summer2024\chat_app_socket.io\server