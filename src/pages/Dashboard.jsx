import "./StudySetup.css"
function Dashboard({subjects}){
    return <>
    {/* ---------- Subjects List Section ---------- */}
      <h1>Your Subjects</h1>

      <ul className="sub-list">
        {subjects.map((subject, index) => (
          <li key={index} className="list-item">
            <div>
              <h1>{subject.name}</h1>
              <p>Total Chapters: {subject.chapters}</p>
              <p>Difficulty: {subject.difficulty}</p>
            </div>
          </li>
        ))}
      </ul></>
}
export default Dashboard;