import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {HashRouter, Route, Link} from 'react-router-dom';
import {DarkBox, TextStyle, SectionBase} from './helper'
import {About} from "./about";


const Wrapper = styled.section`
  padding: 4em; 
  background-image:url('./public/backgrounds/sky5.jpeg');
  background-size: cover;
  width: calc(100vw - 8em);
  height: calc(100vh - 8em);
  box-sizing: content-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(to bottom right,#000000, #000000);
    opacity: .6; 
  }
`;

const NameStyle = styled.section`
  font-family: 'Shadows Into Light', cursive;
  color: white;
  font-size: 10vh;
  @media (max-width: 700px) {
    font-size: 10vw;
  }
  @media (max-height: 300px) {
    font-size: 15vh;
  }
  padding: 8vh;
  display: block;
  word-wrap: break-word;
  width: auto;
  height: auto;
  display: table;
  white-space:normal;
  padding-bottom: 20px;
  border-bottom: 1px solid #FFFFFF;
  border-bottom-color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  text-align: center;
  margin: auto;
`;

const DescriptionStyle = styled.section`
  font-family: 'Shadows Into Light', cursive;
  color: white;
  font-size: 4vh;
  padding: 8vh;
  display: inline;
  word-wrap: break-word;
  width: 100vw;
  height: auto;
  display: table;
  white-space:normal;
  text-align: center;
  margin: auto;

`;

const NameDescBox = styled.section`
  justify-content: center;
  align: center;
  margin: auto;
  width: auto;
  height: auto;
  

`;

const LNStyle = styled.section`
  float: right
  width: 5vh;
  height: 5vh;
  margin-left: 5vw; 
  margin-top: 2vh;
  background-image:url('public/backgrounds/ln.png');
  background-size:cover;
`;

const TopNav = styled.section`
  ul {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 80px; 
    max-height: 20vh;
    background-color: #000000;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
    opacity: .6; 
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 70%);
  }
`;

const ME = styled.section`
  float: right;
  font-family: 'Shadows Into Light', cursive;
  color: gray;
  font-size: 5vh;
  padding-right: 15px;
  padding-left: 15px;
`;


const Home = p => <SectionBase>
  <NameDescBox>
    <NameStyle>
      Jeffrey Fenchel
    </NameStyle>
    <DescriptionStyle>
      Software Engineer, Data Enthusiast
    </DescriptionStyle>
  </NameDescBox></SectionBase>;


const MainPanel = styled.section`
  position: absolute;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
`;

ReactDOM.render(
  <div>
    <Wrapper/>
    <HashRouter>
      <MainPanel>
        <TopNav>
          <ul>
            <a href="https://www.linkedin.com/in/jeffreyfenchel/">
              <LNStyle/>
            </a>
            <ME><Link to="/about">About</Link></ME>
            <ME><Link to="/">Home</Link></ME>
          </ul>
        </TopNav>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </MainPanel>
    </HashRouter>
  </div>,
  document.getElementById('app')
);


module.hot.accept();