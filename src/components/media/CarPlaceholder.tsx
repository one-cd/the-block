type CarPlaceholderProps = {
  kind?: "sedan" | "suv" | "truck";
  seed?: number;
};

export function CarPlaceholder({ kind = "sedan", seed = 0 }: CarPlaceholderProps) {
  const bodyColors = ["#2d3748", "#4a5568", "#1a202c", "#3a4555", "#5a6878", "#222a35", "#3b4252", "#4a5060"];
  const color = bodyColors[seed % bodyColors.length];
  const shadow = "rgba(0,0,0,0.25)";
  const vehicle = kind === "truck" ? truck(color, shadow) : kind === "suv" ? suv(color, shadow) : sedan(color, shadow);

  return (
    <>
      <div className="placeholder-tarmac" />
      <div className="placeholder-car">{vehicle}</div>
    </>
  );
}

function truck(color: string, shadow: string) {
  return (
    <svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <ellipse cx="100" cy="82" rx="80" ry="4" fill={shadow} />
      <path d="M20,60 L20,50 L40,30 L80,28 L100,40 L180,40 L180,60 Z" fill={color} />
      <rect x="40" y="35" width="40" height="15" rx="2" fill="#cfd8e3" opacity="0.6" />
      <rect x="85" y="42" width="60" height="14" rx="1" fill={color} stroke="#000" strokeWidth="0.5" opacity="0.9" />
      <circle cx="50" cy="65" r="10" fill="#1a1a1a" />
      <circle cx="50" cy="65" r="5" fill="#3a3a3a" />
      <circle cx="155" cy="65" r="10" fill="#1a1a1a" />
      <circle cx="155" cy="65" r="5" fill="#3a3a3a" />
    </svg>
  );
}

function sedan(color: string, shadow: string) {
  return (
    <svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <ellipse cx="100" cy="80" rx="78" ry="4" fill={shadow} />
      <path d="M15,62 Q15,52 30,48 L55,42 Q70,28 100,28 Q130,28 145,42 L175,48 Q185,52 185,62 L185,68 L15,68 Z" fill={color} />
      <path d="M55,42 Q70,30 100,30 Q130,30 145,42 L135,46 L65,46 Z" fill="#a8b8c8" opacity="0.7" />
      <path d="M98,32 L98,46 M102,32 L102,46" stroke={color} strokeWidth="1.5" />
      <circle cx="50" cy="68" r="11" fill="#1a1a1a" />
      <circle cx="50" cy="68" r="6" fill="#3a3a3a" />
      <circle cx="150" cy="68" r="11" fill="#1a1a1a" />
      <circle cx="150" cy="68" r="6" fill="#3a3a3a" />
      <rect x="22" y="58" width="6" height="3" rx="1" fill="#ffeb88" />
      <rect x="172" y="58" width="6" height="3" rx="1" fill="#dd3333" />
    </svg>
  );
}

function suv(color: string, shadow: string) {
  return (
    <svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <ellipse cx="100" cy="80" rx="78" ry="4" fill={shadow} />
      <path d="M18,62 L18,48 Q18,40 28,38 L50,32 Q60,26 100,26 Q140,26 150,32 L172,38 Q182,40 182,48 L182,68 L18,68 Z" fill={color} />
      <rect x="40" y="34" width="40" height="20" rx="2" fill="#a8b8c8" opacity="0.7" />
      <rect x="85" y="34" width="35" height="20" rx="2" fill="#a8b8c8" opacity="0.7" />
      <rect x="125" y="34" width="30" height="20" rx="2" fill="#a8b8c8" opacity="0.7" />
      <circle cx="52" cy="68" r="12" fill="#1a1a1a" />
      <circle cx="52" cy="68" r="6" fill="#3a3a3a" />
      <circle cx="148" cy="68" r="12" fill="#1a1a1a" />
      <circle cx="148" cy="68" r="6" fill="#3a3a3a" />
    </svg>
  );
}
