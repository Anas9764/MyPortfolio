"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import { darkTheme } from "@/styles/portfolio-theme";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import Skills from "@/components/portfolio/Skills";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Education from "@/components/portfolio/Education";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import ProjectDetails from "@/components/portfolio/ProjectDetails";
import { trackVisit } from "@/lib/api-client";
import type { PortfolioData, Project } from "@/types/portfolio";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

interface PortfolioClientProps {
  data: PortfolioData;
}

export default function PortfolioClient({ data }: PortfolioClientProps) {
  const [openModal, setOpenModal] = useState<{
    state: boolean;
    project: Project | null;
  }>({ state: false, project: null });

  useEffect(() => {
    trackVisit().catch((err) => console.error("Tracking error:", err));
  }, []);

  useEffect(() => {
    if (data.bio?.image) {
      const favicon = document.querySelector('link[rel="icon"]');
      const appleFavicon = document.querySelector(
        'link[rel="apple-touch-icon"]'
      );
      if (favicon) favicon.setAttribute("href", data.bio.image);
      if (appleFavicon) appleFavicon.setAttribute("href", data.bio.image);
    }
  }, [data.bio?.image]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="portfolio-root">
        <Navbar bio={data.bio} />
        <Body>
          <HeroSection bio={data.bio} />
          <Wrapper>
            <Skills skills={data.skills} />
            <Experience experiences={data.experiences} />
          </Wrapper>
          <Projects
            projects={data.projects}
            setOpenModal={setOpenModal}
          />
          <Wrapper>
            <Education education={data.education} />
            <Contact />
          </Wrapper>
          <Footer bio={data.bio} />
          {openModal.state && (
            <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
          )}
        </Body>
      </div>
    </ThemeProvider>
  );
}
