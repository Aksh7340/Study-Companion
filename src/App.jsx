import { useState } from "react";
import Auth from "./pages/Auth";
import StudySetup from "./pages/StudySetup";
import Dashboard from "./pages/Dashboard"
import { remainingDays } from "./Logic/studyPlanner";
import ExamList from "./Components/Exams/ExamList";

function App() {
  const [show,setShow]=useState(false)

  
  const [subjects, setSubjects] = useState([]);
  const [examData,setExamData]=useState([])
  

  return (
    <>

    {
      !show&&<StudySetup subjects={subjects} setSubjects={setSubjects} setExamData={setExamData} examData={examData}>
    </StudySetup>
    }

   <button onClick={()=>setShow(true)}>Change</button>

    {show&&<Dashboard examData={examData}></Dashboard>
    }
    </>
  );
}

export default App;
