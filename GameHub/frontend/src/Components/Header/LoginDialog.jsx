import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import "./../../css/LoginDialog.css";
import Button from '@mui/material/Button'

function LoginDialog({ open, onCloseClick }) {

    let [loginError, setLoginError] = React.useState("");

    const login = () => {
    
    let login_email = document.getElementById("login_email");
    let login_password = document.getElementById("login_password");

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: login_email.value, password: login_password.value
      })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.success){
          window.location.reload();
        }
        else {
          setLoginError(data.error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <Dialog
      className='login-dialog'
      maxWidth={1500}
      color='111138'
      open={open}>
      <div className='container'>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
            <IconButton onClick={onCloseClick}>
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </div>
          <h1 style={{ textAlign: "center", fontWeight: "400" }}>
            Вход
          </h1>
        </div>
        <div className='content'>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}>
              <TextField
                id="login_email"
                label="Почта"
                className='CTextField'
              />
              <TextField
                id="login_password"
                label="Пароль"
                className='CTextField'
                type='password'
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center", marginTop: "40px" }}>
            <Button type="button" variant="contained" color="primary" className='CButton0' onClick={login}>
              Подтвердить
            </Button>
          </div>
          <h3 className='error-field'>{loginError}</h3>
        </div>
      </div>
    </Dialog>
  )
}

export default LoginDialog;