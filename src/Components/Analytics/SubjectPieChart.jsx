import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { calculateSubjectWeight } from "../../Logic/studyPlanner";

export default function SubjectPieChart({ subjects, examId }) {

  // Filter subjects for this exam
  const examSubjects = subjects.filter(
    sub => sub.examId === examId
  );

  // Prepare chart data
  const data = examSubjects.map(sub => ({
    name: sub.name,
    value: calculateSubjectWeight(sub)
  }));

  const COLORS = [
    "#6366F1",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#14B8A6",
    "#8B5CF6"
  ];

  return (
    <div style={{ width: "100%", height: 350 }}>

      <h3 style={{ textAlign: "center" }}>
        Subject Weight Distribution
      </h3>

      <ResponsiveContainer>

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}