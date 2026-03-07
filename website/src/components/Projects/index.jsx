import { useState } from 'react';
import {
  Container,
  Wrapper,
  Title,
  Desc,
  CardContainer,
} from './ProjectsStyle';
import ProjectCard from '../Cards/ProjectCards';

const Projects = ({ projects, openModal, setOpenModal }) => {
  const [toggle, setToggle] = useState('all');

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
          {toggle === 'all'
            ? projects.map((project, index) => (
                <ProjectCard
                  key={project.id || index}
                  project={project}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              ))
            : projects
                .filter((item) => item.category === toggle)
                .map((project, index) => (
                  <ProjectCard
                    key={project.id || index}
                    project={project}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                  />
                ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
};

export default Projects;
