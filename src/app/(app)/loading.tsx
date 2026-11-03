/** Squelette affiché pendant le chargement d'un écran (fond gray-5, formes des cartes du design system). */
export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-4 pt-[calc(env(safe-area-inset-top,0px)+60px)] md:pt-4" aria-busy="true" aria-label="Chargement">
      <div className="h-10 w-56 rounded-sm bg-gray-5 md:h-6 md:w-44" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-lg bg-gray-5" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-lg bg-gray-5" />
        <div className="h-64 rounded-lg bg-gray-5" />
      </div>
    </div>
  );
}
