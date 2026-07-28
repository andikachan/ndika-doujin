export default function SakuraLogo({ className = "w-7 h-7" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g>
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={angle}
            d="M24 24 C17 22 15 14 19 6 C20.5 4.5 22 6.5 24 6 C26 6.5 27.5 4.5 29 6 C33 14 31 22 24 24 Z"
            fill="url(#petalGradient)"
            transform={`rotate(${angle} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="4" fill="#ec4899" />
      </g>
      <defs>
        <linearGradient id="petalGradient" x1="24" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#e97991" />
        </linearGradient>
      </defs>
    </svg>
  );
}
