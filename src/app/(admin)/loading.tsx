// Shown inside the admin shell while a page fetches its data.
// Direct visits, refreshes and the browser back button don't use the blast door, so this covers them.
export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse">
      <div className="mb-8">
        <div className="h-3.5 w-28 bg-line" />
        <div className="mt-4 h-10 w-72 max-w-full bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="chamfer h-32 bg-line/60" />
        ))}
      </div>
      <div className="chamfer mt-4 h-64 bg-line/40" />
    </div>
  );
}
