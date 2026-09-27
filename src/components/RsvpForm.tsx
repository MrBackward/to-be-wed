"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitRsvp } from "@/app/i/[token]/actions";
import { Choice } from "@/components/Choice";
import { ReplyPicker } from "@/components/ReplyPicker";
import { rsvpSchema, type RsvpValues } from "@/lib/schema";

export type Member = { row: number; name: string; plusOneAllowed: boolean; feeling: string };

const inputClass =
  "block w-full rounded-md border border-maroon/30 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-maroon focus:ring-2 focus:ring-gold/60 focus:outline-none";

function DietaryInput({
  id,
  label,
  labelClass = "font-medium",
  value,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  labelClass?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={`mb-1 block text-maroon-deep ${labelClass}`}>
        {label}
      </label>
      <p className="mb-2 text-sm text-ink/60">Optional. Allergies, intolerances or preferences.</p>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        maxLength={200}
        placeholder="e.g. vegetarian, coeliac, nut allergy"
        autoComplete="off"
        autoCapitalize="sentences"
        enterKeyHint="next"
        className={inputClass}
      />
    </div>
  );
}

function errorText(errors: unknown[]) {
  const [first] = errors;
  if (!first) return undefined;
  return typeof first === "string" ? first : (first as { message?: string }).message;
}

export function RsvpForm({ token, members }: { token: string; members: Member[] }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const solo = members.length === 1;

  const form = useForm({
    defaultValues: {
      members: members.map((member) => ({
        row: member.row,
        attending: "",
        feeling: member.feeling,
        emoji: "",
        reply: "",
        dietary: "",
        bringingPlusOne: false,
        plusOneName: "",
        plusOneDietary: "",
      })),
      song: "",
      message: "",
    } as RsvpValues,
    validators: { onSubmit: rsvpSchema },
    onSubmit: async ({ value }) => {
      setServerError(undefined);
      const result = await submitRsvp(token, value);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      startRefresh(() => router.refresh());
    },
  });

  return (
    <form
      noValidate
      className="mt-8 space-y-8 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      {members.map((member, index) => (
        <div key={member.row} className="space-y-4">
          <form.Field name={`members[${index}].attending`}>
            {(attendingField) => (
              <form.Field name={`members[${index}].feeling`}>
                {(feelingField) => (
                  <form.Field name={`members[${index}].emoji`}>
                    {(emojiField) => (
                      <form.Field name={`members[${index}].reply`}>
                        {(replyField) => (
                          <ReplyPicker
                            id={`member-${index}`}
                            legend={solo ? "Will you be joining us?" : member.name}
                            firstName={member.name.split(/\s+/)[0]}
                            attending={attendingField.state.value}
                            feeling={feelingField.state.value}
                            emoji={emojiField.state.value}
                            reply={replyField.state.value}
                            onAttendingChange={(value) => {
                              attendingField.handleChange(value as "yes" | "no");
                              replyField.handleChange("");
                            }}
                            onFeelingChange={feelingField.handleChange}
                            onEmojiChange={emojiField.handleChange}
                            onReplyChange={replyField.handleChange}
                            onBlur={attendingField.handleBlur}
                            attendingError={errorText(attendingField.state.meta.errors)}
                            feelingError={errorText(feelingField.state.meta.errors)}
                          />
                        )}
                      </form.Field>
                    )}
                  </form.Field>
                )}
              </form.Field>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.values.members[index].attending === "yes"}>
            {(attending) =>
              attending && (
                <form.Field name={`members[${index}].dietary`}>
                  {(field) => (
                    <DietaryInput
                      id={field.name}
                      label={solo ? "Any dietary requirements?" : `Dietary requirements for ${member.name.split(/\s+/)[0]}`}
                      labelClass="font-serif text-xl"
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                    />
                  )}
                </form.Field>
              )
            }
          </form.Subscribe>

          {member.plusOneAllowed && (
            <form.Subscribe selector={(state) => state.values.members[index].attending === "yes"}>
              {(attending) =>
                attending && (
                  <div className="space-y-4 rounded-md bg-maroon-mist/60 p-4">
                    <form.Field name={`members[${index}].bringingPlusOne`}>
                      {(field) => (
                        <Choice
                          name={field.name}
                          legend="Bringing a +1?"
                          options={[
                            { value: "no", label: "Just me" },
                            { value: "yes", label: "Bringing a +1" },
                          ]}
                          value={field.state.value ? "yes" : "no"}
                          onChange={(value) => field.handleChange(value === "yes")}
                        />
                      )}
                    </form.Field>
                    <form.Subscribe selector={(state) => state.values.members[index].bringingPlusOne}>
                      {(bringing) =>
                        bringing && (
                          <form.Field name={`members[${index}].plusOneName`}>
                            {(field) => {
                              const error = errorText(field.state.meta.errors);
                              return (
                                <div>
                                  <label htmlFor={field.name} className="mb-2 block font-medium text-maroon-deep">
                                    Their name
                                  </label>
                                  <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    onBlur={field.handleBlur}
                                    autoComplete="off"
                                    autoCapitalize="words"
                                    enterKeyHint="next"
                                    aria-invalid={Boolean(error)}
                                    className={inputClass}
                                  />
                                  {error && (
                                    <p role="alert" className="mt-2 text-sm text-maroon">
                                      {error}
                                    </p>
                                  )}
                                </div>
                              );
                            }}
                          </form.Field>
                        )
                      }
                    </form.Subscribe>
                    <form.Subscribe selector={(state) => state.values.members[index].bringingPlusOne}>
                      {(bringing) =>
                        bringing && (
                          <form.Field name={`members[${index}].plusOneDietary`}>
                            {(field) => (
                              <DietaryInput
                                id={field.name}
                                label="Their dietary requirements"
                                value={field.state.value}
                                onChange={field.handleChange}
                                onBlur={field.handleBlur}
                              />
                            )}
                          </form.Field>
                        )
                      }
                    </form.Subscribe>
                  </div>
                )
              }
            </form.Subscribe>
          )}
        </div>
      ))}

      <form.Field name="song">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="mb-1 block font-serif text-xl text-maroon-deep">
              Song request
            </label>
            <p className="mb-2 text-sm text-ink/60">What will get you on the dance floor?</p>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              placeholder="Song and artist"
              autoComplete="off"
              enterKeyHint="next"
              className={inputClass}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="message">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="mb-1 block font-serif text-xl text-maroon-deep">
              A note for us
            </label>
            <p className="mb-2 text-sm text-ink/60">Optional, but we&apos;d love to hear from you.</p>
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              rows={4}
              className={inputClass}
            />
          </div>
        )}
      </form.Field>

      <div className="space-y-3">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <button
              type="submit"
              disabled={isSubmitting || refreshing}
              className="flex min-h-12 w-full items-center justify-center rounded-md bg-maroon px-6 py-3 text-base font-medium tracking-wide text-ivory shadow-sm transition-colors hover:bg-maroon-deep focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99] disabled:opacity-70"
            >
              {isSubmitting || refreshing ? "Sending..." : "Send RSVP"}
            </button>
          )}
        </form.Subscribe>
        <form.Subscribe selector={(state) => state.submissionAttempts > 0 && !state.isValid}>
          {(invalid) =>
            (invalid || serverError) && (
              <p role="alert" className="rounded-md bg-maroon-mist px-4 py-3 text-sm text-maroon-deep">
                {invalid ? "Some answers need your attention. Please check the ones marked above." : serverError}
              </p>
            )
          }
        </form.Subscribe>
        <p className="text-center text-xs text-ink/60">You can only send this once, so please check your answers.</p>
      </div>
    </form>
  );
}
