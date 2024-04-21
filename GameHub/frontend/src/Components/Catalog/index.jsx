import "./../../css/Catalog.css"

import Stack from "@mui/material/Stack"
import Pagination from "@mui/material/Pagination"
import Drawer from '@mui/material/Drawer'
import { useCallback, useState } from "react"
import Button from '@mui/material/Button'
import FilterDrawer from "./FilterDrawer"
import GameElement from "./GameElement"
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { LinearProgress } from "@mui/material"

let page = 1;
let namePattern = "";
let filters = [];
let init = false;

function Catalog() {

  let [filterTabOpen, setFilterTabOpen] = useState(false);
  let [games, setGames] = useState([]);
  let [pagesCount, setPagesCount] = useState(0);
  let [isLoaded, setIsLoaded] = useState(false);

  const closeCallback = useCallback(() => setFilterTabOpen(false));

  const getGames = useCallback(() => {
    setIsLoaded(false);

    fetch('/api/catalog/getgames', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        namePattern: namePattern,
        page: page,
        filters: filters
      })
    })
    .then(raw => raw.json())
    .then(data => {
      if (data.ok){
        page = 1;

        setIsLoaded(true);

        setPagesCount(data.pages);
        setGames(data.games);
      }
    });
  });

  const filterSubmitCallback = useCallback((newfilters) => {
    filters = newfilters;

    getGames();
  });

  const gameClickCallback = useCallback((game) => {
    window.location.replace(`/game/${game.id}`);
  });

  const paginationChangeCallback = useCallback((evt, newpage) => {
    page = newpage;
    getGames();
  });

  if (!init){
    getGames();
    init = true;
  }

  return (
    <Stack className="catalog-container" spacing={2}>
      <Stack className='catalog-toolpanel' direction={"row"} justifyContent={"space-between"}>
        <Button onClick={() => setFilterTabOpen(true)} className='CButton0' startIcon={<FilterAltIcon fontSize="large" sx={{ color: "white" }} />}>Фильтры</Button>

        <Stack direction={"row"} spacing={2}>
          <TextField label='Поиск по названию' className='CTextField' onChange={(evt) => namePattern = evt.target.value} />
          <Button onClick={getGames} className='CButton0' startIcon={<SearchIcon fontSize="large" sx={{ color: "white" }} />}>поиск</Button>
        </Stack>
      </Stack>

      <Stack className="catalog-games-container" spacing={2}>
        {
          isLoaded ?
          games.map(game => {
            return (
              <GameElement game={game} onClick={gameClickCallback}/>
            )
          })
          :
          <LinearProgress/>
        }
      </Stack>

      <Stack direction={"row"} justifyContent={"center"}>
        <Pagination defaultPage={page} count={pagesCount} color='primary' onChange={paginationChangeCallback} />
      </Stack>

      <FilterDrawer open={filterTabOpen} closeCallback={closeCallback} onSubmit={filterSubmitCallback} />
    </Stack>
  )
}

export default Catalog;