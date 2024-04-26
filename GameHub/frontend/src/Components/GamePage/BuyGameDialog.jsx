import { Dialog, Stack, IconButton, Select, MenuItem, Button, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useState } from "react";


function BuyGameDialog({ open, closeCallback, onSubmit, realPrice, wallet, error = "" }) {
  let [pmtype, setPmtype] = useState(0);

  const submitBuy = useCallback(() => {
    onSubmit(pmtype);
  });

  const buyMessage = () => {
    switch (pmtype) {
      case 0:
        if (wallet < realPrice)
          return (<Alert severity="error">У вас не хватает средств</Alert>);
        break;
      case 1:
        break;
    }

    return (<Alert severity="info">С вашего способа оплаты будет снято $ {realPrice}</Alert>);
  }

  return (
    <Dialog
      open={open} maxWidth="1000px"
    >
      <Stack className="GamePage-buy-dialog">
        <Stack direction={"row"} justifyContent={"end"} className="GamePage-buy-dialog-header">
          <IconButton onClick={closeCallback}>
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Stack>

        <Stack className="GamePage-buy-dialog-container" spacing={1}>
          <h2 style={{ textAlign: "center" }}>Покупка</h2>

          <h3>Способ оплаты</h3>
          <Stack direction={"row"}>
            <Select value={pmtype} onChange={(evt) => setPmtype(evt.target.value)} className="GamePage-buy-pmselect">
              <MenuItem value={0}>Кошелёк</MenuItem>
              <MenuItem value={1}>Карта</MenuItem>
            </Select>
          </Stack>

          <>{buyMessage()}</>

          <Stack direction={"row"} justifyContent={"end"}>
            <Button className="CButton0" onClick={submitBuy}>Подтвердить</Button>
          </Stack>
        </Stack>

        <Stack style={{ color: "red", padding: "6px" }}>
          {error}
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default BuyGameDialog;