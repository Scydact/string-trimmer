import React, { useCallback, useEffect, useRef, useState } from "react";
import useUndo from "use-undo";
import { useDebounce } from "@react-hook/debounce";

import { Backspace, ContentCopy, ContentPaste,  Redo, Undo} from "@mui/icons-material";
import { Box, Button, ButtonGroup, Container, Grid, TextField, Tooltip, useMediaQuery } from "@mui/material";

import { createActionBtn } from "./operations/create-action-btn";
import SeparatorActionBtns from "./operations/separators/btns";
import trimActions from "./operations/trim";

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 



Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 

Excepteur sint occaecat cupidatat non proident, 

sunt in culpa qui officia deserunt mollit anim id est laborum.
`

export default function NewLineTrimmer() {
  const [text, setText] = useState(LOREM);
  const [debouncedText, setDebouncedText, setDebouncedTextNow] = useDebounce(text, 400);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [textState, { set, undo, redo, canUndo, canRedo }] = useUndo(text);
  const [copied, setCopied] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 440px)');
  
  // On textarea change
  const onChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(evt.target.value);
    setDebouncedText(evt.target.value);
    setCopied(false);
  }, [])

  const getCursorPosition = useCallback(() => {
    if (!textareaRef.current) return 0
    const ta = textareaRef.current
    const p = ta.selectionStart
    // Set the cursor back to where it was.
    ta.focus()
    // must defer to after the change was applied
    setTimeout(() => {
      ta.selectionEnd = p
    }, 0) 
    return p
  }, [])


  // Changes from user input
  useEffect(() => {
    if (debouncedText !== textState.present) {
      set(debouncedText);
    }
  }, [debouncedText]);

  // Changes using undo/redo history, or from custom action (using set())
  useEffect(() => {
    setText(textState.present);
    setDebouncedTextNow(textState.present);
    setCopied(false);
  }, [textState.present]);

  const Buttons = () => <Grid container gap={2} my={3}>
    {/* Undo/Redo */}
    <ButtonGroup variant='contained'>
      <Tooltip title='Undo'><Button onClick={undo} disabled={!canUndo}><Undo /></Button></Tooltip>
      <Tooltip title='Redo'><Button onClick={redo} disabled={!canRedo}><Redo /></Button></Tooltip>
    </ButtonGroup>

    {/* Delete/Paste/Copy/Cut */}
    <ButtonGroup variant='contained'>

      <Tooltip title='Delete'>
        <Button
          onClick={() => set('')}>
          <Backspace />
        </Button>
      </Tooltip>

      <Tooltip title='Paste'>
        <Button
          onClick={() => { navigator.clipboard.readText().then(t => set(t)); }}>
          < ContentPaste />
        </Button>
      </Tooltip>

      <Tooltip title='Copy'>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
          }}
          color={copied ? 'success' : undefined}>
          <ContentCopy />
        </Button>
      </Tooltip>

    </ButtonGroup>

    {/* Trim actions */}
    <ButtonGroup variant='contained' orientation={isSmallScreen ? 'vertical' : 'horizontal'}>
      {createActionBtn(text, set, trimActions)}
    </ButtonGroup>

    {/* Separator actions */}
    <SeparatorActionBtns text={text} set={set} getCursor={getCursorPosition} />
  </Grid>


  return (<Container>
    <Box>
      <Buttons />
    </Box>
    <TextField
      inputRef={textareaRef}
      multiline
      label='Text to trim'
      placeholder={LOREM}
      style={{ width: '100%' }}
      maxRows={25}
      value={text}
      onChange={onChange} />
  </Container>)
}