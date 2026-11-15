/**
 * 21st.dev-inspired animated perimeter Border Beam aligned to QUEST tokens.
 */
export default function BorderBeam({
  duration = 6,
  delay = 0,
  borderWidth = 1.25,
  colorFrom = '#A879E6',
  colorTo = '#2EEED0',
  className = '',
}) {
  return (
    <span
      aria-hidden="true"
      className={`quest-border-beam ${className}`}
      style={{
        '--beam-duration': `${duration}s`,
        '--beam-delay': `${delay}s`,
        '--beam-width': `${borderWidth}px`,
        '--beam-from': colorFrom,
        '--beam-to': colorTo,
      }}
    />
  );
}
