import { z } from "zod";

export const rsvpSchema = z.object({
  members: z.array(
    z
      .object({
        row: z.number().int().positive(),
        attending: z.enum(["", "yes", "no"]).refine((value) => value !== "", "Please let us know"),
        bringingPlusOne: z.boolean(),
        plusOneName: z.string().trim().max(100),
      })
      .refine((member) => member.attending !== "yes" || !member.bringingPlusOne || member.plusOneName, {
        message: "Please tell us their name",
        path: ["plusOneName"],
      }),
  ),
  song: z.string().trim().max(200),
  message: z.string().trim().max(1000),
});

export type RsvpValues = z.input<typeof rsvpSchema>;
