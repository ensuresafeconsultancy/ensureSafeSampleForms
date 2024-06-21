import axios from "axios";
import { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";

import LoadingImg from '../assets/images/loading.gif'

export const SubmittedForms = () => {
  const [userData, setUserData] = useState([]);
  const [loading , setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "https://ensuresafepaidbackend.onrender.com/forms/getSubmittedForms"
      );
      console.log(response.data);
      if (response.data.status == 1) {
        setUserData(response.data.userDetails);
      }
    })();
  }, []);

  const openFile = (file) => {
    window.open(`https://ensuresafepaidbackend.onrender.com/${file}`, "_blank", "noopener");
  };

  const downloadFile = async (file) => {
    try {
      const response = await axios.get(`https://ensuresafepaidbackend.onrender.com/${file}`, {
        responseType: "blob", // Important
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during file download:", error);
    }
  };

//   const downloadDocPdf = async () => {
//     try {
//         const response = await axios.get('https://appsail-50019946389.development.catalystappsail.in/forms/exportFormPdf');
//         const url = `https://appsail-50019946389.development.catalystappsail.in/${response.data.filePath}`; // Use the file path from the backend
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'file.pdf'); // or the filename you want
//         document.body.appendChild(link);
//         link.click();
//     } catch (error) {
//         console.error(error);
//     }
// };

const downloadDocPdf = async () => {
    try {
        setLoading(true);
        const response = await axios.get('https://ensuresafepaidbackend.onrender.com/forms/exportFormPdf');
        const url = `https://ensuresafepaidbackend.onrender.com/${response.data.filePath}`; // Use the file path from the backend
        window.open(url, '_blank'); // Open the PDF in a new tab
        setLoading(false);
    } catch (error) {
        console.error(error);
    }
};



  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        <span className="cursor_pointer px-3 py-2 border rounded-pill exportPdf d-flex justify-content-center align-items-center gap-1" onClick={()=>downloadDocPdf()} >Export as PDF {loading? <img src={LoadingImg} className="loadingImg" alt="loading" /> : ""}</span>
      </div>
      <div className="row">
        <div className="col"></div>
        <div className="col-md-10 col">
          <table className="table">
            <thead>
              <tr>
                <td>S.No</td>
                <td scope="col">First Name</td>
                <td scope="col">Last Name</td>
                <td scope="col">Email</td>
                <td scope="col">Mobile No.</td>
                <td scope="col">Certificate documents</td>
                <td scope="col">Photo</td>
              </tr>
            </thead>
            <tbody>
              {userData &&
                userData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.FirstName}</td>
                      <td>{item.LastName}</td>
                      <td>{item.Email}</td>
                      <td>{item.MobileNumber}</td>
                      <td>
                        {item.certificateFiles &&
                          item.certificateFiles.map((itemFile, index) => {
                            return (
                              <div className="d-flex justify-content-between " key={index}>
                                <span
                                  onClick={() => openFile(itemFile)}
                                  className="text-truncate cursor_pointer fileName "
                                  style={{ maxWidth: "150px" }}
                                >
                                  {itemFile.substr(13, 10).concat("...") +
                                    itemFile.split(".")[1]}
                                </span>
                                <span
                                  onClick={() => downloadFile(itemFile)}
                                  className="text-success cursor_pointer  rounded-circle download_bg"
                                >
                                  <MdDownloadForOffline className="downloadIcon rounded-circle" />
                                </span>
                              </div>
                            );
                          })}
                      </td>
                      <td className="d-flex justify-content-center"><img className="studentPhoto cursor_pointer" onClick={()=>openFile(item.Photo)} src={`https://ensuresafepaidbackend.onrender.com/${item.Photo}`} /></td>
                      
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};

{
  /* <td><span onClick={()=>openFile(item.certificateFile)} className="text-truncate cursor_pointer" style={{ maxWidth: '150px' }}>{item.certificateFile.substr(13,20).concat("...") + item.certificateFile.split('.')[1]}</span> <span onClick={()=>downloadFile(item.certificateFile)} className="text-success cursor_pointer">Download file</span> </td> */
}
// https://appsail-50019946389.development.catalystappsail.in/

// https://appsail-50019946389.development.catalystappsail.in/

// https://ensure-backend-forms.vercel.app/

// https://ensuresafeforms.onrender.com/


// https://ensure-backend-forms-rdxidqb26-balajik27s-projects.vercel.app


//paid

// https://ensuresafepaidbackend.onrender.com

