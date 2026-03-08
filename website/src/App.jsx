import { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import { darkTheme } from './utils/Themes.js';
import Navbar from "./components/Navbar";
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Experience from "./components/Experience";
import Education from "./components/Education";
import ProjectDetails from "./components/ProjectDetails";
import styled from "styled-components";
import { getPortfolioData } from "./api";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%,30% 98%, 0 100%);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #191924;
  color: white;
  font-size: 1.5rem;
`;

import Skeleton from "./components/Skeleton";

const SkeletonWrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #191924;
  min-height: 100vh;
`;

function App() {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getPortfolioData();
        setPortfolioData(data);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError("Failed to load portfolio content. Please try again later.");
      } finally {
        setTimeout(() => setLoading(false), 1000); // Small delay to appreciate the shimmer
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (portfolioData?.bio?.image) {
      const favicon = document.querySelector('link[rel="icon"]');
      const appleFavicon = document.querySelector('link[rel="apple-touch-icon"]');
      if (favicon) favicon.href = portfolioData.bio.image;
      if (appleFavicon) appleFavicon.href = portfolioData.bio.image;
    }
  }, [portfolioData]);

  if (loading) return (
    <ThemeProvider theme={darkTheme}>
      <SkeletonWrapper>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Skeleton width="150px" height="30px" />
          <div style={{ display: 'flex', gap: '20px' }}>
            <Skeleton width="80px" height="20px" />
            <Skeleton width="80px" height="20px" />
            <Skeleton width="80px" height="20px" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Skeleton width="60%" height="40px" style={{ marginBottom: '20px' }} />
            <Skeleton width="40%" height="30px" style={{ marginBottom: '20px' }} />
            <Skeleton width="100%" height="100px" style={{ marginBottom: '30px' }} />
            <Skeleton width="200px" height="50px" borderRadius="12px" />
          </div>
          <Skeleton width="400px" height="400px" borderRadius="50%" style={{ margin: '0 auto' }} />
        </div>
        <div style={{ marginTop: '60px' }}>
          <Skeleton width="200px" height="40px" style={{ margin: '0 auto 40px auto', display: 'block' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Skeleton height="200px" borderRadius="16px" />
            <Skeleton height="200px" borderRadius="16px" />
            <Skeleton height="200px" borderRadius="16px" />
          </div>
        </div>
      </SkeletonWrapper>
    </ThemeProvider>
  );
  if (error) return <LoadingContainer>{error}</LoadingContainer>;

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Navbar bio={portfolioData.bio} />
        <Body>
          <HeroSection bio={portfolioData.bio} />
          <Wrapper>
            <Skills skills={portfolioData.skills} />
            <Experience experiences={portfolioData.experiences} />
          </Wrapper>
          <Projects projects={portfolioData.projects} openModal={openModal} setOpenModal={setOpenModal} />
          <Wrapper>
            <Education education={portfolioData.education} />
            <Contact bio={portfolioData.bio} />
          </Wrapper>
          <Footer bio={portfolioData.bio} />
          {openModal.state &&
            <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />
          }
        </Body>
      </Router>
    </ThemeProvider>
  );
}

export default App;
