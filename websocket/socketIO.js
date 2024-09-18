const {saveImage} = require("../aws/s3.js")
const mongoModels = require('../module/database.js')

const AllowedIDs = [
    ['localhost','::1'],
    ['Benyamin','172.103.178.235'],
    ['Camila','172.103.178.236'],
    
]

function authenticateUser(socket, next){
    socket.emit('IPerror', 123)

    const forwardedIP = socket.handshake.headers['x-forwarded-for'] //IP forwarded by proxies
    console.log('proxyIP: '+ forwardedIP)
    const originalClientIP = forwardedIP? forwardedIP.split(',')[0].trim() : socket.handshake.address //checks for IP forwarded by proxies
    console.log(`the original IP is: ${originalClientIP}`) // returns an array of IP where the leftmost IP is the original one.
    socket.aipi = originalClientIP 
    try{
        for(let i=0; i < AllowedIDs.length; i++){
            if(AllowedIDs[i][1]  !== originalClientIP){
                console.log(`this IP: ${originalClientIP} is not accepted`)
                continue
            }
            else{
                console.log(`IP: ${originalClientIP} was accepted`)
                socket.nickname = AllowedIDs[i][0]
                next() //transfers control to the io server.on method
                return
            }
        }

            const IP_error = new Error('Access denied: IP not allowed.')
            //socket.emit('IPerror', {error : IP_error.message}) NO scoket is connected before the on Connection event is triggered.
            //socket.disconnect(true) No need for disconnection
            throw IP_error
        
        
    }
    catch (error){
        console.log(error)
    }
    
}
async function establishConnection(socket){

    const {chat_Server} = require('../app.js')
    console.log('Websocket enabled...')
    //Initial connection established, credentials sent back through a callback function... the client emits "requests" the credentials
    //The server just listens and responds with its callback.
    socket.on('myIP', (cb)=>{
        cb({
            IP : socket.aipi,
            nickname: socket.nickname,
        })
    })
    //After connection establishes we request access to the S3.

    //Here goes the chat history
    const chatHistory = await mongoModels.chatHistory.find() //Chat History array full of msgs(objs) is requested to Atlas

    for(let i = 0; i < chatHistory.length; i++){
        let image
        if(chatHistory[i]['image']){
             image = chatHistory[i]['image']
        } else image = null

        chat_Server.emit("broadcast", {
            sender : chatHistory[i]['sender'],
            IP: chatHistory[i]['IP'],
            receiver :chatHistory[i]['receiver'],
            date :chatHistory[i]['date'],
            message : chatHistory[i]['message'],
            image: image
        })
    }
    

    socket.on("new-message", broadCastNewMessage) //Object from new message passed to broadCastNewMessage function as argument
}

async function broadCastNewMessage(obj){
    const {chat_Server} = require('../app.js') // why do I have to declare this inside the function
    
    let receivers = []
    for(let i = 0 ; i < AllowedIDs.length; i++){
        receivers.push(AllowedIDs[i][1])
    } // This loop builds a receivers collection but it has not been used for any feature...

    if(!obj.image) {
       
        const messageRecord = new mongoModels.chatHistory({
            sender : obj.sender,
            IP: obj.IP,
            receiver :receivers,
            date : obj.date,
            message : obj.message,
        })
        console.log(await messageRecord.save())
        chat_Server.emit("broadcast", obj) 
        return
    }
        
    obj.image.data = Buffer.from(obj.image.data)
    const messageRecord = new mongoModels.chatHistory({
        sender : obj.sender,
        IP: obj.IP,
        receiver :receivers,
        date : obj.date,
        message : obj.message,
        image: await saveImage(obj) //returns image public url from aws S3
    })
    obj.image = messageRecord.image
    console.log(obj)
    chat_Server.emit("broadcast", obj) 
    console.log(await messageRecord.save())
        
}


module.exports = {authenticateUser, establishConnection}

//It would be a better approach to create the chat_server here and export it to the app. But I would need the express app...