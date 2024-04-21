import { useState } from "react";
import "./../../css/GamePage.css";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MessageIcon from '@mui/icons-material/Message';

import { useSelector } from "react-redux";

import { Rating, LinearProgress, Stack, Alert, Button, Tooltip } from "@mui/material";

let init = false;
let canBuy = false;
let haveGame = false;

function GamePage() {
  let [game, setGame] = useState(undefined);

  let user = useSelector(state => state.user);

  if (!user.init)
    return (<LinearProgress></LinearProgress>);

  if (!init) {
    let gameid = window.location.pathname.split('/')[2];

    if (gameid) {
      fetch(`/api/getgameinfo?id=${gameid}`)
        .then(raw => raw.json())
        .then(data => {
          if (data.ok) {
            setGame(data.game);
            init = true;
          }
        });
    }
    else init = true;

    return (<Alert severity="warning">Игра не найдена</Alert>);
  }

  if (!(game.state == 1 || game.state == 2))
    return (<Alert severity="error">Страница игры не доступна!</Alert>);

  if (user.auth) {
    haveGame = user.data.games.some(item => item == game.id);
    canBuy = game.state == 1 && user.data.role === "USER" && !haveGame;
  }

  console.log(game);
  console.log(user);

  return (
    <Stack className="GamePage-container" spacing={2}>
      <Stack className='GamePage-title' direction={"row"}>
        <img src={game.libImageUrl} />
        <div className='GamePage-title-text'>
          <h1>{game.name}</h1>
        </div>
        <div className="GamePage-title-mark">
          {
            game.middleMark == -1 ?
              <h5>Игра не имеет оценки</h5>
              :
              <Rating value={game.middleMark} precision={0.5} readOnly></Rating>
          }
        </div>
      </Stack>

      <Stack className="GamePage-main" spacing={2}>
        <Stack spacing={1}>
          <h4>Теги</h4>
          <Stack direction={"row"} spacing={2}>
            {
              game.tags.split(',').map(item => {
                return (
                  <Stack direction={"row"} style={{ backgroundColor: "gainsboro", padding: "4px", borderRadius: "6px" }}>
                    {item.trim()}
                  </Stack>
                )
              })
            }
          </Stack>
        </Stack>

        <p className="GamePage-main-description">{game.description}</p>

        <>
          {
            haveGame ?
              <Alert severity="success">Игра уже есть в вашей библиотеке</Alert>
              :
              <>
                {
                  canBuy ?
                    <Stack className="GamePage-main-buy" direction={"row"} justifyContent={"space-between"}>
                      <Stack justifyContent={"center"}>
                        {

                          game.sale ?
                            <Stack direction={"row"} spacing={1}>
                              <h3>$ <span style={{ textDecorationLine: "line-through" }}>{game.priceusd}</span></h3>
                              <h5>$ {game.priceusd * (1 - game.sale.percent)}</h5>

                              {game.sale.cause !== "" ? <p>{game.sale.cause}</p> : <></>}
                            </Stack>
                            :
                            <h3>$ {game.priceusd}</h3>
                        }
                      </Stack>

                      <Stack justifyContent={"center"}>
                        <Button className="CButton0" startIcon={<ShoppingCartIcon style={{ marginLeft: "6px" }} />}>Купить для себя</Button>
                      </Stack>
                    </Stack>
                    :
                    <Alert severity="error">Покупка не доступна</Alert>
                }
              </>
          }
        </>
      </Stack>

      <Stack className="GamePage-review">
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Button className="CButton0">Загрузить отзывы</Button>
            {
              haveGame ?
                <Button className="CButton0" startIcon={<MessageIcon style={{ marginLeft: "6px" }} />}>Оставить отзыв</Button>
                :
                <Tooltip title="Что бы оставить отзыв игра должна быть в вашей библиотеке">
                  <Alert severity="info">У вас нет это игры</Alert>
                </Tooltip>
            }
          </Stack>
      </Stack>
    </Stack>
  )
}

export default GamePage;