import Stack from "@mui/material/Stack"
import Drawer from '@mui/material/Drawer'
import { useCallback, useState } from "react"
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextArea from "@mui/joy/Textarea"
import Numeritic from './../Common/Numeritic'

import "./../../css/Catalog.css"

let tagField = "";

let minPrice = 0;
let maxPrice = 0;

function FilterDrawer({ open, closeCallback, onSubmit }) {

  const submitCallback = useCallback(() => {
    onSubmit([
      { tag: "tag", data: tagField },
      { tag: "price", data: { minPrice: Number.parseFloat(minPrice), maxPrice: Number.parseFloat(maxPrice) } }
    ]);
    closeCallback();
  });

  return (
    <Drawer className="catalog-filter-drawer"
      variant="temporary" anchor="left"
      open={open}
    >
      <Stack className="catalog-filter-drawer-container" justifyContent={"center"}>
        <Stack direction={"row"} justifyContent={"end"}>
          <IconButton onClick={closeCallback}>
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Stack>

        <Stack style={{ paddingRight: "14px" }} spacing={2}>
          <h2 style={{ textAlign: "center" }}>Фильтры</h2>

          <h4>Теги</h4>
          <TextArea defaultValue={tagField} onChange={(evt) => tagField = evt.target.value }></TextArea>

          <h4>По цене</h4>
          <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
            <Numeritic defaultValue={minPrice} step="0.01" min={0} max={500} style={{ width: "60px", height: "10px", padding: "10px" }} 
              onChange={(evt) => minPrice = evt.target.value}/>

            <Stack justifyContent={"center"}>-</Stack>

            <Numeritic defaultValue={maxPrice} step="0.01" min={0} max={500} style={{ width: "60px", height: "10px", padding: "10px" }} 
              onChange={(evt) => maxPrice = evt.target.value}/>
          </Stack>

          <Button onClick={submitCallback} className="CButton0">Подтвердить</Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}

export default FilterDrawer;