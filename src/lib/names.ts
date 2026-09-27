export function firstNames(names: string[]) {
  return names.map((name) => name.split(/\s+/)[0]).join(" & ");
}
