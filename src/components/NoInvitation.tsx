import { Frame, Monogram } from "@/components/Frame";
import { wedding } from "@/config/wedding";

export function NoInvitation({ title, message }: { title: string; message: string }) {
  return (
    <Frame>
      <Monogram />
      <p className="text-xs font-medium tracking-[0.2em] text-balance text-maroon/80 uppercase sm:tracking-[0.3em]">{title}</p>
      <h1 className="mt-4 font-serif text-[clamp(2.25rem,11vw,3.75rem)] leading-tight whitespace-nowrap text-maroon-deep">{wedding.couple}</h1>
      <p className="mx-auto mt-6 max-w-sm leading-relaxed text-pretty text-ink/80">{message}</p>
    </Frame>
  );
}
