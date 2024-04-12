import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function Confirm({ open, onCancel, onConfirm, text }) {
  return (
    <Dialog
      className='login-dialog'
      maxWidth={1000}
      color='111138'
      open={open}
    >
      <Stack direction="column" spacing={2} style={{backgroundColor: "#111138", padding: "25px"}}>
        <h3 style={{ color: "white", textAlign: "center"}}>{text}</h3>

        <Stack direction="row" justifyContent="end" spacing={2}>
          <Button className='CButton0' onClick={onCancel}>Отменить</Button>
          <Button className='CButton0' onClick={onConfirm}>Подтвердить</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default Confirm;