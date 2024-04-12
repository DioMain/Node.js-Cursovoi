import Stack from '@mui/material/Stack'

import TextField from '@mui/material/TextField'
import TextArea from '@mui/joy/Textarea'
import Switch from '@mui/material/Switch'

function Step0({ onChange, data: { name, description, tags, price, isfree } }) {
  const freeCheckBoxHandle = (evt) => {
    onChange("isfree", !isfree);
  }

  const nameFieldHandle = (evt) => {
    onChange("name", evt.target.value);
  }

  const descriptionFieldHandle = (evt) => {
    onChange("description", evt.target.value);
  }

  const tagsFieldHandle = (evt) => {
    onChange("tags", evt.target.value);
  }

  const priceFieldHandle = (evt) => {
    onChange("price", evt.target.value);
  }

  return (
    <Stack className='DCG-Step0-container' direction={'column'}>
      <Stack direction={'row'} spacing={3}>
        <TextField onChange={nameFieldHandle} className='CTextField' defaultValue={name} placeholder='The Game' />
        <Stack justifyContent={'center'}><h4>Название игры</h4></Stack>
      </Stack>

      <h4 style={{ marginTop: "25px" }}>Описание игры</h4>
      <TextArea onChange={descriptionFieldHandle} defaultValue={description} style={{ marginTop: "10px" }}></TextArea>

      <h4 style={{ marginTop: "25px" }}>Теги</h4>
      <div style={{ fontSize: "12px" }}>Через зяпятую (пример: [RPG, JRPG, Shooter])</div>
      <TextArea onChange={tagsFieldHandle} defaultValue={tags} style={{ marginTop: "10px" }}></TextArea>

      <Stack direction={'row'} spacing={3} style={{ marginTop: "25px" }} justifyContent={"space-between"}>

        <Stack direction={'row'} spacing={3}>
          <input onChange={priceFieldHandle} defaultValue={price} min={0} type='number' step="0.01" className='CTextField-Def' placeholder='The Game' disabled={isfree} />
          <Stack justifyContent={'center'}><h4>Цена игры $</h4></Stack>
        </Stack>

        <Stack direction={'row'}>
          <Stack justifyContent={'center'}>
            <Switch checked={isfree} onChange={freeCheckBoxHandle} />
          </Stack>
          <Stack justifyContent={'center'}>
            <h4>Бесплатная</h4>
          </Stack>
        </Stack>

      </Stack>
    </Stack>
  )
}

export default Step0;