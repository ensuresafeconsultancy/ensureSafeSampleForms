require('dotenv').config();
const express = new require('express')
const router = express.Router()


const ejs = require('ejs');
const pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')

//mail
const nodemailer = require('nodemailer');

const multer  = require('multer')
// const upload = multer({ dest: 'files/' }) // if same file uploaded then have same name , so dont use this
const storage = multer.diskStorage({
destination: function (req, file, cb) {
     cb(null, 'files')
},
filename: function (req, file, cb) {
     const uniqueSuffix = Date.now()
     cb(null,uniqueSuffix + file.originalname)
}
})

const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
}


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg')
//   }
// })



const upload = multer({ storage: storage })

const FormModel  = require('../schema/formSchema')

router.get("/getSubmittedForms" , async(req,res)=>{
     const userDetailsDb = await FormModel.find();

     if(userDetailsDb){
          res.send({status : 1 , userDetails : userDetailsDb})
     }
})
router.post("/submitForm", upload.fields([{ name: 'certificateFiles', maxCount: 12 }, { name: 'photo', maxCount: 1 }]), async (req, res) => {
     const firstName = req.body.firstName;
     const lastName = req.body.lastName;
     const email = req.body.email;
     const mobile = req.body.mobile;
 
     // Since it's an array of files, you should use req.files['certificateFiles']

     const certificateFiles = req.files['certificateFiles'].map(file => file.filename);
 
     // For single file, use req.file
     const photo = req.files['photo'][0].filename;
 
     console.log(req.files)
 
     const form = new FormModel();
 
     form.FirstName = firstName;
     form.LastName = lastName;
     form.Email = email;
     form.MobileNumber = mobile;
     form.certificateFiles = certificateFiles;
     form.Photo = photo; // Add this line to include the photo in your form model
 
     const response = await form.save();
 
     if(response){

        const data = {
            formDoc : form,
        };

        const filePathName = path.resolve(__dirname , '../ejs_file/emailAcknoledgement.ejs');
        const htmlString = fs.readFileSync(filePathName).toString();  
        const ejsData = ejs.render(htmlString , data);

        const adminFilePathName = path.resolve(__dirname , '../ejs_file/adminEmailAck.ejs');
        const adminHtmlString = fs.readFileSync(adminFilePathName).toString();  
        const adminEjsData = ejs.render(adminHtmlString , data);

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
          });
          
          let userMailOptions = {
            from: process.env.USER , // sender address
            to: form.Email, // list of receivers
            subject: "Successfully submitted the form - Ensure Safe consultancy", // Subject line
            text: "Hello", // plain text body
            html: ejsData, // html body
            // html: "<b>Your form is submitted successfully , our team will contact you!</b>", // html body
          };
          let adminMailOptions = {
            from: process.env.USER , // sender address
            to: "balaji.k.developer@gmail.com", // list of receivers
            subject: "New User Registered - Ensure Safe consultancy", // Subject line
            text: "Hello", // plain text body
            html: adminEjsData, // html body
            // html: "<b>Your form is submitted successfully , our team will contact you!</b>", // html body
          };
          
          transporter.sendMail(userMailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('User Email sent: ' + info.response);
            }
          });
          transporter.sendMail(adminMailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Admin Email sent: ' + info.response);
            }
          });


          res.send({message : "Successfully stored", userObj : response})
     } else {
          res.send({message : "Not stored"})
     }
 });

// router.get('/download/:filename', (req, res) => {
//      const filename = req.params.filename;
//      const filepath = path.join(__dirname, 'files/', filename);
//      console.log(filepath)
//      res.download(filepath); // Set Content-Disposition header to attachment
// });

router.get('/download/:id', async (req, res) => {
     try {
         const formId = req.params.id;
         const form = await FormModel.findById(formId);
 
         if (form) {
             // Assuming 'certificateFiles' contains the path to the PDF file
             const pdfPath = form.certificateFiles[0]; // or whichever file you want to download
 
             res.download(pdfPath, (err) => {
                 if (err) {
                     // Handle error, but don't expose to client
                     console.error(err);
                     res.status(500).send('Error downloading file');
                 }
             });
         } else {
             res.status(404).send('Document not found');
         }
     } catch (error) {
         console.error(error);
         res.status(500).send('Server error');
     }
 });


router.get('/exportFormPdf', async(req,res)=>{
    try{

        console.log("Hello")
        const formDoc = await FormModel.find();
        const data = {
            formDoc : formDoc,
        };

        const filePathName = path.resolve(__dirname , '../ejs_file/htmltopdf.ejs');
        const htmlString = fs.readFileSync(filePathName).toString();
        const options = {
          format: 'Letter',
          childProcessOptions: {
            env: { OPENSSL_CONF: '/dev/null' },
          },
        }  
        const ejsData = ejs.render(htmlString , data);
        pdf.create(ejsData, options).toFile('./exportedPdfs/userForms.pdf', (err, response) => {
            if (err) {
                console.log("Error->>>>>>>>>", err);
                res.status(500).send(err);
            } else {
                console.log('File generated');
                res.send({ filePath: 'userForms.pdf' }); // Send the file path
            }
        });
       
    }catch(err){
        console.log(err.message)
    }
})


 
   

module.exports = router