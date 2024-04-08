import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider"

import "./../../css/PME_User.css";
import TextField from '@mui/material/TextField'
import { useState } from 'react';
import CartEditor from './CartEditor';

function AddMoney({ open, onClose }) {
  const addMoney = () => {
    let tool_money_field = document.getElementById('tool_money_field');

    fetch('/api/tool/addmoney', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ money: tool_money_field.value })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          window.location.replace('/user');
        }
        else {
          if (data.error === 'jwt')
            window.location.replace('/');
        }
      });
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

        <h3 style={{ color: "white", textAlign: "center" }}>Деньги?</h3>

        <Stack direction="row" justifyContent="end" spacing={2}>
          <TextField
            id="tool_money_field"
            label="USD"
            className='CTextField'
            type="number"
          />
          <Button className='CButton0' onClick={addMoney}>Подтвердить</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

function UserPaymentMethod() {
  let [openAddMoney, setOpenAddMoney] = useState(false);
  let [openSetUserCart, setOpenSetUserCart] = useState(false);
  
  let [init, setInit] = useState(false);
  let [pmInfo, setPMInfo] = useState({ cart: undefined, walletUSD: undefined });
  let [cartEditorError, setCartEditorError] = useState("");

  const getPMInfo = () => {
    fetch('/api/getpminfo')
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          setPMInfo({ __init: true, cart: data.cart, walletUSD: data.walletUSD });
        }
        else {
          if (data.error === 'jwt')
            window.location.assign('/');
        }
      })
      .catch(err => console.log(err));
  }

  const setCart = (number, date, cvv) => {
    fetch('/api/setusercart', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ number: number, date: date, cvv: cvv })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          setCartEditorError("");
          setOpenSetUserCart(false);

          getPMInfo();
        }
        else {
          if (data.error === 'jwt')
            window.location.replace('/');
          else
            setCartEditorError(data.error);
        }
      });
  }

  const unlinkCart = () => {
    fetch('/api/unlinkusercart')
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          getPMInfo();
        }
        else {
          if (data.error === 'jwt')
            window.location.replace('/');
        }
      });
  }

  if (!init) {
    getPMInfo();

    setInit(true);
  }

  console.log(pmInfo);

  return (
    <Stack className='PME-container' direction={"column"}>
      <Stack className='PME-money' direction={"column"} justifyContent={"end"}>
        <h4>Баланс кошелька</h4>
        <h1>$ {pmInfo.walletUSD}</h1>
      </Stack>

      <Divider style={{ marginTop: "30px" }} />

      <Stack className='PME-cart' direction={"column"}>
        <h2>Привязка карты</h2>
        <Stack direction={"row"}>
          {
            pmInfo.cart === undefined ?
              <h3>Карта не привязана</h3> : <h3>Номер текущей карты: {pmInfo.cart}</h3>
          }
        </Stack>
        <Stack direction={"row"} justifyContent={"end"}>
          {
            pmInfo.cart !== undefined ?
              <Button className='CButton-Error' onClick={unlinkCart}
                style={{ marginRight: "26px", width: "150px" }}>Отвязать карту</Button>
              :
              <Button className='CButton0' onClick={() => setOpenSetUserCart(true)}>Привязать</Button>
          }
        </Stack>
      </Stack>
      
      <Divider style={{ marginTop: "30px" }} />

      <Stack className='PME-tool' direction={"column"}>
        <h3 style={{ marginBottom: "20px" }}>Отладка</h3>
        <Stack direction={"row"}>
          <Button className='CButton0' onClick={() => setOpenAddMoney(true)}>Добавить денег</Button>
        </Stack>
      </Stack>

      <AddMoney open={openAddMoney} onClose={() => setOpenAddMoney(false)} />
      <CartEditor open={openSetUserCart} errorText={cartEditorError} onClose={() => setOpenSetUserCart(false)} onSubmit={setCart} />
    </Stack>
  )
}

export default UserPaymentMethod;