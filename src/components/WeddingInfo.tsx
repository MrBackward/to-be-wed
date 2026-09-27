import { formatDay, formatTime, wedding } from "@/config/wedding";

const { camping } = wedding;
const when = (date: Date) => `${formatTime(date)} on ${formatDay(date)}`;

function Item({
  title,
  highlight = false,
  children,
}: {
  title: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={highlight ? "rounded-md bg-maroon-mist/60 p-4" : undefined}>
      <h3 className="font-serif text-xl text-maroon-deep">{title}</h3>
      <p className="mt-1 text-pretty text-ink/80">{children}</p>
    </div>
  );
}

export function WeddingInfo({ early, ceremony }: { early: boolean; ceremony: boolean }) {
  return (
    <section aria-labelledby="good-to-know" className="mt-8">
      <h2
        id="good-to-know"
        className="text-xs font-medium tracking-[0.2em] text-maroon/80 uppercase sm:tracking-[0.3em]"
      >
        Good to know
      </h2>
      <div className="mt-6 space-y-6 text-left">
        {early && (
          <Item title="Arriving early" highlight>
            You&apos;re one of the lucky few joining us the day before, so come and claim the best spot from{" "}
            {when(camping.earlyFrom)}. Bragging rights are included.
          </Item>
        )}
        <Item title="Camping">
          The venue is a campground first and a wedding venue second, so everyone is welcome to camp. Bring your own
          tent, swag or caravan; we&apos;re supplying the view, not the gear. {early ? "Everyone else can" : "You can"}{" "}
          set up from {when(camping.from)}, and campsites need to be packed up and gone by {when(camping.until)}.
        </Item>
        <Item title="Other places to stay">
          There are a few cabins at the venue, but they&apos;re limited and family (like our grandparents) get first
          dibs. If sleeping on the ground isn&apos;t your thing, Gympie has plenty of hotels and motels, only a{" "}
          {wedding.gympieDrive} drive away.
        </Item>
        <Item title="Getting there">
          You&apos;ll need to organise your own transport to and from the venue. Please don&apos;t drink and drive.
          There are a lot of cops on the guest list.
        </Item>
        <Item title="Footwear">
          {ceremony &&
            `The ceremony at ${wedding.ceremonySpot} is flat-ish, but it's grass, not a footpath, so wear something you can walk on without rolling an ankle. `}
          The barn is flat and level, but the campground and paddocks around it aren&apos;t built for 30 inch stilettos,
          unless your ankles are freakishly strong.
        </Item>
        <Item title="Food">
          There&apos;s no sit-down meal. Instead there&apos;ll be grazing platters through the reception and wood-fired
          pizzas made to order whenever hunger strikes. We&apos;ll pause for a few quiet moments for speeches, so save
          the heckling for after.
        </Item>
        <Item title="Drinks">
          A selection of beer and wine will be out for everyone to help themselves from when the reception kicks off.
          The venue is fully BYO, so feel free to bring your favourite drop too.
        </Item>
        <Item title="Kids">
          Fair warning: this isn&apos;t a kid-friendly party. There&apos;ll be plenty of alcohol and some very relaxed
          supervision of the &quot;bar&quot;, so it&apos;s probably one to leave the little ones at home for.
        </Item>
        <Item title="Noise">
          {wedding.council} has a {formatTime(wedding.quietFrom)} excessive noise rule, so after{" "}
          {formatTime(wedding.quietFrom)} we turn it down a notch. Please help us keep it that way; we&apos;d rather not
          meet the cops who aren&apos;t on the guest list.
        </Item>
        <Item title="Gifts">
          There&apos;s no expectation of gifts. We invited you because we like you, not your wallet. If you&apos;d still
          like to give us something, a card with a contribution towards our next adventure would be warmly appreciated.
        </Item>
      </div>
    </section>
  );
}
