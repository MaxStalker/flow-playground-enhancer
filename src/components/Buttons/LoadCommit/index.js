import React from "react";
import styled from "styled-components"
import { ArrowDown } from "../../Icons";

const Button = styled.button`
  background-color: #dedede;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  svg {
    fill: #969696;
  }

  &:hover {
    background-color: #00fb83;
    svg {
      fill: #065630;
    }
  }
`;

export const LoadCommit = (props) => {
  const { onClick } = props;
  return (
    <Button onClick={onClick}>
      <ArrowDown />
    </Button>
  );
};
