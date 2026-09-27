import { CornerSprigs } from "@/components/Botanical";
import { Insignia } from "@/components/Insignia";
import { wedding } from "@/config/wedding";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-xl bg-white p-2 shadow-[0_24px_60px_-30px_rgba(78,15,24,0.35)]">
      <CornerSprigs />
      <div className="relative px-5 py-9 text-center ring-1 ring-gold/70 sm:px-12 sm:py-14">{children}</div>
    </div>
  );
}

export function Monogram() {
  return <Insignia className="mx-auto mb-5 size-28 sm:size-32" />;
}

export function PhotoCredit({ onDark = false }: { onDark?: boolean }) {
  return <p className={`py-6 text-center text-xs ${onDark ? "text-ivory/60" : "text-ink/50"}`}>Photo: {wedding.photoCredit}</p>;
}
