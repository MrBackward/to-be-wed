import { wedding } from "@/config/wedding";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl bg-ivory p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
      <div className="px-5 py-9 text-center ring-1 ring-gold/70 sm:px-12 sm:py-14">{children}</div>
    </div>
  );
}

export function Monogram({ light = false }: { light?: boolean }) {
  return (
    <div className={`mx-auto mb-6 flex flex-col items-center gap-3 ${light ? "text-ivory" : "text-maroon"}`}>
      <span className="font-serif text-lg tracking-[0.35em] italic">{wedding.monogram}</span>
      <span className="h-px w-16 bg-gold" />
    </div>
  );
}

export function PhotoCredit() {
  return <p className="py-6 text-center text-xs text-ivory/50">Photo: {wedding.photoCredit}</p>;
}
