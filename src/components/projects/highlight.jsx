import React from "react";
import Project from "../projects/project";
import INFO from "../../data/user";
import "./styles/allProjects.css";

const HighlightedProjects = () => {
  const highlighted = INFO.projects.filter(p => p.highlight === "true");

  return (
    <div className="all-projects-container">
      {highlighted.map((project, index) => (
        <div className="all-projects-project" key={index}>
          <Project
            logo={project.logo}
            title={project.title}
            description={project.description}
            linkText={project.linkText}
            link={project.link}
          />
        </div>
      ))}
    </div>
  );
};

export default HighlightedProjects;
