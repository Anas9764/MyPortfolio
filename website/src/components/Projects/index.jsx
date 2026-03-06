import { useState } from 'react';
import {
  Container,
  Wrapper,
  Title,
  Desc,
  CardContainer,
} from './ProjectsStyle';
import ProjectCard from '../Cards/ProjectCards';
import { projects } from '../../data/constants';

const Projects = ({ openModal, setOpenModal }) => {
  const [toggle, setToggle] = useState('all');

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
            ? projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              ))
            : projects
                .filter((item) => item.category === toggle)
                .map((project) => (
                  <ProjectCard
                    key={project.id}
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
