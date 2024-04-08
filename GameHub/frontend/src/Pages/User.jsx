import "./../css/User.css";

import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button'
import { useSelector } from "react-redux";
import { useState } from "react";
import UserEditor from './UserEditor';
import PaymentMethodEditor from "./PME_User";

function User() {

  let [pageIndex, setPageIndex] = useState(0);

  let user = useSelector(state => state.user);

  if (user.init && !user.auth) 
    window.location.replace("/");

  const openUserEditor = () => {
    setPageIndex(0);
  }
  const openPMEditor = () => {
    setPageIndex(1);
  }

  const getPage = () => {
    switch (pageIndex) {
      case 0:      
        return (<UserEditor/>);
      default:
        return (<PaymentMethodEditor/>)
    }
  }

  return (
    <div container className="user-page-contaiener" direction="row">  
      <Stack className="user-page-menu" spacing={1}>
        <Button variant="text" color="primary" className="CButton1" onClick={openUserEditor}>
          Общие
        </Button>
        <Button variant="text" color="primary" className="CButton1" onClick={openPMEditor}>
          Оплата
        </Button>
      </Stack>
      <div className="user-page-content">
        {getPage()}
      </div>
    </div>
  )
}

export default User;