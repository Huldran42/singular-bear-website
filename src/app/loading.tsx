export default function Loading() {
  return (
    <main className="min-h-[100dvh] bg-studio-bg px-5 pb-20 pt-32 text-studio-text sm:px-8">
      <div className="mx-auto max-w-[1400px] animate-pulse">
        <div className="h-4 w-28 rounded-full bg-studio-line" />
        <div className="mt-6 h-16 max-w-xl rounded-[14px] bg-studio-line" />
        <div className="mt-4 h-5 max-w-md rounded-full bg-studio-line" />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="aspect-[3/2] rounded-[14px] bg-studio-line" />
          <div className="aspect-[3/2] rounded-[14px] bg-studio-line" />
        </div>
      </div>
    </main>
  );
}
