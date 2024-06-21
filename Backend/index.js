const express = require('express')
const app = express()
// const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3000;
const port = 3000;
require('dotenv').config();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())
app.use(express.static('files')) // to access images , pdf from frontend
app.use("/download" , express.static('files')) // or this
app.use(express.static('exportedPdfs')) // or this

//add urls file
const FORMS = require('./controllers/forms')
app.use('/forms', FORMS)

const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/ensureSafe')
//   .then(() => console.log('Connected!'))
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'))
  

app.listen(port , ()=>{
  
    console.log(`Example app listening on port ${port}`)
})