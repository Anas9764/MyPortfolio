"use client";

import dynamic from "next/dynamic";
import Typewriter from "typewriter-effect";
import {
  HeroContainer,
  HeroBg,
  HeroLeftContainer,
  Img,
  HeroRightContainer,
  HeroInnerContainer,
  TextLoop,
  Title,
  Span,
  SubTitle,
  ResumeButton,
} from "./HeroStyle";
import type { Bio } from "@/types/portfolio";

const HeroBgAnimation = dynamic(() => import("../HeroBgAnimation"), {
  ssr: false,
});

interface HeroSectionProps {
  bio: Bio | null;
}

const HeroSection = ({ bio }: HeroSectionProps) => {
  if (!bio) return null;

  return (
    <div id="about">
      <HeroContainer>
        <HeroBg>
          <HeroBgAnimation />
        </HeroBg>
        <HeroInnerContainer>
          <HeroLeftContainer id="Left">
            <Title>
              Hi, I am <br /> {bio.name}
            </Title>
            <TextLoop>
              I am a
              <Span>
                <Typewriter
                  options={{
                    strings: bio.roles || [],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </Span>
            </TextLoop>
            <SubTitle>{bio.description}</SubTitle>
            {bio.resume && (
              <ResumeButton href={bio.resume} target="_blank" rel="noreferrer">
                Check Resume
              </ResumeButton>
            )}
          </HeroLeftContainer>
          <HeroRightContainer id="Right">
            <Img
              src={bio.image || "/HeroImage.jpg"}
              alt="hero-image"
            />
          </HeroRightContainer>
        </HeroInnerContainer>
      </HeroContainer>
    </div>
  );
};

export default HeroSection;
