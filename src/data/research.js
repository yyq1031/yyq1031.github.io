import React from "react";

function article_1() {
	return {
		date: "November 2024",
		title: "Opentrons for automated and high-throughput viscometry",
		description:
			"We developed a high-throughput proxy viscometer using the Opentrons OT-2 automated liquid handler, which leverages the differing dispense rates of air-displacement pipettes across liquids of varying viscosities. By measuring dispensed volumes under controlled conditions, we trained an ensemble machine learning regressor to predict Newtonian liquid viscosities. This model extends the applicability to simple non-Newtonian fluids, and the experiments demonstrated successful characterization of power-law fluids.",
		keywords: [
			"Opentrons for automated and high-throughput viscometry",
			"Digital Discovery",
			"10.1039/D4DD00368C",
			"A*STAR",
			"Yinqi",
			"Yinqi Yi",
		],
		style: `
				.article-content {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.randImage {
					align-self: center;
					outline: 2px solid red;
				}
				`,
		body: (
  			<React.Fragment>
    			<div className="article-content">
      				<iframe
        				src="/d4dd00368c.pdf"
        				width="100%"
        				height="600px"
        				style={{ border: "1px solid #ccc", borderRadius: "8px" }}
        				title="Opentrons for automated and high-throughput viscometry"
      				/>

      				<p>If the embed doesn’t load, click{" "}
        				<a
          				href="https://doi.org/10.1039/D4DD00368C"
          				target="_blank"
          				rel="noreferrer"
        				> here to view the article</a>.
      				</p>
    			</div>
  		</React.Fragment>
),

	};
}

function article_2() {
	return {
		date: "May 2022",
		title: "Impact of Obesity on miRNA Expression in Human Spermatozoa",
		description:
			"I investigated how obesity alters miRNA expression in spermatozoa. Using R to compare samples from obese and lean men, I identified differentially expressed miRNAs that regulate genes involved in fatty acid metabolism and the actin cytoskeleton pathway, which may increase the risk of obesity in offspring. This proposes potential avenues for treatments and preventive strategies targeting obesity through epigenetic regulation.",
		style: ``,
		keywords: [
			"Bioinformatics",
			"Impact of Obesity on miRNA Expression in Human Spermatozoa",
			"A*STAR",
			"Yinqi",
			"Yinqi Yi",
		],
		body: (
			<React.Fragment>
				<img src="/CO005.png" alt="CO005 figure" style={{ maxWidth: "90%", height: "auto"}}/>
				<p><a href="https://drive.google.com/file/d/1vmTTZQk3j4yrecQCJH9XuOlw_oiUNEpe/view?usp=sharing">Presentation</a></p>

				<p><a href="https://drive.google.com/file/d/1N1Qa9flslvcYh7i6zNidQ0nADxXHrqHS/view?usp=sharing">
				Paper</a></p>
				
			</React.Fragment>
		),
	};
}

const myresearch = [article_1, article_2];

export default myresearch;
