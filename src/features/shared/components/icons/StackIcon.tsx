export default function StackIcon({ size = 24 }: any) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background */}
            <rect x="1" y="1" width="30" height="30" rx="6" fill="black" />

            {/* Top bar */}
            <rect x="6" y="8" width="20" height="6" rx="2" fill="#1DA1FF" />

            {/* Bottom bar */}
            <rect x="6" y="18" width="20" height="6" rx="2" fill="#1DA1FF" />
        </svg>
    );
}