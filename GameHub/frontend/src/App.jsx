import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./Pages/Index";
import Header from "./Components/Header";
import "./css/App.css";
import { useState } from "react";

function App() {

	const [auth, setAuth] = useState(false);
	const [userIconUrl, setUserIconUrl] = useState('images/user.png');

	fetch('/api/CheckJwtToken')
		.then(raw => raw.json())
		.then(data => {
			if (data.auth) {
				setAuth(true);
				setUserIconUrl(data.iconUrl);
			}
			else {
				setAuth(false);
			}
		});

	return (
		<div>
			<header>
        		<Header/>
				<div className="FontTest">asdasdasds</div>
			</header>
			<main>
				<BrowserRouter>
          <Routes>
            <Route path="/" element={<Index/>}/>
          </Routes>
				</BrowserRouter>
			</main>
			<footer>
				<img src={userIconUrl}/>
			</footer>
		</div>
	);
}

export default App;
