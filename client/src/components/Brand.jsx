export default function Brand({ light = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${light ? 'bg-white/10' : 'bg-ink'}`}>
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <path d="M6 10h20v4a2 2 0 0 0 0 4v4H6v-4a2 2 0 0 0 0-4z" fill="#5CC4B8" />
        </svg>
      </span>
      <span className={`font-display text-lg font-bold ${light ? 'text-white' : 'text-ink'}`}>Deskwise</span>
    </span>
  );
}
