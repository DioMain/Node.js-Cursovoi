import { Dialog, Stack, IconButton, Rating, Button } from "@mui/material";
import { Textarea } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback } from "react";

let reviewText = "";
let reviewMark = 0;

function ReviewDialog({ open, closeCallback, onSubmit }) {

  const submit = useCallback(() => {
    onSubmit(reviewText, reviewMark);
  });

  return (
    <Dialog open={open} maxWidth="lg">
      <Stack className="GamePage-review-dialog">
        <Stack direction={"row"} justifyContent={"end"} className="GamePage-review-dialog-header">
          <IconButton onClick={closeCallback}>
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Stack>

        <h1 style={{ textAlign: "center" }}>Отзыв</h1>

        <Stack className="GamePage-review-dialog-container">
          <h3>Текст</h3>
          <Textarea defaultValue={reviewText} sx={{fontFamily: "Exo2", marginTop: "4px"}}
            onChange={(evt) => reviewText = evt.target.value}></Textarea>
          <Stack justifyContent={"end"} direction={"row"} style={{ marginTop: "20px" }}>
            <Rating defaultValue={reviewMark} style={{ backgroundColor: "#FFFFFF22", borderRadius: "6px", boxShadow: "0 0 10px #FFFFFF33" }} 
              precision={0.5} onChange={(evt) => reviewMark = evt.target.value}></Rating>
          </Stack>

          <Stack direction={"row"} justifyContent={"end"} style={{ marginTop: "20px" }}>
            <Button className="CButton0" onClick={submit}>Отправить отзыв</Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default ReviewDialog;