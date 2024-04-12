import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Numeritic from '../Common/Numeritic';
import TextField from '@mui/material/TextField'
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';


function DateTimeStyled({ id, onChange }) {

  return (
    <input type="datetime-local" id={id} onChange={onChange}

      style={{
        padding: "16px",
        fontFamily: "Exo2",
        fontSize: "14px",
        borderRadius: "6px",
      }}

    />
  )
}

function SaleDialog({ open, onCloseClick }) {

  let game = useSelector(state => state.game);

  let [error, setError] = useState('');

  const setSale = useCallback(() => {
    let datetime = document.getElementById("saleDateTime");
    let percent = document.getElementById("salePercent");
    let cause = document.getElementById("saleCause");

    if (datetime.value === '' || Date.parse(datetime.value) < Date.now()){
      setError("Не верная дата");
      return;
    }
    if (percent.value < 0 || percent.value > 1){
      setError("Не верный размер скидки");
      return;
    }

    fetch('/api/game/setsale', {
      method: "POST",
      headers: {
        'content-type': "application/json"
      },
      body: JSON.stringify({ gameId: game.data.id, untilto: datetime.value, cause: cause.value, percent: percent.value })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          window.location.reload();
        }
        else if (error === "jwt")
          window.location.replace('/');
      });
  });

  return (
    <Dialog open={open}>
      <Stack style={{ backgroundColor: "#1a1a59", color: "white", padding: "12px" }}>
        <Stack direction={"row"} justifyContent={"end"}>
          <IconButton onClick={onCloseClick}>
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Stack>

        <Stack spacing={2} justifyContent={"center"} style={{ padding: "16px" }}>
          <DateTimeStyled id="saleDateTime" onClick={(evt) => console.log(evt.target.value)} />
          <Stack>
            <h5>Размер скидки</h5>
            <Numeritic id="salePercent" min={0} max={1} step='0.01' />
          </Stack>
          <TextField id="saleCause" className='CTextField' label="Причина" />
          <Button className='CButton0' onClick={setSale}>Подтвердить</Button>
        </Stack>

        <h5 style={{ textAlign: "center", color: "red" }}>{error}</h5>
      </Stack>
    </Dialog>
  )
}

export default SaleDialog;