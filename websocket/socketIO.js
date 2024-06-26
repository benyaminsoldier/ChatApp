
const crypto = require('crypto') // Generates an encrypteed secret signing for jwt
const bcrypt = require('bcrypt') // used to compare  crypted passwords
const jwt = require('jsonwebtoken')
const secretAccess = crypto.randomBytes(64).toString('hex')

function authenticateUser(socket, next){
    socket.emit('IPerror', 123)
    const AllowedIPs = [
        '::1',
        '172.103.178.236',
    ]
    const forwardedIP = socket.handshake.headers['x-forwarded-for']
    console.log('proxyIP: '+ forwardedIP)
    const originalClientIP = forwardedIP? forwardedIP.split(',')[0].trim() : socket.handshake.address
    console.log(`the original IP is: ${originalClientIP}`) // returns an array of IP where the leftmost IP is the original one.
    try{
        if(!AllowedIPs.includes((originalClientIP))){
            const IP_error = new Error('Access denied: IP not allowed.')
            socket.disconnect(true)
            throw IP_error
        }
        next()
    }catch (error){
        socket.emit('IPerror', {error : error.message})
        console.log(error)
    }
    
}
function establishConnection(socket){
    const chat_server = require('../app.js')
    console.log('Websocket enabled...')
    socket.on("new-message", (msg)=>{
        console.log(msg)

        chat_server.emit("broadcast", msg)
    })
}
function handleErrors(error){
    console.log('there is an error')
    console.log(error.message)
}
module.exports = {authenticateUser, establishConnection, handleErrors}