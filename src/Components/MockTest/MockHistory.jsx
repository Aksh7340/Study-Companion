export default function MockHistory({ chapter }) {

  const tests = chapter?.mockTests || [];

  if (tests.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No mock tests taken yet
      </p>
    );
  }

  return (

    <div className="space-y-4">

      <h3 className="text-lg font-semibold">
        Mock Test History
      </h3>

      <div className="space-y-3">

        {tests.map((test, index) => {

          const score = test.score ?? "-";
          const total = test.total ?? "-";

          const formattedDate = test.createdAt
            ? new Date(test.createdAt).toLocaleDateString("en-GB")
            : "No date";

          return (

            <div
              key={test._id || index}
              className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg"
            >

              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  Score: {score} / {total}
                </p>
                <p className="text-gray-500">
                  {formattedDate}
                </p>
              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}