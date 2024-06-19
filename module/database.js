const mongoose = require('mongoose')

const messages = mongoose.Schema({
    sender : String,
    receiver : [String],
    date : Date,
    message : String

})

const users = mongoose.Schema({
    username : String,
    password : String,
    nickname : String,
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the same User model
        required : false
      }]
    
})

const chatHistory = mongoose.model('Message', messages)
const user = mongoose.model('User', users)

module.exports = {chatHistory, user}