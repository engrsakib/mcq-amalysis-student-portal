type LineSparklineProps = {
  values: number[];
  width?: number;
  height?: number;
};

export function LineSparkline({
  values,
  width = 120,
  height = 48,
}: LineSparklineProps) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);

  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - 4 - ((v - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="shrink-0">
      <polygon points={areaPoints} className="fill-primary/15" />
      <polyline
        points={points}
        fill="none"
        className="stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
