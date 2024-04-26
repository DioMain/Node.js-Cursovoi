import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton'
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip'
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useCallback } from 'react';
import HomeIcon from '@mui/icons-material/Home';

function GameElement({ game, onChangeGameState }) {
  const getState = (state) => {
    switch (state) {
      case 0:
        return (<div style={{ color: "white" }}>На расмотрении</div>)
      case 1:
        return (<div style={{ color: "green" }}>Доступна всем</div>)
      case 2:
        return (<div style={{ color: "#d67c15" }}>Ограниченый доспут</div>)
      case 3:
        return (<div style={{ color: "red" }}>Заблокированна</div>)
    }
  }


  const getButtons = (state) => {
    switch (state) {
      case 0:
        return (
          <Stack direction={"row"}>
            <Tooltip title="Разрешить">
              <IconButton onClick={() => setState(1)}>
                <DoneIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Заблокировать">
              <IconButton onClick={() => setState(3)} color='error'>
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      case 1:
        return (
          <Stack direction={"row"}>
            <Tooltip title="Ограничить">
              <IconButton onClick={() => setState(2)} color="warning">
                <ProductionQuantityLimitsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Заблокировать">
              <IconButton onClick={() => setState(3)} color='error'>
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      case 2:
        return (
          <Stack direction={"row"}>
            <Tooltip title="Разблокировать">
              <IconButton onClick={() => setState(1)} color='success'>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Заблокировать">
              <IconButton onClick={() => setState(3)} color='error'>
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      case 3:
        return (
          <Stack direction={"row"}>
            <Tooltip title="Разблокировать">
              <IconButton onClick={() => setState(1)} color='success'>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Удалить">
              <IconButton onClick={deleteGame} color="error">
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )
    }
  }

  const downloadGame = useCallback(() => {
    window.location.assign(`/api/downloadgame?id=${game.id}`);
  });

  const setState = useCallback((state) => {
    fetch('api/setgamestate', {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ id: game.id, state: state })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          onChangeGameState();
        }
        else if (data.error === 'jwt')
          window.location.replace('/');
      })
  });

  const deleteGame = useCallback(() => {
    fetch(`/api/deletegame?id=${game.id}`, {
      method: "DELETE"
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          onChangeGameState();
        }
        else if (data.error === 'jwt')
          window.location.replace('/');
      })
  });

  return (
    <Stack direction={"row"} justifyContent={"space-between"}
      style={{
        padding: "6px",
        backgroundColor: "gainsboro",
        borderRadius: "6px"
      }}>

      <Stack direction={"row"} spacing={2}>
        {/* Cart image aspect 2:1 */}
        <img style={{ minWidth: `300px`, minHeight: `150px`,  maxWidth: `300px`, 
                    maxHeight: `150px`, objectFit: "cover", borderRadius: "2px" }} src={game.cartImageUrl} />
        <Stack justifyContent={"space-between"}>
          <Stack>
            <h2>
              {game.name}
            </h2>
            <div style={{ fontSize: "12px" }}>
              {game.tags}
            </div>
          </Stack>
          <div style={{ maxHeight: "100px", overflow: "hidden", whiteSpace: "balance" }}>
            {game.description}
          </div>
        </Stack>
      </Stack>

      <Stack direction={"row"} justifyContent={"end"} style={{minWidth: "180px"}}>
        <Stack direction={"column"} justifyContent="space-between">
          <Stack spacing={1} style={{ marginRight: "5px" }}>

            <Stack direction={"row"} justifyContent={"end"}>
              {
                game.priceusd === "0" ?
                  <h4>Бесплатная</h4>
                  :
                  (
                    game.sale ?
                      <Tooltip title={game.sale.cause}>
                        <Stack direction={"row"} spacing={1}>
                          <h3>$ <span style={{ textDecorationLine: "line-through" }}>{game.priceusd}</span></h3>
                          <h5>$ {game.priceusd * (1 - game.sale.percent)}</h5>
                        </Stack>
                      </Tooltip>
                      :
                      <h3>$ {game.priceusd}</h3>
                  )
              }
            </Stack>

            <Stack direction={"row"} justifyContent={"end"} style={{ fontWeight: "500", fontStyle: "italic" }}>
              <div style={{ backgroundColor: "#b8b8b8", borderRadius: "4px", padding: "4px" }}>{getState(game.state)}</div>
            </Stack>

          </Stack>

          <Stack direction={"row"} justifyContent={"end"}>

            <Tooltip title="Перейти на страницу">
              <IconButton onClick={() => window.location.replace(`/game/${game.id}`)}>
                <HomeIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Скачать игру">
              <IconButton onClick={downloadGame}>
                <DownloadIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>

            <Stack direction={"row"}>
              {getButtons(game.state)}
            </Stack>

          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default GameElement;