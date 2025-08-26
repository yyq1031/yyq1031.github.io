import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";
import OutlinedTimeline from "../components/common/timeline";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/about.css";

const Teaching = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "teaching");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Teaching | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="teaching" />
				<div className="content-wrapper">
					<div className="teaching-logo-container">
						<div className="teaching-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="about-container">
						<div className="about-main">
							<div className="about-right-side">
								<div className="title about-title">
									{INFO.about.title}
								</div>

								{/* <div className="subtitle about-subtitle">
									{INFO.about.description}
								</div> */}
								<div style={{ marginTop: "2rem" }}>
  									<h2 className="tsubtitle about-subtitle">CS61B: Data Structures</h2>
  									<OutlinedTimeline />
								</div>
								
							</div>

							<div className="about-left-side">
								<div className="about-image-container">
									<div className="about-image-wrapper">
										<img
											src="cs61b.jpg"
											alt="cs61b"
											className="cs61b-image"
											style={{ maxWidth: "50%", height: "auto" }}
										/>
									</div>
								</div>

								{/* <div className="about-socials">
									<Socials />
								</div> */}
							</div>
						</div>
						<div className="about-socials-mobile">
							<Socials />
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Teaching;
