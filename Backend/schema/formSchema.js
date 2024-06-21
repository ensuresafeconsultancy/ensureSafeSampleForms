const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    MobileNumber: Number,
    certificateFiles: [String],
    Photo: String   
})

module.exports = mongoose.model('form' , formSchema)