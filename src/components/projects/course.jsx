import React from "react";
import Project from "./project";
import INFO from "../../data/user";
import "./styles/allProjects.css";

const CourseProjects = () => {
  const courseProjects = INFO.projects.filter(p => p.type === "course");

  return (
    <div className="all-projects-container">
      {courseProjects.map((project, index) => (
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

export default CourseProjects;
