import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import './../../css/DeveloperGameList.css';

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import GameElement from './GameElement';
import Divider from '@mui/material/Divider';

function DeveloperGameList() {
  let user = useSelector(state => state.user);

  if (user.init && !user.auth)
    window.location.replace('/');

  if (user.init && user.auth && user.data.role !== "DEVELOPER")
    window.location.replace('/');

  let [games, setGames] = useState([{}]);
  let [init, setInit] = useState(false);

  const getGames = () => {
    fetch('/api/getgamesbyuser')
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          console.log(data.games);

          setGames(data.games);
        }
        else {
          window.location.replace('/');
        }
      })
  }

  if (!init) {
    getGames();

    setInit(true);
  }

  return (
    <div className='DGL-container'>
      <Stack direction={"column"} spacing={3}>
        <Stack direction={'row'} justifyContent={'end'}>
          <Button variant="text" color="primary" className='CButton0' onClick={() => window.location.replace('/developer/createGame')}>
            Добавить новую игру
          </Button>
        </Stack>
        <Divider/>
        <Stack direction={"column"} spacing={2}>
          {
            games.map(game => {
              return (<GameElement game={game} />)
            })
          }
        </Stack>
      </Stack>
    </div>
  )
}

export default DeveloperGameList;