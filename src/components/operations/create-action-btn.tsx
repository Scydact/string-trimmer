import { Button, ButtonProps, Tooltip } from "@mui/material"

export type StringAction = {
  name: React.ReactNode,
  description: React.ReactNode,
  fn: Function,
  props: ButtonProps,
}

/** Creates a button that allows text edition. */
export function createActionBtn(text: string, set: (s: string) => void, actions: StringAction[]) {
  return actions.map((x, i) => <Tooltip key={i} title={x.description || ''}>
    <Button
      onClick={() => set(x.fn(text))}
      disabled={(text === x.fn(text))}
      {...x.props}>
      {x.name}
    </Button>
  </Tooltip>
  )
}