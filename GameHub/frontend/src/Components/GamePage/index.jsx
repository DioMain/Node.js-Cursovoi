import { useCallback, useState } from "react";
import "./../../css/GamePage.css";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MessageIcon from '@mui/icons-material/Message';

import { useSelector } from "react-redux";

import { Rating, LinearProgress, Stack, Alert, Button, Tooltip } from "@mui/material";
import ReviewDialog from "./ReviewDialog";
import BuyGameDialog from "./BuyGameDialog";
import Confirm from "./../Common/Confirm";

let init = false;
let canBuy = false;
let haveGame = false;
let realPrice = 0;

function GamePage() {
  let [game, setGame] = useState(undefined);
  let [developer, setDeveloper] = useState(undefined);
  let [reviewSocket, setReviewSocket] = useState(undefined);
  let [reviews, setReviws] = useState([]);
  let [reviewDialog, setReviewDialog] = useState(false);
  let [buyDialog, setBuyDialog] = useState(false);
  let [addLibDialog, setAddLibDialog] = useState(false);
  let [buyError, setBuyError] = useState("");

  let user = useSelector(state => state.user);

  const reviewSocketMain = useCallback(() => {
    let socket = new WebSocket(`wss://localhost:5000/game/reviews/${game.id}`);

    socket.onopen = (evt) => {
      console.log("Open!");
      setReviewSocket(socket);
    }

    socket.onmessage = (evt) => {
      let reviews = JSON.parse(evt.data);
      setReviws(reviews);
    }

    socket.onclose = (evt) => {
      console.log("Close!");
      setReviewSocket(undefined);
    }
  });

  const addReviewCallback = useCallback((text, mark) => {
    if (reviewSocket != undefined)
      reviewSocket.send(JSON.stringify({ game: game.id, User: user.data.id, text: text, mark: Number.parseFloat(mark) }));

    setReviewDialog(false);
  });

  const openReviewDialog = useCallback(() => {
    if (reviewSocket == undefined)
      reviewSocketMain();

    setReviewDialog(true);
  });

  const openBuyDialogCallback = useCallback(() => {
    if (realPrice <= 0)
      setAddLibDialog(true);
    else
      setBuyDialog(true);
  });

  const buyGame = useCallback((pmtype) => {
    fetch('/api/buygame', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ game: game.id, pmtype: pmtype })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          window.location.reload();
        }
        else {
          if (data.error === "jwt")
            window.location.replace('/');
          else
            setBuyError(data.error);
        }
      });
  });

  const buyGameFree = useCallback(() => {
    fetch('/api/buygame', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ game: game.id, pmtype: -1 })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          window.location.reload();
        }
        else {
          if (data.error === "jwt")
            window.location.replace('/');
        }
      });
  });

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
            setDeveloper(data.developer);

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

  if (game.sale)
    realPrice = game.priceusd * (1 - game.sale.percent);
  else
    realPrice = game.priceusd;

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
        <Stack direction={"row"} justifyContent={"space-between"} >
          <Stack spacing={1}>
            <h4>Теги</h4>
            <Stack direction={"row"} spacing={2}>
              {
                game.tags.split(',').map(item => {
                  return (
                    <Stack key={item} direction={"row"} style={{ backgroundColor: "gainsboro", padding: "4px", borderRadius: "6px" }}>
                      {item.trim()}
                    </Stack>
                  )
                })
              }
            </Stack>
          </Stack>

          <Stack direction={"row"} spacing={1}>
            <Tooltip title={developer.description} className="GamePage-developer">
              <Stack direction={"row"} spacing={1}>
                <img src={developer.icon} />
                <Stack spacing={1} justifyContent={"center"}>
                  <h3>{developer.name}</h3>
                </Stack>
              </Stack>
            </Tooltip>
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

                              {
                                realPrice <= 0 ?
                                  <h5>Бесплатно</h5>
                                  :
                                  <h5>$ {game.priceusd}</h5>
                              }

                              {game.sale.cause !== "" ? <p>{game.sale.cause}</p> : <></>}
                            </Stack>
                            :
                            <>
                              {
                                realPrice <= 0 ?
                                  <h3>Бесплатно</h3>
                                  :
                                  <h3>$ {game.priceusd}</h3>
                              }
                            </>
                        }
                      </Stack>

                      <Stack justifyContent={"center"}>
                        <Button onClick={openBuyDialogCallback} className="CButton0" startIcon={<ShoppingCartIcon style={{ marginLeft: "6px" }} />}>
                          {
                            realPrice <= 0 ?
                              <>Добавить в библиотеку</>
                              :
                              <>Купить для себя</>
                          }
                        </Button>
                      </Stack>
                    </Stack>
                    :
                    <Alert severity="error">Покупка не доступна</Alert>
                }
              </>
          }
        </>
      </Stack>

      <Stack className="GamePage-review" spacing={2}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          {
            reviewSocket == undefined ?
              <Button className="CButton0" onClick={reviewSocketMain}>Загрузить отзывы</Button>
              :
              <Alert severity="success">Отзывы грузяться</Alert>
          }
          {
            haveGame ?
              <Button className="CButton0" onClick={openReviewDialog}
                startIcon={<MessageIcon style={{ marginLeft: "6px" }} />}>Оставить отзыв</Button>
              :
              <Tooltip title="Что бы оставить отзыв игра должна быть в вашей библиотеке">
                <Alert severity="info">У вас нет этой игры</Alert>
              </Tooltip>
          }
        </Stack>

        {
          reviews.map(value => {
            return (
              <Stack className="GamePage-review-item" spacing={1}>
                <Stack direction={"row"} spacing={2}>
                  <img src={value.usericon}></img>
                  <h2>{value.username}</h2>
                </Stack>
                <p>{value.text}</p>
                <Stack direction={"row"} justifyContent={"end"}>
                  <Rating value={value.mark} precision={0.5} readOnly></Rating>
                </Stack>
              </Stack>
            )
          })
        }
      </Stack>

      <ReviewDialog open={reviewDialog} closeCallback={() => setReviewDialog(false)} onSubmit={addReviewCallback} />

      {
        user.auth ?
        <BuyGameDialog realPrice={realPrice} open={buyDialog} error={buyError} wallet={user.data.walletusd}
            closeCallback={() => setBuyDialog(false)} onSubmit={buyGame} />
        :
        <></>
      }
      <Confirm open={addLibDialog} onCancel={() => setAddLibDialog(false)} onConfirm={buyGameFree}
        text={"Добавить игру в библиотеку?"} />
    </Stack>
  )
}

export default GamePage;