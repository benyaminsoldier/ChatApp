const mongoose = require('mongoose')
const URI = 'mongodb+srv://danielbenjumea0:Benyamin77@cluster0.p5himkc.mongodb.net/ChatAppDB?retryWrites=true&w=majority'


async function connectToMongoDB(){
    try{
        await mongoose.connect(URI)
        console.log('Connected to MongoDB')
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = connectToMongoDB

