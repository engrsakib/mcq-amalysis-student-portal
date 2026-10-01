import type { PersonalGrowthTimePoint } from "@/lib/api/types";
import { formatExamDateShort } from "@/lib/datetime/format-exam";

type PersonalGrowthChartProps = {
  data: PersonalGrowthTimePoint[];
};

function formatChartDate(isoDate: string): string {
  return formatExamDateShort(`${isoDate}T12:00:00`);
}

const GRID_LINES = 4;

export function PersonalGrowthChart({ data }: PersonalGrowthChartProps) {
  const width = 560;
  const height = 220;
  const padding = { top: 28, right: 44, bottom: 32, left: 44 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Bars and line use separate Y scales (attempts vs avgTotalScore marks).
  const maxAttempts = Math.max(...data.map((d) => d.attempts), 1);
  const maxScore = Math.max(...data.map((d) => d.avgTotalScore), 1);
  const slotW = chartW / data.length;
  const barWidth = Math.min(Math.max(slotW * 0.42, 14), 36);

  const xForIndex = (i: number) =>
    padding.left + slotW * i + slotW / 2;

  const scorePoints = data.map((d, i) => {
    const x = xForIndex(i);
    const y =
      padding.top + chartH - (d.avgTotalScore / maxScore) * chartH;
    return { x, y, d };
  });

  const scoreLinePoints = scorePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = [
    `${padding.left},${padding.top + chartH}`,
    ...scorePoints.map((p) => `${p.x},${p.y}`),
    `${padding.left + chartW},${padding.top + chartH}`,
  ].join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-h-[240px]"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Personal growth chart: attempts and average score over the last three days"
    >
      <defs>
        <linearGradient id="pg-score-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="pg-bar-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
        const y = padding.top + (chartH / GRID_LINES) * i;
        return (
          <line
            key={`grid-${i}`}
            x1={padding.left}
            y1={y}
            x2={padding.left + chartW}
            y2={y}
            className="stroke-line/70"
            strokeWidth={1}
            strokeDasharray={i === GRID_LINES ? undefined : "4 4"}
          />
        );
      })}

      <text
        x={padding.left - 8}
        y={padding.top + 4}
        textAnchor="end"
        className="fill-muted-foreground text-[9px] font-medium"
      >
        {maxAttempts}
      </text>
      <text
        x={padding.left - 8}
        y={padding.top + chartH + 4}
        textAnchor="end"
        className="fill-muted-foreground text-[9px] font-medium"
      >
        0
      </text>
      <text
        x={padding.left + chartW + 8}
        y={padding.top + 4}
        textAnchor="start"
        className="fill-muted-foreground text-[9px] font-medium"
      >
        {Math.round(maxScore)}
      </text>
      <text
        x={padding.left + chartW + 8}
        y={padding.top + chartH + 4}
        textAnchor="start"
        className="fill-muted-foreground text-[9px] font-medium"
      >
        0
      </text>

      {data.map((d, i) => {
        const x = xForIndex(i) - barWidth / 2;
        const barH = (d.attempts / maxAttempts) * chartH;
        const y = padding.top + chartH - barH;
        return (
          <g key={d.date}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={4}
              fill="url(#pg-bar-fill)"
              className="stroke-primary/25"
              strokeWidth={1}
            />
            <text
              x={xForIndex(i)}
              y={y - 6}
              textAnchor="middle"
              className="fill-ink text-[10px] font-semibold tabular-nums"
            >
              {d.attempts}
            </text>
          </g>
        );
      })}

      <polygon points={areaPoints} fill="url(#pg-score-area)" />
      <polyline
        points={scoreLinePoints}
        fill="none"
        className="stroke-primary"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {scorePoints.map(({ x, y, d }) => (
        <g key={`dot-${d.date}`}>
          <circle
            cx={x}
            cy={y}
            r={5}
            className="fill-primary/15 stroke-primary"
            strokeWidth={2}
          />
          <circle cx={x} cy={y} r={2.5} className="fill-primary" />
          <text
            x={x}
            y={y - 10}
            textAnchor="middle"
            className="fill-primary text-[10px] font-semibold tabular-nums"
          >
            {d.avgTotalScore % 1 === 0
              ? d.avgTotalScore
              : d.avgTotalScore.toFixed(1)}
          </text>
        </g>
      ))}

      {data.map((d, i) => (
        <text
          key={`label-${d.date}`}
          x={xForIndex(i)}
          y={height - 8}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-medium"
        >
          {formatChartDate(d.date)}
        </text>
      ))}
    </svg>
  );
}
