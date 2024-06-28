
const crypto = require('crypto') // Generates an encrypteed secret signing for jwt
const bcrypt = require('bcrypt') // used to compare  crypted passwords
const jwt = require('jsonwebtoken')
const secretAccess = crypto.randomBytes(64).toString('hex')


function authenticateUser(socket, next){
    socket.emit('IPerror', 123)
    const AllowedIPs = [
        '::1',
        '172.103.178.235',
        
    ]
    const forwardedIP = socket.handshake.headers['x-forwarded-for']
    console.log('proxyIP: '+ forwardedIP)
    const originalClientIP = forwardedIP? forwardedIP.split(',')[0].trim() : socket.handshake.address
    console.log(`the original IP is: ${originalClientIP}`) // returns an array of IP where the leftmost IP is the original one.
    socket.aipi = originalClientIP 
    try{
        if(!AllowedIPs.includes((originalClientIP))){
            const IP_error = new Error('Access denied: IP not allowed.')
            //socket.emit('IPerror', {error : IP_error.message}) NO scoket is connected before the on Connection event is triggered.
            //socket.disconnect(true) No need for disconnection
            throw IP_error
        }
  
        next()
    }
    catch (error){
        //socket.emit('IPerror', {error : error.message}) Same here!!
        console.log(error)
    }
    
}
function establishConnection(socket){

    console.log('Websocket enabled...')
    socket.on('myIP', (cb)=>{
        cb(socket.aipi)
    })
    socket.on("new-message", broadCastNewMessage)
}

function broadCastNewMessage(obj){
    const chat_server = require('../app.js')
    console.log(obj.sender)
    console.log(obj.message) 
    chat_server.emit("broadcast", obj)
    
}
module.exports = {authenticateUser, establishConnection}