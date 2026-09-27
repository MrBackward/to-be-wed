import dam from "@/assets/venue-dam.jpg";
import { Monogram, PhotoCredit } from "@/components/Frame";
import { Hero } from "@/components/Hero";
import { wedding } from "@/config/wedding";

export function NoInvitation({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-dvh flex-col">
      <Hero
        image={dam}
        alt="White timber benches on the lawn by the dam at Bison Barn, with Widgee Mountain behind"
        position="center 30%"
      >
        <Monogram light />
        <p className="text-xs font-medium tracking-[0.2em] text-balance text-gold uppercase sm:tracking-[0.3em]">{title}</p>
        <h1 className="mt-3 font-serif text-[clamp(2.75rem,13vw,5rem)] leading-tight whitespace-nowrap">{wedding.couple}</h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-pretty text-ivory/90">{message}</p>
      </Hero>
      <div className="mt-auto pb-[env(safe-area-inset-bottom)]">
        <PhotoCredit />
      </div>
    </main>
  );
}
