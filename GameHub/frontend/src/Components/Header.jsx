import { useSelector } from "react-redux";
import "./../css/Header.css";
import { useState } from "react";
import RegisterDialog from "./RegisterDialog";

function Header() {

  let user = useSelector(state => state.user);

  let [userImageUrl, setUserImageUrl] = useState("/images/user.png");
  let [regDialogOpen, setRegDialogOpen] = useState(false);

  if (user.init && user.auth) {
    fetch(`/api/getUserIconLink?id=${user.data.id}`)
      .then(raw => raw.json())
      .then(data => {
        setUserImageUrl(data.iconLink);
      })
      .catch(err => {
        console.log(err);
      });
  }

  //TODO
  const loginClick = () => {
    fetch("/api/login", {
      method: "POST"
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.success) {
          window.location.reload();
        }
        else {

        }
      })
  };

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

  return (
    <div className="header-container" id="t">
      <nav>
        <div className="links">
          <a href="#t">Каталог</a>
          {getButtonByRole()}
        </div>
        <div className="user">
          <div style={{ marginTop: "28px" }}>
            {
              user.auth === true ?
                (
                  <span><a href="#t">{user.data.name}</a></span>
                )
                :
                (
                  <span><a href="#t" onClick={registerOpen}>Регистрация</a>/<a href="#t" onClick={loginClick}>Вход</a></span>
                )
            }
          </div>
          <div style={{ marginTop: "12px" }} className="img-container"><img src={userImageUrl} /></div>
        </div>
      </nav>

      <RegisterDialog open={regDialogOpen}/>
    </div>
  )
}

export default Header;