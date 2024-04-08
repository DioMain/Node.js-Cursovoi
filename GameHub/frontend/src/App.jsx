import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "./Components/Index";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import User from "./Components/User";

import "./css/App.css";
import "./css/Custom.css";
import "./css/Buttons.css";

import { useDispatch } from 'react-redux';
import { setUser } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

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

  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </BrowserRouter>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
