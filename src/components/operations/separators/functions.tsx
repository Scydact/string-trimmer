import { createUUID } from "../../../hooks/utils";

export const SEPARATOR_AT_TYPES = [
  'start', 
  'end', 
  'cursor'
] as const

export type SeparatorDef = {
  at: typeof SEPARATOR_AT_TYPES[number],
  char: string,
  length?: number,
  id: string,
}

export const DEFAULT_LEN = 80;

export function createSeparator({ char, length: l = DEFAULT_LEN }: SeparatorDef) {
  let reps = Math.ceil(l / char.length)
  if (!isFinite(reps) || reps < 0) reps = 1
  const s = char.repeat(reps).slice(0, l)
  return s
}

function createSeparatorFuntion(sep: SeparatorDef): (t: string, p: number) => string {
  const o = createSeparator(sep)
  switch (sep.at) {
    case 'start': return function (t: string) { return o + '\n' + t }
    case 'end': return function (t: string) { return t + '\n' + o }
    case 'cursor': return function (t: string, p: number) {
      console.log(`cursor at ${p}`)
      return t
    }
    default: return function (t) { return t }
  }
}

function getSeparatorDescription({ at, char, length = DEFAULT_LEN }: SeparatorDef) {
  switch (at) {
    case 'start': return `Adds ${length} ${char} before the text`
    case 'end': return `Adds ${length} ${char} after the text`
    case 'cursor': return `Adds ${length} ${char} at the cursor`
    default: return ''
  }
}

function getSeparatorTitle(sep: SeparatorDef) {
  const o = createSeparator({ ...sep, length: 3 })
  switch (sep.at) {
    case 'start': return <div>
      <div>{o}</div>
      <div>txt</div>
    </div>
    case 'end': return <div>
      <div>txt</div>
      <div>{o}</div>
    </div>
    case 'cursor':
    default: return o
  }
}

export function createSeparatorAction(sep: SeparatorDef) {
  return {
    name: getSeparatorTitle(sep),
    description: getSeparatorDescription(sep),
    fn: createSeparatorFuntion(sep),
    props: {},
  }
}


declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

export function withUUID<T>(sep: T): T & { id: string } {
  return {
    ...sep,
    id: createUUID()
  };
}