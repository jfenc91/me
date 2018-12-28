import styled from 'styled-components';

export const DarkBox = styled.section`
  border-radius: 25px;
  background: #000000;
  opacity: .6;
  padding: 20px; 
  width: 80vw;
  height: 70vh; 
  margin: auto;
  margin-top: 20vh;
`;

export const ContentBox = styled.section`
  position: absolute
  justify-content: center;
  left: 0;
  right: 0;
  display: inline-block
  border-radius: 25px;
  padding: 20px; 
  width: 80vw;
  height: 70vh; 
  margin: auto;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20vh;
`;

export const TextStyle = styled.section`
  opacity: 1;
  color: white;
  text-align: center;
`;

export const SectionBase = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
