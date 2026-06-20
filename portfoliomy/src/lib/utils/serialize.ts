/** Convert MongoDB lean docs (ObjectIds, Dates) to plain JSON-safe objects for Client Components. */
export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
