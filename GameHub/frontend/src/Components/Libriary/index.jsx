import "./../../css/Libriary.css"

import { Button, Grid, Stack, Rating } from "@mui/material";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

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

  if (!user.init)
    return (<></>);

  if (user.init && !user.auth)
    window.location.replace("/");

  if (user.init && user.auth && user.data.role !== "USER")
    window.location.replace("/");

  console.log(user.data);

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

  return (
    <Grid className="Libriary-container" spacing={2} container>
      <Grid xs={2.2} item style={{ minWidth: "250px" }}>
        <Stack className="Libriary-gamelist">
          {
            games.map(item => {
              return (<LibItem text={item.name} imgSrc={item.iconImageUrl} onClick={() => openGame(item.id)} />)
            })
          }
        </Stack>
      </Grid>
      <Grid item>
        {
          game ?
            <Stack className="Libriary-game">
              <Stack className='Libriary-game-title' direction={"row"}>
                <img src={game.libImageUrl} />
                <div className='Libriary-game-title-text'>
                  <h1>{game.name}</h1>
                </div>
              </Stack>

              <Stack direction={"row"}>
                <Button className="CButton0">Скачать</Button>
              </Stack>
            </Stack>
            :
            <h1 style={{ textAlign: "center" }}>Игра не выбрана</h1>
        }
      </Grid>
    </Grid>
  )
}

export default Libriary;