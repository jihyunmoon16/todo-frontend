import './MoonPhase.css';

// Brand Colors
const WARM_AMBER = '#FFBF00';
const CREAMY_SILK = '#FFFDD0';
const MIDNIGHT_VOID = '#0D0D0F';
const MOONLIGHT_CHARCOAL = '#1A1A1D';

// Full Moon - CRITICAL priority (bright, fully illuminated)
export function FullMoon({ size = 24, className = '', glow = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`moon-phase moon-full ${glow ? 'moon-glow' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="url(#fullMoonGradient)" />
      <circle cx="12" cy="12" r="10" stroke={WARM_AMBER} strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Craters for texture */}
      <circle cx="8" cy="9" r="2" fill="rgba(230, 172, 0, 0.3)" />
      <circle cx="15" cy="14" r="1.5" fill="rgba(230, 172, 0, 0.25)" />
      <circle cx="10" cy="15" r="1" fill="rgba(230, 172, 0, 0.2)" />
      <defs>
        <radialGradient id="fullMoonGradient" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor={CREAMY_SILK} />
          <stop offset="50%" stopColor={WARM_AMBER} />
          <stop offset="100%" stopColor="#E6AC00" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Waxing Gibbous - HIGH priority (>75% illuminated)
export function WaxingGibbous({ size = 24, className = '', glow = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`moon-phase moon-gibbous ${glow ? 'moon-glow' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="gibbousClip">
          <circle cx="12" cy="12" r="10" />
        </clipPath>
        <radialGradient id="gibbousGradient" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor={CREAMY_SILK} />
          <stop offset="50%" stopColor={WARM_AMBER} />
          <stop offset="100%" stopColor="#E6AC00" />
        </radialGradient>
      </defs>
      {/* Dark base */}
      <circle cx="12" cy="12" r="10" fill={MIDNIGHT_VOID} stroke={WARM_AMBER} strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Illuminated portion */}
      <g clipPath="url(#gibbousClip)">
        <ellipse cx="8" cy="12" rx="14" ry="10" fill="url(#gibbousGradient)" />
      </g>
      {/* Craters */}
      <circle cx="7" cy="9" r="1.5" fill="rgba(230, 172, 0, 0.25)" />
      <circle cx="10" cy="15" r="1" fill="rgba(230, 172, 0, 0.2)" />
    </svg>
  );
}

// Crescent - MEDIUM priority (sliver of light, ~25%)
export function Crescent({ size = 24, className = '', glow = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`moon-phase moon-crescent ${glow ? 'moon-glow' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="crescentClip">
          <circle cx="12" cy="12" r="10" />
        </clipPath>
        <linearGradient id="crescentGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={CREAMY_SILK} />
          <stop offset="100%" stopColor={WARM_AMBER} />
        </linearGradient>
      </defs>
      {/* Dark base */}
      <circle cx="12" cy="12" r="10" fill={MIDNIGHT_VOID} stroke={WARM_AMBER} strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Illuminated crescent */}
      <g clipPath="url(#crescentClip)">
        <ellipse cx="4" cy="12" rx="12" ry="10" fill="url(#crescentGradient)" />
      </g>
    </svg>
  );
}

// New Moon - LOW priority (outline/rim light only)
export function NewMoon({ size = 24, className = '', glow = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`moon-phase moon-new ${glow ? 'moon-glow' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="newMoonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(255, 191, 0, 0.2)" />
        </radialGradient>
      </defs>
      {/* Dark moon with subtle rim light */}
      <circle cx="12" cy="12" r="10" fill={MIDNIGHT_VOID} />
      <circle cx="12" cy="12" r="10" fill="url(#newMoonGlow)" />
      <circle cx="12" cy="12" r="10" stroke={WARM_AMBER} strokeWidth="1" strokeOpacity="0.4" />
      {/* Subtle highlight on edge */}
      <path
        d="M 19 6 A 10 10 0 0 1 19 18"
        stroke={WARM_AMBER}
        strokeWidth="0.5"
        strokeOpacity="0.3"
        fill="none"
      />
    </svg>
  );
}

// Timer Moon - Large decorative moon for the Pomodoro timer
export function TimerMoon({ size = 200, progress = 0, className = '' }) {
  // Progress: 0-100, determines how much of the moon is illuminated
  const illumination = Math.max(0, Math.min(100, progress));

  // Calculate the position for the shadow ellipse
  // At 0%, shadow covers everything (new moon)
  // At 100%, no shadow (full moon)
  const shadowCx = 12 - (illumination / 100) * 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`moon-phase moon-timer ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="timerMoonGradient" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor={CREAMY_SILK} />
          <stop offset="50%" stopColor={WARM_AMBER} />
          <stop offset="100%" stopColor="#E6AC00" />
        </radialGradient>
        <clipPath id="timerMoonClip">
          <circle cx="12" cy="12" r="10" />
        </clipPath>
        <filter id="timerMoonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <circle cx="12" cy="12" r="11" fill="rgba(255, 191, 0, 0.1)" />

      {/* Base illuminated moon */}
      <circle cx="12" cy="12" r="10" fill="url(#timerMoonGradient)" filter="url(#timerMoonGlow)" />

      {/* Shadow overlay for phase effect */}
      <g clipPath="url(#timerMoonClip)">
        <ellipse
          cx={shadowCx}
          cy="12"
          rx="12"
          ry="12"
          fill={MOONLIGHT_CHARCOAL}
          style={{ transition: 'cx 0.5s ease' }}
        />
      </g>

      {/* Craters visible on illuminated portion */}
      {illumination > 30 && (
        <>
          <circle cx="8" cy="9" r="1.5" fill="rgba(230, 172, 0, 0.3)" opacity={illumination / 100} />
          <circle cx="14" cy="13" r="1" fill="rgba(230, 172, 0, 0.25)" opacity={illumination / 100} />
          <circle cx="10" cy="15" r="0.8" fill="rgba(230, 172, 0, 0.2)" opacity={illumination / 100} />
        </>
      )}

      {/* Rim highlight */}
      <circle cx="12" cy="12" r="10" stroke={WARM_AMBER} strokeWidth="0.3" strokeOpacity="0.5" fill="none" />
    </svg>
  );
}

// Helper component that returns the correct moon phase based on priority
export function MoonPhaseIcon({ priority, size = 24, glow = false, className = '' }) {
  switch (priority) {
    case 'CRITICAL':
      return <FullMoon size={size} glow={glow} className={className} />;
    case 'HIGH':
      return <WaxingGibbous size={size} glow={glow} className={className} />;
    case 'MEDIUM':
      return <Crescent size={size} glow={glow} className={className} />;
    case 'LOW':
    default:
      return <NewMoon size={size} glow={glow} className={className} />;
  }
}

// Priority label mapping
export const PRIORITY_LABELS = {
  CRITICAL: 'Full Moon',
  HIGH: 'Gibbous',
  MEDIUM: 'Crescent',
  LOW: 'New Moon'
};

export default MoonPhaseIcon;
