import { ContentCopy, ContentPaste } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";

export default function NewLineTrimmer() {
  
  const [og, setOg] = useState('');
  const [n, setN] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setN(og.replaceAll(/(\r?\n){2,}/g, '\n'));
    setCopied(false);
  }, [og])


  return <>
    <h1>New Line Trimmer™ 3000©</h1>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button
          startIcon={<ContentCopy />}
          onClick={() => navigator.clipboard.readText().then(t => setOg(t))}
          variant='contained'>
          Paste
        </Button>
        <textarea
          style={{ resize: 'vertical', width: '100%', minHeight: '20em' }}
          value={og}
          onChange={e => setOg(e.target.value)} />
      </Grid>

      <Grid item xs={6}>
        <Button
          startIcon={<ContentPaste />}
          onClick={() => navigator.clipboard.writeText(n).then(() => setCopied(true))}
          color={copied ? 'success' : undefined}
          variant='contained'>
          Copy
        </Button>
        <textarea
          style={{ resize: 'vertical', width: '100%', minHeight: '20em' }}
          value={n}
          onChange={() => { }} />
      </Grid>
    </Grid>
  </>
}