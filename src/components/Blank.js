import React from "react";
import { Empty, MainContainer, SectionHeader, Title } from "./styles";

const Blank = () => {
  return (
    <MainContainer>
      <SectionHeader>
        <Title>Instructions</Title>
      </SectionHeader>
      <Empty>In order to use Git, please save the project first</Empty>
    </MainContainer>
  );
};

export default Blank;
