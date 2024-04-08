import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

function CartEditor({ open, errorText = "", onClose, onSubmit }) {

  let [error, setError] = useState(errorText);

  const submit = () => {
    let cnf = document.getElementById("cart_number_field");
    let cdf = document.getElementById("cart_date_field");
    let cccvf = document.getElementById("cart_cvv2_field");

    let numberReg = /^(\w){4}-(\w){4}-(\w){4}-(\w){4}$/gm;
    let dateReg = /^(\d){2}\/(\d){2}$/gm;
    let cvvReg = /^(\w){3}$/gm;

    if (!numberReg.test(cnf.value)) {
      setError("Не верный формат номера карты!");
      return;
    }

    if (!dateReg.test(cdf.value)) {
      setError("Не верный формат срока карты!");
      return;
    }

    if (!cvvReg.test(cccvf.value)) {
      setError("Не верный формат cvv2!");
      return;
    }

    onSubmit(cnf.value, cdf.value, cccvf.value);

    setError(errorText);
  }

  return (
    <Dialog
      className='login-dialog'
      maxWidth={1000}
      color='111138'
      open={open}
    >
      <Stack direction="column" spacing={2} style={{ backgroundColor: "#111138", padding: "25px" }}>
        <Stack justifyContent={"end"} direction={"row"}>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Stack>

        <h3 style={{ color: "white", textAlign: "center", marginTop: "0" }}>Привязка карты</h3>

        <Stack direction={"row"}>
          <TextField id="cart_number_field" className='CTextField' placeholder='XXXX-XXXX-XXXX-XXXX'
            style={{ width: "300px" }}
          />
          <TextField id="cart_date_field" className='CTextField' placeholder='00/00'
            style={{ width: "80px", marginLeft: "16px" }}
          />
          <TextField id="cart_cvv2_field" className='CTextField' placeholder='CVV2'
            style={{ width: "80px", marginLeft: "16px" }}
          />
        </Stack>

        <Stack direction="row" justifyContent="end" spacing={2}>
          <Button className='CButton0' onClick={submit}>Подтвердить</Button>
        </Stack>

        <h4 style={{
          color: "red",
          textAlign: "center"
        }}>
          {error}
        </h4>
      </Stack>
    </Dialog>
  )
}

export default CartEditor