import {DarkBox, ContentBox, TextStyle, SectionBase} from "./helper";
import React from 'react';
import styled from 'styled-components';
import { Follow, Mention } from 'react-twitter-widgets'


const ProfilePic = styled.section`
  width: 20vh;
  height: 30vh;
  background-image:url('./public/backgrounds/jeffbwsmall.jpg');
  background-size: cover;
  opacity: 2;
  border-radius: 50%;
  margin-left: 5vw;
  margin-right: 5vw;
  justify-content: center;
  top: 0;
  bottom: 0;
`;


const MainColumnSeperator = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

const CenterBlock = styled.section`
  right: 0;
  left: 0;
  flex: 1;
`;

const AboutTextStyle = styled.section`
  opacity: 1;
  color: white;
  text-align: center;
  font-size: 1.5vw;
`;

const SpacedElement = styled.section`
  padding: 1vw;
`;


export const About = p => <SectionBase>
  <DarkBox/>
  <ContentBox>
    <MainColumnSeperator>
      <ProfilePic/>
      <CenterBlock>
        <AboutTextStyle>
          <p>Hello! Thanks for visiting! I am software engineer and data enthusiast
          passionate about enablement through continuous pipelines, developing
          and taming distributed systems, streaming data pipelines, and NLP through
          continuous measurement and testing. I recently started applying my platform
            and devops engineering experience to data science while also exploring data visualization.</p>
          <p>
            This is the home of my meanderings. Hopefully I will get
            around to adding blog posts soon!
          </p>
        </AboutTextStyle>
        <MainColumnSeperator>
        <SpacedElement>
        <Follow username="jfenc91" options={{ showCount: false }}/> 
        </SpacedElement>
      <SpacedElement>
        <Mention username="jfenc91"/> 
      </SpacedElement>
        </MainColumnSeperator>
      </CenterBlock>
    </MainColumnSeperator>
  </ContentBox>
</SectionBase>;
