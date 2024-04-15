import Stack from '@mui/material/Stack'

import './../../css/AdminPanel.css'

import { useSelector } from 'react-redux';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Pagination from '@mui/material/Pagination';
import { Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GameElement from './GameElement';
import { useCallback, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

let page = 1;
let state = -1;
let name = "";
let inited = false;

function AdminPanel() {
  let user = useSelector(state => state.user);

  let [games, setGames] = useState([]);
  let [pagesCount, setPagesCount] = useState(0);
  let [isloading, setIsloading] = useState(true);

  if (user.init && !user.auth)
    window.location.replace('/');

  if (user.init && user.auth && user.data.role !== "ADMIN")
    window.location.replace('/');

  const getgames = useCallback(() => {
    setIsloading(true);

    fetch(`/api/getgamesadmin?name=${name}&state=${state}&page=${page}`)
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          setGames(data.games);
          setPagesCount(data.pagesCount);

          setIsloading(false);
        }
        else if (data.error === "jwt")
          window.location.replace("/");
      });
  });

  if (!inited) {
    getgames();
    inited = true;
  }

  const pageCallback = useCallback((evt, newpage) => {
    page = newpage;

    getgames();
  })

  const stateCallback = useCallback((evt) => {
    state = evt.target.value;

    getgames();
  });

  const nameCallback = useCallback(evt => name = evt.target.value);

  const changeGameStateCallback = useCallback(() => getgames());


  return (
    <Stack className='admin-container' spacing={2}>
      <Stack className='admin-toolpanel' direction={"row"} justifyContent={"space-between"}>

        <Select onChange={stateCallback} title='Состояние' defaultValue={state} style={{ minWidth: "200px" }} className='CSelect'>
          <MenuItem value={-1}>Все</MenuItem>
          <MenuItem value={0}>На рассмотрении</MenuItem>
          <MenuItem value={1}>В общем доступе</MenuItem>
          <MenuItem value={2}>В ограниченом доступе</MenuItem>
          <MenuItem value={3}>Заблокированные</MenuItem>
        </Select>

        <Stack direction={"row"} spacing={2}>
          <TextField label='Поиск по названию' className='CTextField' onChange={nameCallback}/>
          <Button onClick={getgames} className='CButton0' startIcon={<SearchIcon fontSize="large" sx={{ color: "white" }} />}>поиск</Button>
        </Stack>
      </Stack>

      {
        isloading ?
          <LinearProgress />
          :
          <Stack className='admin-games-container' spacing={1}>
            {
              games.map(game => {
                return (<GameElement game={game} onChangeGameState={changeGameStateCallback} />)
              })
            }
          </Stack>
      }


      <Stack direction={"row"} justifyContent={"center"}>
        <Pagination defaultPage={page} count={pagesCount} color='primary' onChange={pageCallback} />
      </Stack>
    </Stack>
  )
}

export default AdminPanel;