import { useState } from "react";
import Auth from "./pages/Auth";
import StudySetup from "./pages/StudySetup";


function App() {
  const [currentScreen, setCurrentScreen] = useState("auth");

  return (
    <>
      {/* {currentScreen === "auth" && (
        <Auth onSuccess={() => setCurrentScreen("setup")} />
      )}

      {currentScreen === "setup" && <StudySetup />} */}
    <StudySetup></StudySetup>
    </>
  );
}

export default App;
