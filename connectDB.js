const mongoose = require('mongoose')
const URI = ''


async function connectToMongoDB(){
    try{
        await mongoose.connect(mongoDB_URI)
        console.log('Connected to MongoDB')
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = connectToMongoDB

