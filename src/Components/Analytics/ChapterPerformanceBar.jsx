import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { getChapterProgress } from "../../Logic/studyPlanner";

export default function ChapterPerformanceBar({ subject }) {

  const data = subject.chapters.map(ch => ({
    name: ch.name,
    progress: getChapterProgress(ch)
  }));

  return (

    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

      <h3 className="text-lg font-semibold text-center">
        Chapter Performance
      </h3>

      <div className="w-full h-[350px]">

        <ResponsiveContainer>

          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            barCategoryGap="25%"
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => `${value}%`}
            />

            <Bar
              dataKey="progress"
              fill="#6366F1"
              radius={[6, 6, 0, 0]}
              barSize={35}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}