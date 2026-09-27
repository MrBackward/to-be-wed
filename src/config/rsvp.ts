export const emotionGroups = [
  {
    label: "Over the moon",
    emotions: [
      "Joyfully", "Ecstatically", "Happily", "Gleefully", "Enthusiastically", "Excitedly", "Delightedly",
      "Merrily", "Cheerfully", "Jubilantly", "Elatedly", "Blissfully", "Giddily", "Exuberantly",
      "Rapturously", "Euphorically", "Eagerly", "Gladly", "Heartily", "Triumphantly", "Victoriously",
    ],
  },
  {
    label: "Soppy",
    emotions: [
      "Lovingly", "Warmly", "Tenderly", "Fondly", "Adoringly", "Sentimentally", "Tearfully", "Emotionally",
      "Proudly", "Gratefully", "Humbly", "Wholeheartedly", "Passionately", "Romantically", "Dreamily",
      "Poetically", "Wistfully",
    ],
  },
  {
    label: "Proper",
    emotions: [
      "Graciously", "Politely", "Formally", "Solemnly", "Sincerely", "Earnestly", "Respectfully",
      "Diplomatically", "Elegantly", "Regally", "Majestically", "Royally", "Grandly",
    ],
  },
  {
    label: "Cheeky",
    emotions: [
      "Cheekily", "Mischievously", "Playfully", "Sassily", "Smugly", "Flirtatiously", "Coyly", "Sneakily",
      "Stealthily", "Suspiciously", "Mysteriously", "Sarcastically", "Ironically", "Shamelessly",
      "Unapologetically",
    ],
  },
  {
    label: "Extra",
    emotions: [
      "Dramatically", "Theatrically", "Flamboyantly", "Fabulously", "Glamorously", "Boldly", "Bravely",
      "Heroically", "Valiantly", "Wildly", "Loudly", "Hysterically", "Maniacally", "Chaotically",
      "Frantically", "Breathlessly", "Ridiculously", "Absurdly",
    ],
  },
  {
    label: "Chill",
    emotions: [
      "Casually", "Nonchalantly", "Coolly", "Calmly", "Serenely", "Peacefully", "Smoothly", "Suavely",
      "Lazily", "Sleepily", "Quietly", "Philosophically", "Scientifically",
    ],
  },
  {
    label: "Hungry & thirsty",
    emotions: ["Hungrily", "Thirstily", "Greedily", "Impatiently", "Tipsily"],
  },
  {
    label: "Nervous",
    emotions: ["Nervously", "Anxiously", "Shyly", "Bashfully", "Awkwardly", "Sheepishly"],
  },
  {
    label: "Grumpy",
    emotions: ["Reluctantly", "Begrudgingly", "Grudgingly", "Grumpily", "Sulkily", "Moodily"],
  },
  {
    label: "Heartbroken",
    emotions: [
      "Sadly", "Regretfully", "Sorrowfully", "Mournfully", "Glumly", "Dejectedly", "Heartbrokenly",
      "Apologetically", "Remorsefully", "Tragically", "Woefully", "Melancholically", "Wretchedly",
    ],
  },
];

export const emotions = emotionGroups.flatMap((group) => group.emotions);

export const acceptReplies = [
  "RSVPs yes",
  "says yes",
  "will be there",
  "will attend",
  "is coming",
  "is in",
  "confirms",
  "accepts with bells on",
  "wouldn't miss it",
  "is already dressed",
  "shall attend",
];

export const declineReplies = [
  "sends regrets",
  "must decline",
  "can't make it",
  "will miss it",
  "bows out",
  "passes",
  "says no",
  "won't be there",
  "will be there in spirit",
  "sits this one out",
  "regrets to inform you",
];

export const emojis = [
  "🥳", "😍", "🥹", "🤩", "💃", "🕺", "🥂", "🍾", "💍", "❤️", "🔥", "😎",
  "🤪", "🙃", "😏", "😬", "🫣", "🤓", "😴", "🍰", "😢", "😭", "💔", "🫠",
];

export function randomEmotion() {
  return emotions[Math.floor(Math.random() * emotions.length)];
}
