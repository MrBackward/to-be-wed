const cx = 100;
const cy = 100;
const r = 80;

const point = (deg: number, radius = r) => {
  const rad = (deg * Math.PI) / 180;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)] as const;
};

const fmt = (n: number) => n.toFixed(1);

function arcPath(from: number, to: number) {
  const [x1, y1] = point(from);
  const [x2, y2] = point(to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M${fmt(x1)} ${fmt(y1)} A${r} ${r} 0 ${large} ${sweep} ${fmt(x2)} ${fmt(y2)}`;
}

const wheatFrom = 102;
const wheatTo = 173;

const grains = Array.from({ length: 9 }, (_, i) => {
  const t = i / 8;
  const deg = wheatFrom + (wheatTo - wheatFrom) * (0.3 + t * 0.66);
  const [x, y] = point(deg);
  const length = 8.5 - t * 2.5;
  const forward = deg + 90;
  return [-1, 1].map((side) => ({ x, y, rotate: forward + side * 32, length, width: length * 0.36 }));
}).flat();

const tip = (() => {
  const [x, y] = point(wheatTo + 1);
  return { x, y, rotate: wheatTo + 91, length: 7, width: 2.4 };
})();

function Grain({ x, y, rotate, length, width }: { x: number; y: number; rotate: number; length: number; width: number }) {
  return (
    <g transform={`translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(rotate)})`}>
      <path
        d={`M0 0 C${fmt(length * 0.2)} ${fmt(-width)} ${fmt(length * 0.75)} ${fmt(-width)} ${fmt(length)} 0 C${fmt(length * 0.75)} ${fmt(width)} ${fmt(length * 0.2)} ${fmt(width)} 0 0 Z`}
        strokeWidth={0.9}
      />
      <path d={`M${fmt(length)} 0 L${fmt(length + 7)} 0`} strokeWidth={0.45} />
    </g>
  );
}

export function Insignia({ className = "" }: { className?: string }) {
  return (
    <svg role="img" aria-label="N and X" viewBox="0 0 200 200" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="text-gold-deep/85">
        <path d={arcPath(-75, 7.6)} strokeWidth={1.1} />
        <path d={arcPath(wheatFrom, wheatTo)} strokeWidth={1.1} />
        {grains.map((grain) => (
          <Grain key={`${fmt(grain.x)}-${fmt(grain.rotate)}`} {...grain} />
        ))}
        <Grain {...tip} />
      </g>
      <text
        x="100"
        y="128"
        fontSize="84"
        textAnchor="middle"
        className="fill-gold-deep/85"
        style={{ fontFamily: "var(--font-script)" }}
      >
        &amp;
      </text>
      <text x="36" y="94" fontSize="62" className="fill-maroon" style={{ fontFamily: "var(--font-display)" }}>
        N
      </text>
      <text x="114" y="164" fontSize="62" className="fill-maroon" style={{ fontFamily: "var(--font-display)" }}>
        X
      </text>
    </svg>
  );
}
