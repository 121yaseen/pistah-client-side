export default function AddIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      className={className}
    >
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="12"
        x2="18"
        y2="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
