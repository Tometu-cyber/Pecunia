/** Squelette affiché pendant le chargement d'un écran. */
export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-busy="true" aria-label="Chargement">
      <div className="h-9 w-56 rounded-lg bg-fill-secondary" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-fill-secondary" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-lg bg-fill-secondary" />
        <div className="h-64 rounded-lg bg-fill-secondary" />
      </div>
    </div>
  );
}
