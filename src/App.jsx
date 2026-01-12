import { useState } from "react";
import Auth from "./pages/Auth";
import StudySetup from "./pages/StudySetup";
import Dashboard from "./pages/Dashboard"

function App() {
  const [show,setShow]=useState(false)
  const [currentScreen, setCurrentScreen] = useState("auth");
  
  const [subjects, setSubjects] = useState([]);

  return (
    <>

    {
      !show&&<StudySetup setSubjects={setSubjects}>
    </StudySetup>
    }

   

    {show&&<Dashboard 
    subjects={subjects}></Dashboard>
    }
    </>
  );
}

export default App;
