type Point = [number, number];

const stem: [Point, Point, Point, Point] = [
  [6, 38],
  [44, 38],
  [92, 28],
  [136, 10],
];

function along(t: number) {
  const [p0, p1, p2, p3] = stem;
  const u = 1 - t;
  const at = (i: 0 | 1) => u ** 3 * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t ** 3 * p3[i];
  const slope = (i: 0 | 1) =>
    3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]);
  return { x: at(0), y: at(1), angle: (Math.atan2(slope(1), slope(0)) * 180) / Math.PI };
}

const leaves = [0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92].map((t, i) => {
  const { x, y, angle } = along(t);
  const length = 24 - i * 2;
  const side = i % 2 === 0 ? -1 : 1;
  return { x, y, rotate: angle + side * 38, length, width: length * 0.22 };
});

const wattle: Point[] = [
  [9, 30],
  [15, 27],
  [12, 22],
  [20, 31],
  [4, 26],
];

export function Sprig() {
  const [p0, p1, p2, p3] = stem;
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${p0} C${p1} ${p2} ${p3}`} strokeWidth={1.2} />
      {leaves.map(({ x, y, rotate, length, width }) => (
        <g key={`${x}-${y}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate.toFixed(1)})`}>
          <path
            d={`M0 0 C${length * 0.3} ${-width} ${length * 0.72} ${-width} ${length} 0 C${length * 0.72} ${width} ${length * 0.3} ${width} 0 0 Z`}
            strokeWidth={1.1}
          />
          <path d={`M1.5 0 L${length - 2} 0`} strokeWidth={0.6} />
        </g>
      ))}
      {wattle.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M${p0[0] + 2} ${p0[1] - 1} L${x} ${y}`} strokeWidth={0.6} />
          <circle cx={x} cy={y} r={2.4} strokeWidth={1} />
        </g>
      ))}
    </g>
  );
}

export function GumSprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 142 48" className={className}>
      <g transform={flip ? "translate(142 0) scale(-1 1)" : undefined}>
        <Sprig />
      </g>
    </svg>
  );
}

export function SprigDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`mx-auto flex items-center justify-center gap-1 text-gold-deep/60 ${className}`}>
      <GumSprig flip className="h-5 w-16" />
      <svg viewBox="0 0 12 12" className="size-2.5">
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <GumSprig className="h-5 w-16" />
    </div>
  );
}

export function CornerSprigs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-gold/70">
      <GumSprig className="absolute -top-1 -left-3 w-28 rotate-[28deg] sm:w-36" />
      <GumSprig className="absolute -right-3 -bottom-1 w-28 rotate-[208deg] sm:w-36" />
    </div>
  );
}
