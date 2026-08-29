/* The OurEdu radial mark, lifted from the official logo file and split into
   individually addressable petals so it can be animated one blade at a time.
   Source viewBox is cropped to the mark only (the wordmark lives in logo.svg). */

export const PETALS: { d: string; tone: "light" | "deep" }[] = [
  {
    d: "M196.513 20.674L192.863 4.94177C192.863 4.94177 209.968 9.35322 209.968 16.3365V31.1702C209.968 31.1702 209.923 23.2606 196.513 20.674Z",
    tone: "light",
  },
  {
    d: "M196.054 48.4315L180.318 52.0769C180.318 52.0769 184.725 34.9713 191.718 34.9713H206.546C206.546 34.9713 198.642 35.0177 196.054 48.4315Z",
    tone: "light",
  },
  {
    d: "M224.489 21.0546L239.998 17.486C239.998 17.486 235.65 34.2114 228.764 34.2114H214.15C214.15 34.2114 221.941 34.1657 224.489 21.0546Z",
    tone: "light",
  },
  {
    d: "M224.182 49.1115L227.834 64.621C227.834 64.621 210.729 60.2795 210.729 53.3858V38.7728C210.729 38.7728 210.774 46.5615 224.182 49.1115Z",
    tone: "light",
  },
  {
    d: "M224.182 20.674L227.834 4.94177C227.834 4.94177 210.729 9.35322 210.729 16.3365V31.1702C210.729 31.1702 210.774 23.2606 224.182 20.674Z",
    tone: "deep",
  },
  {
    d: "M196.054 21.0548L180.318 17.486C180.318 17.486 184.725 34.2114 191.718 34.2114H206.546C206.546 34.2114 198.642 34.1678 196.054 21.0548Z",
    tone: "deep",
  },
  {
    d: "M224.64 48.4315L240.378 52.0769C240.378 52.0769 235.972 34.9713 228.979 34.9713H214.15C214.15 34.9713 222.054 35.0177 224.64 48.4315Z",
    tone: "deep",
  },
  {
    d: "M196.513 49.1112L192.863 64.6207C192.863 64.6207 209.968 60.2792 209.968 53.3855V38.7725C209.968 38.7725 209.923 46.5612 196.513 49.1112Z",
    tone: "deep",
  },
];

export const DOTS = [
  { cx: 210.538, cy: 4.75, r: 4.75 },
  { cx: 180.06, cy: 35.16, r: 4.75 },
  { cx: 240.63, cy: 35.16, r: 4.75 },
  { cx: 210.539, cy: 65.13, r: 4.75 },
];

export function Mark({ size = 96, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="175.3 0 70.7 70"
      fill="none"
      className={className}
      role="img"
      aria-label="OurEdu"
    >
      <g className="mark-spin">
        {PETALS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            className="mark-petal"
            data-tone={p.tone}
            fill={p.tone === "light" ? "#00ACED" : "#006CB6"}
          />
        ))}
        {DOTS.map((d, i) => (
          <circle
            key={`d${i}`}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            className="mark-dot"
            fill={i % 2 === 0 ? "#00ACED" : "#006CB6"}
          />
        ))}
      </g>
    </svg>
  );
}
