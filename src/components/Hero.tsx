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
          sizes="(max-width: 768px) 1200px, 100vw"
          style={{ objectPosition: position }}
          className="animate-drift object-cover motion-reduce:animate-none"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(78_15_24/0.25),transparent_18%,transparent_68%,var(--color-maroon-deep))]"
        />
      </div>
      <div className="relative -mt-8 px-6 text-center text-ivory">{children}</div>
    </section>
  );
}
