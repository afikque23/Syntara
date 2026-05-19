export function Logo({ size = 40, textColor = "#3D35A8", darkMode = false }: { size?: number; textColor?: string; darkMode?: boolean }) {
  const w = size;
  const h = size * 1.1;

  return (
    <div className="flex items-center gap-2.5">
      <svg width={w} height={h} viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BCEF" />
            <stop offset="100%" stopColor="#3D35A8" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7EC8" />
            <stop offset="100%" stopColor="#3D35A8" />
          </linearGradient>
        </defs>
        <circle cx="36" cy="6" r="5" fill="#00BCEF" />
        <circle cx="10" cy="26" r="5" fill="#8B7EC8" />
        <circle cx="36" cy="46" r="5" fill="#3D35A8" />
        <circle cx="10" cy="8" r="4" fill="#3D35A8" />
        <circle cx="10" cy="44" r="4" fill="#8B7EC8" />

        <line x1="10" y1="8" x2="36" y2="6" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="6" x2="10" y2="26" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round" />
        <line x1="10" y1="26" x2="36" y2="46" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="46" x2="10" y2="44" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span
        style={{
          color: darkMode ? "#ffffff" : textColor,
          fontSize: size * 0.7,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Syntara
      </span>
    </div>
  );
}
