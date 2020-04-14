import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { LoadCommit } from "./Buttons/LoadCommit";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #dedede;
  p {
    margin: 0;
  }
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TextBlock = styled.div``;

const Message = styled.p`
  font-size: 16px;
  color: #6a6a6a;
  font-weight: 700;
`;
const Date = styled.p`
  font-size: 12px;
  color: #5c5c5c;
  font-weight: 400;
  margin-bottom: 1em !important;
`;

export const Commit = props => {
  const { commit, replace } = props;
  const { message, date, code } = commit;
  const { getCode, fetchAndReplace } = commit;
  return (
    <Container>
      <TextBlock>
        <Date>{date}</Date>
        <Message>{message}</Message>
      </TextBlock>
      <LoadCommit onClick={() => fetchAndReplace(replace)} />
    </Container>
  );
};

export default observer(Commit);
