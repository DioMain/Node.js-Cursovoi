import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./Pages/Index";

function App() {
	return (
		<div>
			<header>
        HEADER
			</header>
			<main>
				<BrowserRouter>
          <Routes>
            <Route path="/" element={<Index/>}/>
          </Routes>
				</BrowserRouter>
			</main>
			<footer>
        FOOTER
			</footer>
		</div>
	);
}

export default App;
