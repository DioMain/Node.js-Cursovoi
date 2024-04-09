import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton'
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip'


function GameElement({ game }) {

  const getState = (state) => {
    switch (state) {
      case 0:
        return (<div style={{ color: "gray" }}>На расмотрении</div>)
      case 1:
        return (<div style={{ color: "green" }}>Доступна всем</div>)
      case 2:
        return (<div style={{ color: "yellow" }}>Ограниченый доспут</div>)
      case 3:
        return (<div style={{ color: "red" }}>Заблокированна</div>)
    }
  }

  const downloadGame = () => {
    window.location.assign(`/api/downloadgame?id=${game.id}`);
  }

  return (
    <Stack direction={"row"} justifyContent={"space-between"}
      style={{
        padding: "6px",
        backgroundColor: "gainsboro",
        borderRadius: "6px"
      }}>

      <Stack direction={"row"} spacing={2}>
        {/* Cart image aspect 2:1 */}
        <img style={{ width: `300px`, height: `150px`, objectFit: "cover" }} src={game.cartImageUrl} />
        <Stack justifyContent={"space-between"}>
          <Stack>
            <h2>
              {game.name}
            </h2>
            <div style={{ fontSize: "12px" }}>
              {game.tags}
            </div>
          </Stack>
          <div style={{ fontSize: "16px", fontWeight: "500" }}>
            {game.description}
          </div>
        </Stack>
      </Stack>

      <Stack direction={"row"} justifyContent={"end"}>
        <Stack direction={"column"} justifyContent="space-between">
          <Stack spacing={1} style={{ marginRight: "5px" }}>

            <Stack direction={"row"} justifyContent={"end"}>
              {
                game.priceusd === "0" ?
                  <h4>Бесплатная</h4>
                  :
                  <h3>$ {game.priceusd}</h3>
              }
            </Stack>
            
            <Stack direction={"row"} justifyContent={"end"} style={{ fontWeight: "500", fontStyle: "italic" }}>
              {getState(game.state)}
            </Stack>

          </Stack>

          <Stack direction={"row"} justifyContent={"end"}>

            <Tooltip title="Скачать игру">
              <IconButton onClick={downloadGame}>
                <DownloadIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Редактировать игру">
              <IconButton>
                <EditIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default GameElement;