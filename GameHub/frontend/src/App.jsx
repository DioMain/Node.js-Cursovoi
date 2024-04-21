import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "./Components/Index";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import User from "./Components/User";
import DeveloperGameList from './Components/DeveloperGameList';
import DeveloperCreateGame from "./Components/DeveloperCreateGame";
import DeveloperGameEditor from "./Components/DeveloperGameEditor";
import AdminPanel from "./Components/AdminPanel";

import "./css/App.css";
import "./css/Custom.css";
import "./css/Buttons.css";

import { useDispatch } from 'react-redux';
import { setUser } from "./store/userSlice";
import Catalog from "./Components/Catalog";
import GamePage from "./Components/GamePage";

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
    <div className="BaseContainer">
      <header>
        <Header />
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/game/*" element={<GamePage />} /> {/* TODO */}
            <Route path="/user" element={<User />} />
            <Route path="/libriary" element={<Index />} /> {/* TODO */}
            <Route path="/developer" element={<DeveloperGameList />} />
            <Route path="/developer/createGame" element={<DeveloperCreateGame />} />
            <Route path="/developer/editGame/*" element={<DeveloperGameEditor />} />
            <Route path="/admin" element={<AdminPanel />} />
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
