import icons from "./platformIcons.json";

// Brand marks from simple-icons (CC0), drawn in one solid colour to match the site.
const PATHS = icons as Record<string, { title: string; path: string }>;

export function PlatformIcon({ id, className = "" }: { id: string; className?: string }) {
  if (id === "wos") {
    return (
      <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Web of Science">
        <text x="12" y="16" textAnchor="middle" fontSize="10.5" fontWeight="700" fontFamily="Geist, Arial, sans-serif" fill="currentColor" letterSpacing="-0.5">WoS</text>
      </svg>
    );
  }
  const icon = PATHS[id];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={icon.title} fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}
