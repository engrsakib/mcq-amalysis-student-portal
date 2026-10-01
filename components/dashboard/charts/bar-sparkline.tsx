type BarSparklineProps = {
  values: number[];
  width?: number;
  height?: number;
};

export function BarSparkline({
  values,
  width = 120,
  height = 48,
}: BarSparklineProps) {
  const max = Math.max(...values, 1);
  const barWidth = width / values.length - 2;

  return (
    <svg width={width} height={height} className="shrink-0">
      {values.map((v, i) => {
        const barHeight = (v / max) * (height - 4);
        const x = i * (barWidth + 2) + 1;
        const y = height - barHeight;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={2}
            className="fill-primary/80"
          />
        );
      })}
    </svg>
  );
}
