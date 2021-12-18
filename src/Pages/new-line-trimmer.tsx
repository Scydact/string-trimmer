import { Backspace, ContentCopy, ContentCut, ContentPaste,  Redo, Undo, FilterNone, Filter2 } from "@mui/icons-material";
import { Box, Button, ButtonGroup, ButtonProps, Container, Grid, TextField, Tooltip, useMediaQuery } from "@mui/material";
import { useDebounce } from "@react-hook/debounce";
import React, { useCallback, useEffect, useState } from "react";
import useUndo from "use-undo";

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 



Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 

Excepteur sint occaecat cupidatat non proident, 

sunt in culpa qui officia deserunt mollit anim id est laborum.
`

type ThisAction = {
  name: React.ReactNode,
  description: React.ReactNode,
  fn: Function,
  props: ButtonProps,
}

const actions: ThisAction[] = [
  {
    name: 'Trim all',
    description: 'Trim all spaces, leaving only single new lines.',
    fn: function (t: string) { return t.replaceAll(/(\r?\n){2,}/g, '\n') },
    props: {
      startIcon: (<FilterNone />)
    },
  },
  {
    name: 'Trim doubles',
    description: 'Trim double spaces, fixing formatting on Office text.',
    fn: function (t: string) { return t.replaceAll(/(\r?\n){2}/g, '\n') },
    props: {
      startIcon: (<Filter2 />)
    },
  },
  {
    name: 'Traditional trim',
    description: 'Simply trim each line.',
    fn: function (t: string) { return t.split('\n').map(x => x.trim()).join('\n').trim() },
    props: {
      startIcon: (<ContentCut />)
    },
  },
]

const SepBeforeFactory = (s: string, n = 80) => ({
  name: <>{s.repeat(3)}<br />txt</>,
  description: `Adds ${n} ${s.repeat(3)} before the text`,
  fn: function (t: string) { return s.repeat(n) + '\n' + t },
  props: {},
})
const SepAfterFactory = (s: string, n = 80) => ({
  name: <>txt<br />{s.repeat(3)}</>,
  description: `Adds ${n} ${s.repeat(3)} after the text`,
  fn: function (t: string) { return t + '\n' + s.repeat(n) },
  props: {},
})

const separators: ThisAction[] = [
  SepBeforeFactory('-'),
  SepBeforeFactory('='),
  SepAfterFactory('-'),
  SepAfterFactory('=',)
]

function createActionBtn(text: string, set: (s: string) => void, actions: ThisAction[]) {
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

export default function NewLineTrimmer() {
  const [text, setText] = useState(LOREM);
  const [debouncedText, setDebouncedText, setDebouncedTextNow] = useDebounce(text, 400);

  const [textState, { set, undo, redo, canUndo, canRedo }] = useUndo(text);
  const [copied, setCopied] = useState(false);

  const isSmallScreen = useMediaQuery('(max-width: 440px)');

  // On textarea change
  const onChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(evt.target.value);
    setDebouncedText(evt.target.value);
    setCopied(false);
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

  const Buttons = () => <Grid container gap={2}>
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
      {createActionBtn(text, set, actions)}
    </ButtonGroup>

    {/* Separator actions */}
    <ButtonGroup variant='contained' sx={{ flexWrap: 'wrap' }}>
      {createActionBtn(text, set, separators)}
    </ButtonGroup>
  </Grid>


  return (<Container >
    <h1>New Line Trimmer™ 3000©</h1>
    <Box>
      <Buttons />
    </Box>
    <br />
    <Box>
      <TextField
        multiline
        label='Text to trim'
        placeholder={LOREM}
        style={{ width: '100%' }}
        value={text}
        onChange={onChange} />
    </Box>
  </Container>)
}