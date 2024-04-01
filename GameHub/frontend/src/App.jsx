import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./Pages/Index";
import Header from "./Components/Header";
import "./css/App.css";
import Footer from "./Components/Footer";

import {useDispatch, useSelector} from 'react-redux';
import { setUser } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

  let user = useSelector(state => state.user);

  if (user.init === false) {
    fetch("/api/auth")
    .then(raw => raw.json())
    .then(data => {
      if (data.auth) {
        dispatch(setUser({ init: true, auth: true, data: data.data }));      
      }
      else {
        dispatch(setUser({ init: true, auth: false, data: undefined }));      
      }
    });
  }

  console.log(user);

  return (
    <div>
      <header>
        <Header/>
      </header>
      <main>
        asd
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </main>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default App;
