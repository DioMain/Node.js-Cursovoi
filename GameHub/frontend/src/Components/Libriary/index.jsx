import "./../../css/Libriary.css"

import { Button, Grid, Stack, Rating } from "@mui/material";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import DonwloadIcon from "@mui/icons-material/Download";

let init = false;

function LibItem({ text, imgSrc, onClick = null }) {
  return (
    <Button className="CButton1" onClick={onClick} style={{ padding: "6px", paddingLeft: "12px" }}
      startIcon={<img src={imgSrc} style={{ objectFit: "cover", width: "30px", height: "30px", borderRadius: "4px" }}></img>}>
      {text}
    </Button>
  )
}

function Libriary() {

  let user = useSelector(state => state.user);

  let [games, setGames] = useState([]);
  let [game, setGame] = useState(undefined);

  const openGame = useCallback((id) => {
    setGame(games.find(item => item.id == id));
  });

  const openGamePage = useCallback(() => {
    window.location.assign(`/game/${game.id}`);
  });

  const downloadGame = useCallback(() => {
    window.location.assign(`/api/downloadgame?id=${game.id}`);
  });

  if (!user.init)
    return (<></>);

  if (user.init && !user.auth)
    window.location.replace("/");

  if (user.init && user.auth && user.data.role !== "USER")
    window.location.replace("/");

  if (!init) {
    fetch(`/api/libriary/getusergames?id=${user.data.id}`)
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          console.log(data);
          setGames(data.games);

          init = true;
        }
      });
  }

  if (games.length == 0)
    return (<h2 style={{ textAlign: "center" }}>Библиотека пуста</h2>);

  return (
    <Stack className="Libriary-container" direction={"row"} spacing={2}>
      <Stack className="Libriary-gamelist" spacing={1}>
        {
          games.map(item => {
            return (<LibItem text={item.name} imgSrc={item.iconImageUrl} onClick={() => openGame(item.id)} />)
          })
        }
      </Stack>
      {
        game ?
          <Stack className="Libriary-game" spacing={1}>
            <Stack className='Libriary-game-title' direction={"row"}>
              <img src={game.libImageUrl} />
              <div className='Libriary-game-title-text'>
                <h1>{game.name}</h1>
              </div>
            </Stack>

            <Stack className="Libriary-game-panel" direction={"row"} spacing={2}>
              <Button className="CButton0" onClick={downloadGame} startIcon={<DonwloadIcon />}>Скачать</Button>
              <Button className="CButton0" onClick={openGamePage}>Страница игры</Button>
            </Stack>
          </Stack>
          :
          <h1 style={{ textAlign: "center" }}>Игра не выбрана</h1>
      }
    </Stack>
  )
}

export default Libriary;