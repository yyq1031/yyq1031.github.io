import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import Homepage from "./pages/homepage";
import Teaching from "./pages/teaching";
import Projects from "./pages/projects";
import Research from "./pages/research";
import ReadArticle from "./pages/readArticle";
import Contact from "./pages/contact";
import CS180 from "./pages/cs180";
import Notfound from "./pages/404";

import { TRACKING_ID } from "./data/tracking";
import "./app.css";
import CS180Proj0 from "./pages/cs180project0";
import CS180Proj1 from "./pages/cs180project1";

function App() {
	useEffect(() => {
		if (TRACKING_ID !== "") {
			ReactGA.initialize(TRACKING_ID);
		}
	}, []);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/research" element={<Research />} />
				<Route path="/article/:slug" element={<ReadArticle />} />
				<Route path="/teaching" element={<Teaching />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/cs180" element={<CS180 />} />
				<Route path="/cs180/project0" element={<CS180Proj0 />} />
				<Route path="/cs180/project1" element={<CS180Proj1 />} />
				<Route path="*" element={<Notfound />} />
			</Routes>
		</div>
	);
}

export default App;
