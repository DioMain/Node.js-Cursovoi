import Stack from '@mui/material/Stack'

import './../../css/AdminPanel.css'

import { useSelector } from 'react-redux';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Pagination from '@mui/material/Pagination';
import { Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar() {
  return (
    <Stack direction={"row"} spacing={1}>
      <TextField label='Поиск по названию' className='CTextField'/>
      <Button className='CButton0' startIcon={<SearchIcon fontSize="large" sx={{ color: "white" }}/>}>поиск</Button>
    </Stack>
  )
}

function AdminPanel() {
  let user = useSelector(state => state.user);

  if (user.init && user.auth && user.data.role !== "ADMIN")
    window.location.replace('/');

  return (
    <Stack className='admin-container' spacing={2}>
      <Stack className='admin-toolpanel' direction={"row"} justifyContent={"space-between"}>
        <Select title='Состояние' defaultValue={-1} style={{ minWidth: "200px"}} className='CSelect'>
          <MenuItem value={-1}>Все</MenuItem>
          <MenuItem value={0}>На рассмотрении</MenuItem>
          <MenuItem value={1}>В общем доступе</MenuItem>
          <MenuItem value={2}>В ограниченом доступе</MenuItem>
          <MenuItem value={3}>Недоступные</MenuItem>
        </Select>
        <SearchBar/>
      </Stack>

      <Stack direction={"row"} justifyContent={"center"}>
        <Pagination count={99} color='primary' />
      </Stack>
    </Stack>  
  )
}

export default AdminPanel;