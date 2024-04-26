import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'

import "./../../css/RegDialog.css";
import Button from '@mui/material/Button'


function RegisterDialog({ open, onCloseClick }) {

  let [regError, setRegError] = React.useState("");
  let [userRoleRadio, setUserRoleRadio] = React.useState("USER");
  let [userEmail, setUserEmail] = React.useState("");

  const register = () => {

    let register_email = document.getElementById("register_email");
    let register_nickname = document.getElementById("register_nickname");
    let register_password = document.getElementById("register_password");
    let register_confirm_password = document.getElementById("register_confirm_password");

    if (register_password.value !== register_confirm_password.value) {
      setRegError("Пароли не совпадают!");
      return;
    }
    if (register_password.value.length < 6) {
      setRegError("Не правильный формат пароля!");
      return;
    }

    let emailReg = /^((\w|\.)+)@((\w)+\.)((\w|\.)+)\w$/gm;
    if (!emailReg.test(register_email.value)) {
      setRegError("Не правильный формат почты!");
      return;
    }

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: register_email.value, nickname: register_nickname.value,
        password: register_password.value, role: userRoleRadio
      })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.success) {
          window.location.reload();
        }
        else {
          setRegError(data.error);
        }
      })
      .catch(err => console.log(err));
  };

  const radioGroupChangeHandler = (evt) => {
    setUserRoleRadio(evt.target.value);
  }

  const emailTextChangeHandle = (evt) => {
    setUserEmail(evt.target.value);
  }

  return (
    <Dialog
      className='register-dialog'
      maxWidth="1500px"
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
            Регистрация
          </h1>
        </div>
        <div className='content'>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className='flex-button-row'>
                <TextField
                  id="register_email"
                  label="Почта"
                  className='CTextField'
                  onChange={emailTextChangeHandle}
                />
                <TextField
                  id="register_nickname"
                  label="Никнейм"
                  className='CTextField'
                />
              </div>
              <div className='flex-button-row' style={{marginTop: "15px"}}>
                <TextField
                  id="register_password"
                  label="Пароль"
                  className='CTextField'
                  type='password'
                />
                <TextField
                  id="register_confirm_password"
                  label="Подтвердить пароль"
                  className='CTextField'
                  type='password'
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
              <h4 style={{ marginLeft: "10px" }}>Роль</h4>
              <RadioGroup defaultValue="USER" id='register_radio_group'
                onChange={radioGroupChangeHandler}>
                <label>
                  <Radio className='CRadio' value="USER"></Radio>
                  Пользователь
                </label>
                <label>
                  <Radio className='CRadio' value="DEVELOPER"></Radio>
                  Разработчик
                </label>
                {
                  userEmail.startsWith("ADMIN") && (
                    <label>
                      <Radio className='CRadio' value="ADMIN"></Radio>
                      Администратор
                    </label>
                  )
                }

              </RadioGroup>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: "end", marginTop: "40px" }}>
            <Button type="button" variant="contained" color="primary" className='CButton0' onClick={register}>
              Подтвердить
            </Button>
          </div>
          <h3 className='error-field'>{regError}</h3>
        </div>
      </div>
    </Dialog>
  )
}

export default RegisterDialog;