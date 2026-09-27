import { SprigDivider } from "@/components/Botanical";
import { Monogram } from "@/components/Frame";
import { wedding } from "@/config/wedding";

export function NoInvitation({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-dvh flex-col bg-[linear-gradient(to_bottom,var(--color-ivory)_62%,var(--color-maroon-deep))] px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))] text-center text-maroon-deep">
      <div className="my-auto pb-[12vh]">
        <Monogram />
        <p className="text-xs font-medium tracking-[0.2em] text-balance text-gold-deep uppercase sm:tracking-[0.3em]">{title}</p>
        <h1 className="mt-3 font-serif text-[clamp(2.75rem,13vw,5rem)] leading-tight whitespace-nowrap">{wedding.couple}</h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-pretty text-ink/75">{message}</p>
        <SprigDivider className="mt-8" />
      </div>
    </main>
  );
}
