export function DuplicateIcon({ size = 24, color = "#666" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="7" y="7" width="13" height="13" rx="2" />
            <path d="M3 17V3h14" />
        </svg>
    );
}
