import Image, { type StaticImageData } from "next/image";

export function Hero({
  image,
  alt,
  position = "center",
  children,
}: {
  image: StaticImageData;
  alt: string;
  position?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative isolate">
      <div className="relative h-[48svh] max-h-[760px] min-h-64 overflow-hidden md:h-[68svh]">
        <Image
          src={image}
          alt={alt}
          fill
          preload
          placeholder="blur"
          style={{ objectPosition: position }}
          className="animate-drift object-cover motion-reduce:animate-none"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,var(--color-ivory))]"
        />
      </div>
      <div className="relative -mt-8 px-6 text-center text-maroon-deep">{children}</div>
    </section>
  );
}
