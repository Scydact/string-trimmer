import { Build } from "@mui/icons-material";
import { Button, ButtonGroup } from "@mui/material"
import { useState } from "react";
import useLocalStorage from "use-local-storage";
import { createActionBtn } from "../create-action-btn"
import { createSeparatorAction, SeparatorDef, withUUID } from "./functions";
import OptsModal from "./options";

const SEPARATORS_LOCALSTORAGE_KEY = 'stringTrimmerSeparators000'
const SEPARATORS_INITIAL = [
  { at: 'start', char: '=' },
  { at: 'end', char: '=' },
  { at: 'cursor', char: '=' },
].map(x => withUUID(x as any))

type Props = {
  text: string,
  set: (s: string) => void,
}

function SeparatorActionBtns({ text, set }: Props) {
  const [open, setOpen] = useState(false)

  const [separators, setSeparators] = useLocalStorage<SeparatorDef[]>(SEPARATORS_LOCALSTORAGE_KEY, SEPARATORS_INITIAL)

  return <>
    <ButtonGroup variant='contained' sx={{ flexWrap: 'wrap' }}>
      {createActionBtn(text, set, separators.map(sep => createSeparatorAction(sep)))}
      <Button sx={{px: 0}} onClick={() => setOpen(true)}>
        <Build />
      </Button>
    </ButtonGroup>
    <OptsModal
      open={open}
      onClose={() => setOpen(false)}
      separators={separators}
      setSeparators={setSeparators} />
  </>
}

export default SeparatorActionBtns;