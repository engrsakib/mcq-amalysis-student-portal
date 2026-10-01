import type { MonthlyExamPoint } from "@/lib/dashboard/types";

type ExamsTakenChartProps = {
  data: MonthlyExamPoint[];
};

export function ExamsTakenChart({ data }: ExamsTakenChartProps) {
  const width = 560;
  const height = 200;
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(
    ...data.flatMap((d) => [d.exams, d.takers]),
    1
  );
  const stepX = chartW / (data.length - 1 || 1);

  const linePoints = (key: "exams" | "takers") =>
    data
      .map((d, i) => {
        const x = padding.left + i * stepX;
        const y =
          padding.top + chartH - (d[key] / maxVal) * chartH;
        return `${x},${y}`;
      })
      .join(" ");

  const barWidth = Math.max(stepX * 0.35, 4);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-h-[220px]"
      preserveAspectRatio="xMidYMid meet"
    >
      {data.map((d, i) => {
        const x = padding.left + i * stepX - barWidth / 2;
        const barH = (d.exams / maxVal) * chartH;
        const y = padding.top + chartH - barH;
        return (
          <rect
            key={d.month}
            x={x}
            y={y}
            width={barWidth}
            height={barH}
            rx={3}
            className="fill-primary/20"
          />
        );
      })}
      <polyline
        points={linePoints("takers")}
        fill="none"
        className="stroke-primary"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => {
        const x = padding.left + i * stepX;
        return (
          <text
            key={`label-${d.month}`}
            x={x}
            y={height - 6}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {d.month}
          </text>
        );
      })}
    </svg>
  );
}
