import { calculateSubjectWeight, remainingDays,getTotalWeight,distributeDailyHours } from "../Logic/studyPlanner";

function Dashboard({ examData, subjects }) {
  return (
    <div>
      <h2>Dashboard</h2>


      {examData.map(exam => (
        <div key={exam.examId} style={{ marginBottom: "30px" }}>
          <h3>{exam.examName}</h3>
          <p>Exam Date: {exam.date}</p>
          <p>Remaining Days: {remainingDays(exam.date)}</p>

          <table border="1">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Chapters</th>
                <th>Difficulty</th>
                <th>Weight</th>
                <th>Daily Hours Needed</th>
              </tr>
            </thead>
            <tbody>
              {subjects
                .filter(sub => sub.examId === exam.examId)
                
                .map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.name}</td>
                    <td>{sub.chapters}</td>
                    <td>{sub.difficulty}</td>
                    <td>{calculateSubjectWeight(sub)}</td>
                    <td>{distributeDailyHours(sub,subjects,exam)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
