import { motion } from "framer-motion";
import { TrendingUp, Trophy, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

export default function MockResultChart({ chapter }) {

  const tests = chapter?.mockTests || [];

  if (tests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center"
      >
        <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-3" />

        <p className="text-gray-500 text-sm">
          No mock tests yet. Complete a test to see your progress.
        </p>
      </motion.div>
    );
  }

  const percentages = tests.map(t =>
    t.total ? Math.round((t.score / t.total) * 100) : 0
  );

  const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
  const best = Math.max(...percentages);
  const latest = percentages[percentages.length - 1];

  const trend =
    percentages.length >= 2
      ? latest - percentages[percentages.length - 2]
      : 0;

  const data = percentages.map((score, i) => ({
    name: `Test ${i + 1}`,
    score
  }));

  const stats = [
    { label: "Tests", value: tests.length, icon: BarChart3 },
    { label: "Best", value: `${best}%`, icon: Trophy },
    {
      label: "Trend",
      value: `${trend >= 0 ? "+" : ""}${trend}%`,
      icon: TrendingUp
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 space-y-5"
    >

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-lg font-semibold">
            Mock Test Performance
          </h3>

          <p className="text-sm text-gray-500">
            Average: <span className="font-medium">{avg.toFixed(1)}%</span>
          </p>
        </div>

        <div className="flex gap-4">

          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <s.icon className="w-4 h-4 text-indigo-500" />

              <div className="text-xs">
                <p className="text-gray-500">{s.label}</p>
                <p className="font-semibold">{s.value}</p>
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Chart */}

      <div className="h-[320px]">

        <ResponsiveContainer>

          <AreaChart data={data}>

            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="name" />

            <YAxis domain={[0,100]} tickFormatter={(v)=>`${v}%`} />

            <Tooltip formatter={(v)=>`${v}%`} />

            <ReferenceLine
              y={Math.round(avg)}
              stroke="#F59E0B"
              strokeDasharray="6 4"
              label={`Avg ${avg.toFixed(0)}%`}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#6366F1"
              strokeWidth={3}
              fill="url(#scoreGradient)"
              dot={{ r:4 }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </motion.div>
  );
}