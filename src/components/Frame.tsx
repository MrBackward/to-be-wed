import { wedding } from "@/config/wedding";

export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-16">
      <div className="w-full max-w-xl bg-ivory p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
        <div className="px-5 py-9 text-center ring-1 ring-gold/70 sm:px-12 sm:py-14">{children}</div>
      </div>
    </main>
  );
}

export function Monogram() {
  return (
    <div className="mx-auto mb-6 flex flex-col items-center gap-3 text-maroon">
      <span className="font-serif text-lg tracking-[0.35em] italic">{wedding.monogram}</span>
      <span className="h-px w-16 bg-gold" />
    </div>
  );
}
