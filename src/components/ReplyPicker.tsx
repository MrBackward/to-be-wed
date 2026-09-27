"use client";

import { Choice } from "@/components/Choice";
import { emojis, emotions } from "@/config/rsvp";
import { lowerFirst, replyPhrase } from "@/lib/names";
import { replyFor, repliesFor } from "@/lib/schema";

const fieldClass =
  "block min-h-12 w-full rounded-md border border-maroon/30 bg-white py-3 pl-4 text-base placeholder:text-ink/40 focus:border-maroon focus:ring-2 focus:ring-gold/60 focus:outline-none";

const swipeRow =
  "-mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 fill-none stroke-maroon stroke-[1.8]"
    >
      <path d="M5.5 7.5 10 12l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function suggestionsFor(feeling: string) {
  const query = feeling.trim().toLowerCase();
  if (!query || emotions.some((emotion) => emotion.toLowerCase() === query)) return emotions;
  const matches = emotions.filter((emotion) => emotion.toLowerCase().includes(query));
  return matches.length ? matches : emotions;
}

export function ReplyPicker({
  id,
  legend,
  firstName,
  attending,
  feeling,
  emoji,
  reply,
  onAttendingChange,
  onFeelingChange,
  onEmojiChange,
  onReplyChange,
  onBlur,
  attendingError,
  feelingError,
}: {
  id: string;
  legend: string;
  firstName: string;
  attending: string;
  feeling: string;
  emoji: string;
  reply: string;
  onAttendingChange: (value: string) => void;
  onFeelingChange: (value: string) => void;
  onEmojiChange: (value: string) => void;
  onReplyChange: (value: string) => void;
  onBlur?: () => void;
  attendingError?: string;
  feelingError?: string;
}) {
  const shuffle = () => {
    const others = emotions.filter((emotion) => emotion !== feeling);
    onFeelingChange(others[Math.floor(Math.random() * others.length)]);
  };

  return (
    <div className="min-w-0 space-y-4">
      <Choice
        inline
        name={`${id}-attending`}
        legend={legend}
        options={[
          { value: "yes", label: "Accepts" },
          { value: "no", label: "Declines" },
        ]}
        value={attending}
        onChange={onAttendingChange}
        onBlur={onBlur}
        error={attendingError}
      />

      <fieldset className="min-w-0 space-y-4 rounded-md bg-maroon-mist/50 p-4">
        <legend className="float-left mb-1 w-full font-serif text-lg text-maroon-deep">
          Make it fun <span className="font-sans text-sm text-ink/60">(optional)</span>
        </legend>

        <div className="clear-left">
          <label htmlFor={`${id}-feeling`} className="mb-2 block text-sm font-medium text-ink/70">
            <span className="sr-only">How are you feeling? </span>We&apos;ll be reading these. Best one gets a free 6 pack 🍻
          </label>
          <div className="relative">
            <input
              id={`${id}-feeling`}
              value={feeling}
              onChange={(event) => onFeelingChange(event.target.value)}
              maxLength={40}
              placeholder="Ecstatically"
              autoComplete="off"
              autoCapitalize="sentences"
              enterKeyHint="done"
              aria-invalid={Boolean(feelingError)}
              className={`${fieldClass} pr-14 text-maroon-deep`}
            />
            <button
              type="button"
              onClick={shuffle}
              aria-label="Surprise me with a feeling"
              className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-xl active:scale-90"
            >
              🎲
            </button>
          </div>
          {feelingError && (
            <p role="alert" className="mt-2 text-sm text-maroon">
              {feelingError}
            </p>
          )}
          <div className={`${swipeRow} mt-2`} aria-label="Feeling ideas">
            {suggestionsFor(feeling).map((option) => {
              const selected = option === feeling;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onFeelingChange(option)}
                  aria-pressed={selected}
                  className={`min-h-8 shrink-0 snap-start rounded-full border px-3 text-[0.8125rem] whitespace-nowrap transition-colors ${
                    selected
                      ? "border-maroon bg-maroon text-ivory"
                      : "border-maroon/25 bg-white text-maroon-deep active:bg-maroon-mist"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-ink/70">Add an emoji?</p>
          <div className={swipeRow} aria-label="Emoji">
            {emojis.map((option) => {
              const selected = option === emoji;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onEmojiChange(selected ? "" : option)}
                  aria-pressed={selected}
                  aria-label={option}
                  className={`flex size-11 shrink-0 snap-start items-center justify-center rounded-full text-2xl transition-transform active:scale-90 ${
                    selected ? "bg-white ring-2 ring-maroon" : ""
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {attending && (
          <div>
            <label htmlFor={`${id}-reply`} className="mb-2 block text-sm font-medium text-ink/70">
              Say it your way
            </label>
            <div className="relative">
              <select
                id={`${id}-reply`}
                value={reply}
                onChange={(event) => onReplyChange(event.target.value)}
                className={`${fieldClass} appearance-none pr-10 text-maroon-deep`}
              >
                <option value="">{replyFor(attending, "")}</option>
                {repliesFor(attending).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>
        )}
      </fieldset>

      {attending && (
        <p className="font-serif text-lg text-maroon italic" aria-live="polite">
          {firstName} {lowerFirst(replyPhrase(feeling, replyFor(attending, reply), emoji))}
        </p>
      )}
    </div>
  );
}
