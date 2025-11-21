import React from "react";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";

import Card from "../common/card";

import "./styles/works.css";

const Works = () => {
	return (
		<div className="works">
			<Card
				icon={faBriefcase}
				title="Work"
				body={
					<div className="works-body">
						<div className="work">
							<img
								src=""
								alt="GS"
								className="work-image"
							/>
							<div className="work-title">Goldman Sachs</div>
							<div className="work-subtitle">
								Summer Analyst (Engineering)
							</div>
							<div className="work-duration">May 2026 - July 2026</div>
						</div>
						<div className="work">
							<img
								src=""
								alt="Ti"
								className="work-image"
							/>
							<div className="work-title">Ti Lab</div>
							<div className="work-subtitle">
								Undergraduate Student Researcher
							</div>
							<div className="work-duration">August 2025 - Present</div>
						</div>

						<div className="work">
							<img
								src="oxmaint.png"
								alt="oxmaint"
								className="work-image"
							/>
							<div className="work-title">Oxmaint Inc.</div>
							<div className="work-subtitle">
								Software Engineer Intern
							</div>
							<div className="work-duration">Jul 2025 - Aug 2025</div>
						</div>

						<div className="work">
							<img
								src="eecs.png"
								alt="eecs"
								className="work-image"
							/>
							<div className="work-title">Prof. Tsu-Jae King Liu's Group</div>
							<div className="work-subtitle">
								Undergraduate Research Intern
							</div>
							<div className="work-duration">Jan 2025 - Present</div>
						</div>

						<div className="work">
							<img
								src="haas.png"
								alt="haas"
								className="work-image"
							/>
							<div className="work-title">UC Berkeley, Haas School of Business</div>
							<div className="work-subtitle">
								Undergraduate Research Intern
							</div>
							<div className="work-duration">Aug 2024 - Dec 2024</div>
						</div>

						<div className="work">
							<img
								src="astar.png"
								alt="astar"
								className="work-image"
							/>
							<div className="work-title">Agency for Science, Technology and Research</div>
							<div className="work-subtitle">
								Undergraduate Research Intern
							</div>
							<div className="work-duration">May 2023 - Aug 2023</div>
						</div>

						<div className="work">
							<img
								src="lta.png"
								alt="lta"
								className="work-image"
							/>
							<div className="work-title">Land Transport Authority</div>
							<div className="work-subtitle">
								Engineering Intern
							</div>
							<div className="work-duration">Dec 2022 - Dec 2022</div>
						</div>

					</div>
				}
			/>
		</div>
	);
};

export default Works;
