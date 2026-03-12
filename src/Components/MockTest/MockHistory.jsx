export default function MockHistory({ chapter }) {

  const tests = chapter?.mockTests || [];

  if (tests.length === 0) {
    return <p>No mock tests taken yet</p>;
  }

  return (

    <div className="section">

      <h3>Mock Test History</h3>

      {tests.map((test, index) => {

        const score = test.score ?? "-";
        const total = test.total ?? "-";

        const formattedDate = test.createdAt
          ? new Date(test.createdAt).toLocaleDateString("en-GB")
          : "No date";

        return (

          <div
            key={test._id || index}
            className="card"
          >

            <p>
              Score: {score} / {total}
            </p>

            <p>
              Date: {formattedDate}
            </p>

          </div>

        );

      })}

    </div>

  );

}