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
import CS180Proj2 from "./pages/cs180project2";
import CS180Proj3 from "./pages/cs180project3";
import CS180Proj4 from "./pages/cs180project4";
import CS180Proj5 from "./pages/cs180project5";

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
				<Route path="/cs180/project2" element={<CS180Proj2 />} />
				<Route path="/cs180/project3" element={<CS180Proj3 />} />
				<Route path="/cs180/project4" element={<CS180Proj4 />} />
				<Route path="/cs180/project5" element={<CS180Proj5 />} />
				<Route path="*" element={<Notfound />} />
			</Routes>
		</div>
	);
}

export default App;
