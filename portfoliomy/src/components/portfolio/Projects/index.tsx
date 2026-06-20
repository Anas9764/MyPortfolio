"use client";

import {
  Container,
  Wrapper,
  Title,
  Desc,
  CardContainer,
} from "./ProjectsStyle";
import ProjectCard from "../Cards/ProjectCards";
import type { Project } from "@/types/portfolio";

interface ProjectsProps {
  projects: Project[] | null;
  setOpenModal: (modal: { state: boolean; project: Project | null }) => void;
}

export default function Projects({
  projects,
  setOpenModal,
}: ProjectsProps) {
  if (!projects) return null;

  return (
    <Container id="projects">
      <Wrapper>
        <Title>Projects</Title>
        <Desc>
          I have focused on designing and developing professional web
          applications, emphasizing performance, usability, and scalability.
          Here are some of the notable projects I have contributed to.
        </Desc>
        <CardContainer>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || project._id || index}
              project={project}
              setOpenModal={setOpenModal}
            />
          ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
}
