import { useSelector } from "react-redux";
import "./../css/Header.css";
import { useState } from "react";
import RegisterDialog from "./RegisterDialog";
import LoginDialog from "./LoginDialog";

function Header() {

  const defaultUserImageURL = "/images/user.png"

  let user = useSelector(state => state.user);

  let [userImageUrl, setUserImageUrl] = useState(defaultUserImageURL);
  let [regDialogOpen, setRegDialogOpen] = useState(false);
  let [loginDialogOpen, setLoginDialogOpen] = useState(false);

  if (user.init && user.auth && userImageUrl === defaultUserImageURL) {
    console.log(`${user.init} ${user.auth}`);

    fetch(`/api/getUserIconLink?id=${user.data.id}`)
      .then(raw => raw.json())
      .then(data => {
        setUserImageUrl(data.iconLink);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const getButtonByRole = () => {
    if (user.auth) {
      switch (user.data.role) {
        case "USER":
          return (<a href="#t">Библиотека</a>);
        case "DEVELOPER":
          return (<a href="#t">Компании</a>);
        case "ADMIN":
          return (<a href="#t">Администрирование</a>);
        default:
          return null;
      }
    }
    else
      return null;
  }

  const registerOpen = () => {
    setRegDialogOpen(true);
  }

  const registerClose = () => {
    setRegDialogOpen(false);
  }

  const loginOpen = () => {
    setLoginDialogOpen(true);
  }

  const loginClose = () => {
    setLoginDialogOpen(false);
  }

  return (
    <div className="header-container">
      <nav>
        <div className="links">
          <a href="/">Каталог</a>
          {getButtonByRole()}
        </div>
        <div className="user">
          <div style={{ marginTop: "28px" }}>
            {
              user.auth === true ?
                (
                  <span><a href="/user">{user.data.name}</a></span>
                )
                :
                (
                  <span><a href="#t" onClick={registerOpen}>Регистрация</a>/<a href="#t" onClick={loginOpen}>Вход</a></span>
                )
            }
          </div>
          <div style={{ marginTop: "12px" }} className="img-container"><img src={userImageUrl} alt="/images/user.png" /></div>
        </div>
      </nav>

      <RegisterDialog open={regDialogOpen} onCloseClick={registerClose}/>
      <LoginDialog open={loginDialogOpen} onCloseClick={loginClose}/>
    </div>
  )
}

export default Header;