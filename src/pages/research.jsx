import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Article from "../components/articles/article";

import INFO from "../data/user";
import SEO from "../data/seo";
import myresearch from "../data/research";

import "./styles/articles.css";

const Research = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "research");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`research | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="research" />
				<div className="content-wrapper">
					<div className="research-logo-container">
						<div className="research-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="research-main-container">
						<div className="title research-title">
							{INFO.research.title}
						</div>

						<div className="subtitle research-subtitle">
							{INFO.research.description}
						</div>

						<div className="research-container">
							<div className="research-wrapper">
								{myresearch.map((article, index) => (
									<div
										className="research-article"
										key={(index + 1).toString()}
									>
										<Article
											key={(index + 1).toString()}
											date={article().date}
											title={article().title}
											description={article().description}
											link={"/article/" + (index + 1)}
										/>
									</div>
								))}
							</div>
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

export default Research;
