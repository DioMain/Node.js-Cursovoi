import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/joy/LinearProgress';
import TextArea from '@mui/joy/Textarea';
import { useSelector, useDispatch } from "react-redux";

import FileInput from '../Common/FileInput';
import './../../css/DeveloperGameEditor.css'
import { setGame } from '../../store/gameSlice';
import GameElement from '../DeveloperGameList/GameElement';
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import { useCallback, useState } from 'react';
import SaleDialog from './SaleDialog';
import Numeritic from '../Common/Numeritic';
import Confirm from '../Common/Confirm';


function DeveloperGameEditor() {
  const dispatch = useDispatch();

  let user = useSelector(state => state.user);
  let game = useSelector(state => state.game);

  let [error, setError] = useState("");
  let [saleDialog, setSaleDialog] = useState(false);
  let [deleteConfirm, setDeleteConfirm] = useState(false);

  if (user.init && !user.auth)
    window.location.assign('/');

  let gameid = window.location.pathname.split('/')[3];

  let descriptionText = "";
  let tagsText = "";

  if (user.init && !game.init) {
    fetch(`/api/getgameinfo?id=${gameid}`)
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          dispatch(setGame({ init: true, data: data.game }));
        }
        else {
          window.location.replace('/');
        }
      });
  }

  if (game.init) {
    descriptionText = game.data.description;
    tagsText = game.data.tags;
  }

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

  const updateGame = useCallback(() => {
    let nameField = document.getElementById('name');
    let priceField = document.getElementById('price');

    let iconField = document.getElementById('icon');
    let catalogField = document.getElementById('catalog');
    let libriaryField = document.getElementById('libriary');
    let mainfileField = document.getElementById('mainfile');

    if (nameField.value === "") {
      setError("Поле названия не должно быть пустое!");
      return;
    }

    if (priceField.value < 0) {
      setError("Поле цены имеет не допустимое значение!");
      return;
    }

    let formData = new FormData();

    let types = [];

    formData.append('id', game.data.id);
    formData.append('name', nameField.value);
    formData.append('description', descriptionText);
    formData.append('tags', tagsText);
    formData.append('price', priceField.value);

    if (iconField.files[0]) {
      formData.append('files', iconField.files[0]);
      types.push("icon");
    }

    if (catalogField.files[0]) {
      formData.append('files', catalogField.files[0]);
      types.push("catalog");
    }

    if (libriaryField.files[0]) {
      formData.append('files', libriaryField.files[0]);
      types.push("libriary");
    }

    if (mainfileField.files[0]) {
      formData.append('files', mainfileField.files[0]);
      types.push("mainfile");
    }

    formData.append('filesTypes', JSON.stringify(types));

    fetch('/api/updategame', {
      method: "PUT", body: formData
    })
      .then(raw => raw.json())
      .then(data => {
        window.location.reload();
      });
  })

  const dropSale = useCallback(() => {
    fetch('/api/game/dropsale', {
      method: "DELETE",
      headers: {
        'content-type': "application/json"
      },
      body: JSON.stringify({ gameId: game.data.id })
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          window.location.reload();
        }
        else if (error === "jwt")
          window.location.replace('/');
      });
  });

  const deteleGame = useCallback(() => {
    fetch(`/api/deletegame?id=${game.data.id}`, {
      method: "DELETE",
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          window.location.replace('/developer')
        }
        else if (error === "jwt")
          window.location.replace('/');
      });
  });

  return (
    <div className='DGE-container'>
      {
        game.init ?
          (
            <Stack spacing={4}>
              <Stack className='DGE-main' spacing={2}>
                <Stack className='DGE-title' direction={"row"}>
                  <img src={game.data.libImageUrl} />
                  <div className='DGE-title-text'>
                    <h1>{game.data.name}</h1>
                  </div>
                </Stack>

                <GameElement game={game.data} />

                <Stack direction={'row'} justifyContent={"center"}>
                  <Stack className='DGE-Libriary' direction={'row'} spacing={1}>
                    <img src={game.data.iconImageUrl} />
                    <Stack direction={'column'} justifyContent={"center"}><div>{game.data.name}</div></Stack>
                  </Stack>
                </Stack>

                <Divider />
                <h3>Стастус: <span style={{ fontStyle: "italic" }}>{getState(game.data.state)}</span></h3>

                <Divider />
                <Stack spacing={3}>
                  <Stack direction={'row'} spacing={3}>
                    <TextField id='name' className='CTextField' defaultValue={game.data.name} placeholder='Название игры' />
                    <Stack justifyContent={'center'}><h4>Название игры</h4></Stack>
                  </Stack>

                  <Divider />
                  <h4 style={{ marginTop: "25px" }}>Описание игры</h4>
                  <TextArea defaultValue={descriptionText} style={{ marginTop: "10px" }} onChange={(evt) => descriptionText = evt.target.value}></TextArea>

                  <Divider />
                  <h4 style={{ marginTop: "25px" }}>Теги</h4>
                  <div style={{ fontSize: "12px" }}>Через зяпятую (пример: [RPG, JRPG, Shooter])</div>
                  <TextArea defaultValue={tagsText} style={{ marginTop: "10px" }} onChange={(evt) => tagsText = evt.target.value}></TextArea>

                  <Divider />
                  <Stack direction={'row'} spacing={3}>
                    <Numeritic id='price' defaultValue={game.data.priceusd} min={0} step="0.01" />
                    <Stack justifyContent={'center'}><h4>Цена игры $</h4></Stack>
                  </Stack>

                  <Divider />
                  <FileInput inputId='icon' buttonText="Иконка" style={{ width: "260px" }} mime="image/png, image/jpeg" />
                  <Divider />
                  <FileInput inputId='catalog' buttonText="Изображение в каталоге" style={{ width: "260px" }} mime="image/png, image/jpeg" />
                  <Divider />
                  <FileInput inputId='libriary' buttonText="Изображение в библиотеке" style={{ width: "260px" }} mime="image/png, image/jpeg" />
                  <Divider />
                  <FileInput inputId='mainfile' buttonText="Файл с игрой" style={{ width: "260px" }} mime=".zip, .rar, .exe" />
                </Stack>

                <Divider />

                <Stack justifyContent={"end"} direction={"row"}>
                  <Button color="primary" className='CButton0' onClick={updateGame}>
                    Подтвердить
                  </Button>
                </Stack>

                <Divider />

                <h3 style={{ color: "red" }}>{error}</h3>
              </Stack>

              <Stack className='DGE-sale' spacing={2}>
                <h2>Скидка</h2>
                <div>
                  {
                    game.data.sale ?
                      (
                        <Stack direction={"row"} justifyContent={"space-between"}>
                          <Stack justifyContent={"center"}>
                            <div>Причина: {game.data.sale.cause}</div>
                            <div>Процент: {game.data.sale.percent * 100}%</div>
                            <div>До: {(new Date(game.data.sale.untilto)).toString()}</div>
                          </Stack>

                          <Button className='CButton-Error' onClick={dropSale}>
                            Удалить скидку
                          </Button>
                        </Stack>
                      )
                      :
                      (
                        <Stack direction={"row"} justifyContent={"space-between"} v>
                          <Stack justifyContent={"center"}>
                            <div>Скидка отсудствует</div>
                          </Stack>

                          <Button className='CButton0' onClick={() => setSaleDialog(true)}>
                            Добавить скидку
                          </Button>
                        </Stack>
                      )
                  }
                </div>
              </Stack>

              <Stack className='DGE-danger' direction={"row"} justifyContent={"end"}>
                <Button className='CButton-Error' onClick={() => setDeleteConfirm(true)}>
                  Удалить игру
                </Button>
              </Stack>
            </Stack>
          )
          :
          (
            <LinearProgress thickness={2} />
          )
      }
      <SaleDialog open={saleDialog} onCloseClick={() => setSaleDialog(false)} />
      <Confirm 
        open={deleteConfirm} 
        onCancel={() => setDeleteConfirm(false)} 
        text={"Вы уверены что хотите удалить игру?"}
        onConfirm={deteleGame}/>
    </div>
  )
}

export default DeveloperGameEditor;