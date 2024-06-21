
import { MyForm } from "./components/myForm";
import { Header } from "./components/header";
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import { SubmittedForms } from "./components/submittedForms";
// import { BrowserRouter  as Router , Routes , Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Router>
      <Header />
      <Routes>

        <Route path="/" element={<MyForm />} />
        <Route path="/submittedForms" element={<SubmittedForms />} />

      </Routes>
    </Router>

      
    </>
  );
}

export default App;
