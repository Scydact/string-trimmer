import { ContentCut, Filter2, Filter5, FilterNone } from "@mui/icons-material"
import { StringAction } from "../create-action-btn"

const actions: StringAction[] = [
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
    name: 'Trim max 5',
    description: 'Trim 5 consecutive new lines.',
    fn: function (t: string) { return t.replaceAll(/(\r?\n){5,}/g, '\n'.repeat(5)) },
    props: {
      startIcon: (<Filter5 />)
    },
  },
  {
    name: 'Traditional trim',
    description: 'Simply trim each line, removing start & end spaces.',
    fn: function (t: string) { return t.split('\n').map(x => x.trim()).join('\n').trim() },
    props: {
      startIcon: (<ContentCut />)
    },
  },
]

export default actions;