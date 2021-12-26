

export function createUUID() {
  return crypto.randomUUID()
}

export function titlecase(t: string) {
  return t[0].toUpperCase() + t.slice(1);
}