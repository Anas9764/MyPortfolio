"use client";

import styled from "styled-components";
import type { Education as EducationType } from "@/types/portfolio";

const Description = styled.div`
  width: 100%;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary + "99"};
  margin-bottom: 10px;
`;

const Span = styled.span`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const Card = styled.div`
  width: 650px;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease-in-out;
  border: 0.1px solid #854ce6;
  box-shadow: rgba(133, 76, 230, 0.15) 0px 4px 24px;
  &:hover {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
    ${Span} {
      overflow: visible;
      -webkit-line-clamp: unset;
    }
  }
  @media only screen and (max-width: 768px) {
    width: 300px;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
`;

const Image = styled.img`
  height: 50px;
  background-color: #000;
  border-radius: 10px;
  margin-top: 4px;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary + "99"};
`;

const Degree = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + "99"};
`;

const Date = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + "80"};
`;

const Grade = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + "99"};
`;

export default function EducationCard({
  education,
}: {
  education: EducationType;
}) {
  return (
    <Card>
      <Top>
        {education.img && <Image src={education.img} alt={education.school} />}
        <Body>
          <Name>{education.school}</Name>
          <Degree>{education.degree}</Degree>
          <Date>{education.date}</Date>
        </Body>
      </Top>
      {education.grade && (
        <Grade>
          <b>Grade: </b>
          {education.grade}
        </Grade>
      )}
      <Description>
        <Span>{education.desc}</Span>
      </Description>
    </Card>
  );
}
