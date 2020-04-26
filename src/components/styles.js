import styled from "styled-components";

export const MainContainer = styled.div`
  width: 300px;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${({ grid }) => {
    if (grid) {
      return `
        display: grid;
        grid-template-rows: auto auto 1fr;
        grid-template-columns: 100%;
      `;
    }
  }}

  .with-theme & {
    background-color: var(--theme-editor-bg);
  }
`;

export const SelectContainer = styled.div`
  width: 100%;
  padding: 0 1rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
`;

export const Title = styled.div`
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #919191;
  display: flex;
  position: relative;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

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

  .withTheme & {
    background-color: var(--theme-header-bg);
  }
`;

export const BranchSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #dedede;
`;

export const CommitsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  width: 100%;
  color: #aaa;
`;
