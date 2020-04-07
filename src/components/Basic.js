import styled from "styled-components";

export const MainContainer = styled.div`
  width: 300px;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .with-theme &{
    background-color: var(--theme-editor-bg);
  }
`;

export const SectionHeader = styled.div`
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #919191;
  display: flex;
  position: relative;
  background-color: transparent;
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  flex-direction: column;
  margin-bottom: 1em;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  
  &:after {
    content: "";
    opacity: 0.5; 
    display: block;
    background: #00ff76;
    height: 3px;
    width: 1rem;
    border-radius: 3px;
    margin-top: 4px;
  }
  
  .withTheme &{
    background-color: var(--theme-header-bg);
  }
`;
