
import { memo, useCallback, useMemo } from "react"
import { 
  Modal, 
  ModalProps, 
  Card, 
  SxProps, 
  Chip, 
  Select, 
  Input, 
  MenuItem, 
  IconButton,
  Table as MUITable,
  Typography,
} from "@mui/material";
import { Add, Cancel, CancelOutlined, Check, Delete, DragIndicator, Edit } from "@mui/icons-material";
import { DEFAULT_LEN, SeparatorDef, SEPARATOR_AT_TYPES } from "./functions";
import {
  Grid,
  Table,
  TableEditColumn,
  TableEditRow,
  TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';
import { DataTypeProvider, EditingState, EditingStateProps, TableProps } from '@devexpress/dx-react-grid';
import { createUUID, titlecase } from "../../../hooks/utils";
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";


type Props = Omit<ModalProps, 'children'> & {
  separators: SeparatorDef[],
  setSeparators: (s: SeparatorDef[]) => any,
}

const modalStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: 'calc(100vh - 2rem)',
  overflow: 'auto',
  p: 2,
}

const getRowId = (row: SeparatorDef) => row.id

export default function OptsModal({ separators: rows, setSeparators: setRows, ...rest }: Props) {
  // Props to display, and their getters (if needed)
  const columns = useMemo(() => [
    { name: 'drag', title: ' ' },
    { name: 'char', title: 'String' },
    {
      name: 'length',
      title: 'Length',
      getCellValue: (row: SeparatorDef) => row.length || DEFAULT_LEN,
    },
    { name: 'at', title: 'Place at' },
  ], [])

  const tableColumnExtensions = useMemo((): TableProps['columnExtensions'] => [
    {
      columnName: 'drag',
      width: '2rem',
    }
  ], [])

  // Properties that can be modified.
  const editingColumnExtensions = useMemo((): EditingStateProps['columnExtensions'] => [
    {
      columnName: 'char',
      createRowChange: (row, value) => ({ char: value })
    },
    {
      columnName: 'length',
      createRowChange: (row, value) => ({ length: value })
    },
    {
      columnName: 'at',
      createRowChange: (row, value) => ({ at: value })
    },
  ], [])

  // Actually makes the changes happen
  type ESPCC = EditingStateProps['onCommitChanges']
  const commitChanges = useCallback<ESPCC>(({ added, changed, deleted }) => {
    // Added, changed, deleted all are mapped to the indexes of the rows.
    // added = newrow[]
    // changed = { [id_of_row]: changedRowVals} (sparce array??)
    // deleted = id[]
    // IMPORTANT: Must set getRowId on <Grid> for this to work properly.
    let changedRows = rows; // Default if no changes.

    if (added) {
      changedRows = [
        ...rows,
        ...added.filter(row => row.char && row.char !== '')
        .map(row => ({
          id: createUUID(),
          at: 'start',
          char: '',
          ...row,
        })),
      ]
    }

    if (changed) {
      changedRows = rows.map(row =>
        (changed[row.id]) ? { ...row, ...changed[row.id] } : row
      )
    }

    if (deleted) {
      const deletedSet = new Set(deleted)
      changedRows = rows.filter(row => !deletedSet.has(row.id))
    }

    setRows(changedRows)
  }, [rows, setRows])

  const onSortEnd = useCallback(({ oldIndex, newIndex }) =>
    setRows(arrayMove(rows, oldIndex, newIndex)), [rows, setRows])

  return <Modal {...rest}>
    <Card sx={modalStyle}>
      <Typography gutterBottom variant="h5" component="div">
        Separators
      </Typography>
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}>
        <DragTypeProvider for={['drag']} />
        <SeparatorAtTypeProvider for={['at']} />
        <EditingState
          columnExtensions={editingColumnExtensions}
          onCommitChanges={commitChanges} />
        <Table
          columnExtensions={tableColumnExtensions}
          tableComponent={({ ...rest }) => (<MUITable size="small" {...rest} />)}
          bodyComponent={({ ...rest }) => {
            const TableBody = SortableContainer(Table.TableBody)
            return <TableBody
              {...rest}
              onSortEnd={onSortEnd}
              useDragHandle
              lockAxis="y" />
          }}
          rowComponent={({ row, ...rest }) => {
            const TableRow = SortableElement(Table.Row)
            return <TableRow
              {...rest}
              row={row}
              index={rows.indexOf(row)}
              style={{ zIndex: 10000 }} //MUI Modal sets to 1300
            />
          }} />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          width={120}
          commandComponent={Command} />
      </Grid>

    </Card>
  </Modal>
}

//***********************/
//#region SORTABLE (FOR SORT SUPPORT)
//***********************/

const DragHandle = SortableHandle(({ style }: any) => (
  <DragIndicator style={{ ...style, cursor: 'move'}}/>
))

const DragTypeProvider = memo((props: any) => (
  <DataTypeProvider
    formatterComponent={DragHandle}
    editorComponent={() => (<></>)}
    {...props}
  />)
)

//#endregion 
//***********************/
//#region TYPE PROVIDER (for custom select box)
//***********************/

type SeparatorAtFormatterProps = {
  value: SeparatorDef['at']
}
function SeparatorAtFormatter({ value }: SeparatorAtFormatterProps) {
  return <Chip label={titlecase(value)} />
}

type SeparatorAtEditorProps = {
  value: SeparatorDef['at'],
  onValueChange: (s: string) => any,
}
function SeparatorAtEditor({ value, onValueChange }: SeparatorAtEditorProps) {
  return <Select
    input={<Input />}
    value={value}
    onChange={evt => onValueChange(evt.target.value)}
    style={{ width: '100%' }}>
    {SEPARATOR_AT_TYPES.map(at => <MenuItem value={at}>{titlecase(at)}</MenuItem>)}
  </Select>
}

function SeparatorAtTypeProvider(props: any) {
  return <DataTypeProvider
    formatterComponent={SeparatorAtFormatter}
    editorComponent={SeparatorAtEditor}
    {...props}
  />
}


//#endregion 
//***********************/
//#region EDIT BUTTONS
//***********************/
const cmdIcon = (icon: React.ReactChild, title: string, props?: any) =>
  ({ onExecute }: any) => (
    <IconButton 
      size="small" 
      onClick={onExecute} 
      title={title}>
      {icon}
    </IconButton>)

const commandComponents = {
  add: cmdIcon(<Add />, 'New separator'),
  edit: cmdIcon(<Edit />, 'Edit'),
  delete: cmdIcon(<Delete />, 'Delete'),
  commit: cmdIcon(<Check />, 'Save'),
  cancel: cmdIcon(<Cancel />, 'Cancel'),
}

const Command = ({ id, onExecute }: { id: string, onExecute: any }) => {
  const CommandButton = (commandComponents as any)[id]
  return <CommandButton onExecute={onExecute} />
}

//#endregion 
