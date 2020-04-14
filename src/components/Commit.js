import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import {LoadCommit} from "./Buttons/LoadCommit"

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #dedede;
  p{
    margin: 0;
  }
  &:hover{
    background-color: #F5F5F5;
  }
`;

const TextBlock = styled.div`
  
`

const Message = styled.p`
  font-size: 16px;
  font-color: #6A6A6A;
  font-weight: 700;
`;
const Date = styled.p`
  font-size: 12px;
  font-color: #5C5C5C;
  font-weight: 400;
`;

export const Commit = (props) => {
  const { commit, replace } = props;
  const { message, date, code } = commit;
  const { getCode, fetchAndReplace } = commit;
  return (
    <Container>
      <TextBlock>
        <Date>{date}</Date>
        <Message>{message}</Message>
      </TextBlock>
      <LoadCommit onClick={() => fetchAndReplace(replace)}/>
    </Container>
  );
};

export default observer(Commit);
