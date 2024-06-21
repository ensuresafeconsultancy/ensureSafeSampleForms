import { Link } from 'react-router-dom'


export const Header=()=>{
    return(
        <div className="d-flex justify-content-end">
                <Link className="h5 p-3 border text-decoration-none" to="/">Register</Link>
                <Link className="h5 p-3 border text-decoration-none" to="/submittedForms">Submitted forms</Link>
        </div>
    )
}