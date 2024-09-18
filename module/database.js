const mongoose = require('mongoose')

const messages = mongoose.Schema({
    sender : String,
    IP: String,
    receiver : [String],
    date : Date,
    message : String,
    image: String

})

const users = mongoose.Schema({

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

/*
mongoose Query object.

Model.deleteMany()
Model.deleteOne()
Model.find()
Model.findById()
Model.findByIdAndDelete()
Model.findByIdAndRemove()
Model.findByIdAndUpdate()
Model.findOne()
Model.findOneAndDelete()
Model.findOneAndReplace()
Model.findOneAndUpdate()
Model.replaceOne()
Model.updateMany()
Model.updateOne()

*/