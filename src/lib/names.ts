export function firstNames(names: string[]) {
  return names.map((name) => name.split(/\s+/)[0]).join(" & ");
}

export function lowerFirst(text: string) {
  return /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

export function replyPhrase(feeling: string, reply: string, emoji: string) {
  return [feeling.trim(), reply, emoji].filter(Boolean).join(" ");
}
