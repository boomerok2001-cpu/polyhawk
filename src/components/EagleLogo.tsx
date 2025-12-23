export default function EagleLogo({ size = 40 }: { size?: number }) {
    return (
        <div style={{ width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img
                src="/hawk-logo.svg"
                alt="Poly Hawk"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </div>
    );
}
