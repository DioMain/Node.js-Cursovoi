import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton'

function GameElement({ game: { name } }) {
  return (
    <Stack direction={"row"}
      style={{
        padding: "6px",
        backgroundColor: "gainsboro",
        borderRadius: "6px"
      }}>

      <div>{name}</div>

      <IconButton>
        <EditIcon sx={{ color: "black" }} />
      </IconButton>

    </Stack>
  )
}

export default GameElement;