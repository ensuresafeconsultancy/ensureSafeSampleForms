import swal from 'sweetalert';
import { useState } from "react";
import axios from 'axios';


export const MyForm = ()=>{
    
  const [firstName , setFirstName] = useState('');
  const [lastName , setLastName] = useState('');
  const [email , setEmail] = useState('');
  const [mobile , setMobile] = useState('');
  const [certificateFiles , setCertificateFiles] = useState([]);
  const [photo , setPhoto] = useState([]);


  const handleInput = (event)=>{

    const value = event.target.value;
    const id = event.target.id;

    if(id==='firstName'){
      setFirstName(value)
    } else if(id === 'lastName'){
      setLastName(value)
    }else if(id === 'email'){
      setEmail(value);
    } else if(id==='mobileNumber'){
      setMobile(value)
    }
  }

  const validateForm = async (event)=>{
    event.preventDefault();

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('mobile', mobile);

    // Append each file to the 'certificateFiles' field
    for (let i = 0; i < certificateFiles.length; i++) {
      formData.append('certificateFiles', certificateFiles[i]);
    }

    formData.append('photo' , photo);

    // const formData = {
    //   firstName : firstName,
    //   lastName : lastName,
    //   email : email,
    //   mobile : mobile,
    //   certificateFiles : certificateFiles
    // }

    console.table(formData)

    swal({
      title: "Want to submit?",
      text: "check all the input fields before submitting the form",
      icon: "warning",
      // buttons: true,
      buttons: {
        cancel: "No, cancel it!",
        confirm: "Yes, submit it"
      },
      dangerMode: true,
    })
    .then(async (willDelete) => {


      if (willDelete) {
        const response = await axios.post('https://ensuresafepaidbackend.onrender.com/forms/submitForm',formData,{
          headers : {"Content-Type" : "multipart/form-data"}
        });
        console.log(response.data.message)
        console.table(response.data.userObj)
        if(response){
          swal("Submitted", {
            icon: "success",
          });
        }
      } else {
        swal("Your imaginary file is safe!");
      }
    });

}

    return(
        <>
         <div className="container">
        <div className="row">
          <div className="col"></div>
          <div className="col-md-6 col-12">

            <div className="pt-5">
              <h2 className="text-center">Registration form</h2>
            </div>
            <form action="">
              <div className="row">
                <div className="col-md-6 col">
                  <div className="form-group">
                    <label htmlFor="firstname">First name: </label>
                    <input type="text" onChange={handleInput} id="firstName" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6 col">
                  <div className="form-group">
                    <label htmlFor="lastname">Last name: </label>
                    <input type="text" onChange={handleInput} id="lastName" className="form-control" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="firstname">Email: </label>
                <input type="email" onChange={handleInput} id="email" className="form-control" required/>
              </div>
              <div className="form-group">
                <label htmlFor="firstname">Mobile number: </label>
                <input type="number"  onChange={handleInput} value={mobile} id="mobileNumber"className="form-control" />
              </div>

           

              <div className="form-group d-flex justify-content-center align-items-center pt-4 flex-column">
                <label htmlFor="" className='align-self-start pb-3'>Upload Educational certificates :</label>
                    <input id="multiplefileupload" type="file" onChange={(e)=> setCertificateFiles(e.target.files)} accept=".png, .jpg, .jpeg, .pdf, .doc, .docx" multiple required/>

              </div>
              <div className="form-group d-flex justify-content-center align-items-center pt-4 flex-column">
                <label htmlFor="" className='align-self-start pb-3'>Upload Photo :</label>
                    <input type="file" onChange={(e)=> setPhoto(e.target.files[0])} accept=".png, .jpg, .jpeg," required />

              </div>
              



              <div className="text-center pt-4">
                <button onClick={validateForm} className="btn btn-primary px-4 py-2">Submit</button>
              </div>
            </form>
          </div>
          <div className="col"></div>
        </div>
      </div>
        </>
    )
};