export default function MockHistory({ chapter }) {

  if (!chapter.mockTests.length) {
    return <p>No mock tests taken yet</p>;
  }

  return (
    <div className="section">

      <h3>Mock Test History</h3>

      {chapter.mockTests.map(test => (

        <div key={test.id} className="card">

          <p>
            Score: {test.score} / {test.total}
          </p>

          <p>
            Date: {new Date(test.date).toLocaleDateString()}
          </p>

        </div>

      ))}

    </div>
  );
}