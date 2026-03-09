import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getChapterProgress } from "../../Logic/studyPlanner";

export default function ChapterPerformanceBar({ subject }) {

  const data = subject.chapters.map(ch => ({
    name: ch.name,
    progress: getChapterProgress(ch)
  }));

  return (

    <div style={{ width: "100%", height: 350 }}>

      <h3 style={{ textAlign: "center" }}>
        Chapter Performance
      </h3>

      <ResponsiveContainer>

        <BarChart data={data}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="progress" fill="#6366F1" />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}