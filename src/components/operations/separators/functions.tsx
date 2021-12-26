import { createUUID } from "../../../hooks/utils";
import { StringAction } from "../create-action-btn";

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

function createSeparatorFuntion(sep: SeparatorDef, getCursor: () => number): (t: string) => string {
  const o = createSeparator(sep)
  switch (sep.at) {
    case 'start': return function (t: string) { return o + '\n' + t }
    case 'end': return function (t: string) { return t + '\n' + o }
    case 'cursor': return function (t: string) {
      const p = getCursor()

      const before = t[p-1]
      const current = t[p]

      // case: this is at the start of the text
      if (before === undefined)
        return t.slice(0, p) + o + '\n' + t.slice(p)

      // case: this is at the end of the file
      if (current === undefined)
        return t.slice(0, p) + '\n' + o + t.slice(p)

      // case: this is a new line
      if (before === '\n' && current === '\n')
        return t.slice(0, p) + o + t.slice(p)

      // case: this is at the end of a line
      if (before !== '\n' && current === '\n')
        return t.slice(0, p) + '\n' + o + t.slice(p)

      return t.slice(0, p) + '\n' + o + '\n' + t.slice(p)
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
      <div>TXT</div>
    </div>
    case 'end': return <div>
      <div>TXT</div>
      <div>{o}</div>
    </div>
    case 'cursor':
    default: return o
  }
}

export function createSeparatorAction(sep: SeparatorDef, getCursor: () => number) {
  return {
    name: getSeparatorTitle(sep),
    description: getSeparatorDescription(sep),
    fn: createSeparatorFuntion(sep, getCursor),
    props: {
      style: {
        textTransform: "none",
      }
    },
  } as StringAction
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