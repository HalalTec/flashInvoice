export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer Hexagon Shell */}
            <path
                d="M50 5L89.1747 27.5V72.5L50 95L10.8253 72.5V27.5L50 5Z"
                fill="currentColor"
            />
            {/* Inner "Pivot" lines to create the 3D / Audit perspective effect */}
            <path
                d="M50 50L89.1747 27.5M50 50V95M50 50L10.8253 27.5"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
            />
            {/* Central Node representing the "Outcome" */}
            <circle cx="50" cy="50" r="8" fill="white" />
        </svg>
    );
}