"use client";

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useTheme } from "styled-components";
import {
  Nav,
  NavLink,
  NavbarContainer,
  Span,
  NavLogo,
  NavItems,
  GitHubButton,
  ButtonContainer,
  MobileIcon,
  MobileMenu,
  MobileLink,
} from "./NavbarStyledComponent";
import type { Bio } from "@/types/portfolio";

interface NavbarProps {
  bio: Bio | null;
}

const Navbar = ({ bio }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo href="/">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#854CE6",
              fontSize: "33px",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <Span>{bio?.name || "Anas Qureshi"}</Span>
          </div>
        </NavLogo>
        <MobileIcon>
          <FaBars onClick={() => setIsOpen(!isOpen)} />
        </MobileIcon>
        <NavItems>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#skills">Skills</NavLink>
          <NavLink href="#experience">Experience</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#education">Education</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </NavItems>
        <ButtonContainer>
          {bio?.github && (
            <GitHubButton href={bio.github} target="_blank" rel="noreferrer">
              Github Profile
            </GitHubButton>
          )}
        </ButtonContainer>
        {isOpen && (
          <MobileMenu $isOpen={isOpen}>
            <MobileLink href="#about" onClick={() => setIsOpen(false)}>
              About
            </MobileLink>
            <MobileLink href="#skills" onClick={() => setIsOpen(false)}>
              Skills
            </MobileLink>
            <MobileLink href="#experience" onClick={() => setIsOpen(false)}>
              Experience
            </MobileLink>
            <MobileLink href="#projects" onClick={() => setIsOpen(false)}>
              Projects
            </MobileLink>
            <MobileLink href="#education" onClick={() => setIsOpen(false)}>
              Education
            </MobileLink>
            <MobileLink href="#contact" onClick={() => setIsOpen(false)}>
              Contact
            </MobileLink>
            {bio?.github && (
              <GitHubButton
                style={{
                  padding: "10px 16px",
                  background: `${theme.primary}`,
                  color: "white",
                  width: "max-content",
                }}
                href={bio.github}
                target="_blank"
                rel="noreferrer"
              >
                Github Profile
              </GitHubButton>
            )}
          </MobileMenu>
        )}
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
