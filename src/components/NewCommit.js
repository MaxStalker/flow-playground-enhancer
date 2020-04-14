import React, { useState } from "react";
import styled from "styled-components";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";
import { Spinner } from "./Icons";

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #dedede;
`;

export const BoxContainer = styled.div`
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

export const ButtonArea = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
  box-sizing: border-box;
`;

export const BlueText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: blue;
  padding: 12px;
  p {
    margin: 0;
  }
  svg {
    fill: blue;
    margin-right: 5px;
  }
`;

export const Label = styled.p`
  margin: 0;
  margin-bottom: 5px;
  width: 100%;
  font-size: 14px;
`;

export const Input = styled.input.attrs((props) => ({
  type: props.type || "text",
}))`
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #a5a5a5;
`;

export const InputBlock = styled.div`
  width: 100%;
  margin-bottom: ${({ mb = "10px" }) => mb};

  &:last-child {
    margin-bottom: 20px;
  }
`;

const NewCommit = (props) => {
  const { createNew } = props;
  const [message, changeMessage] = useState("new commit");
  const [mode, selectMode] = useState("NEW");

  const onChange = (event) => {
    changeMessage(event.target.value);
  };

  const reset = () => {
    selectMode("NEW");
  };

  const showEdit = () => {
    selectMode("EDIT");
  };

  const showProcessing = () => {
    selectMode("PROCESSING");
  };

  const newCommit = () => {
    return (
      <BoxContainer>
        <GreenButton onClick={showEdit}>Create New Commit</GreenButton>
      </BoxContainer>
    );
  };

  const editCommit = () => {
    const { getCode, getBranch } = props;
    return (
      <BoxContainer>
        <InputBlock mb="20px">
          <Label>Commit Message:</Label>
          <Input onChange={onChange} value={message} />
        </InputBlock>
        <ButtonArea>
          <GreyButton onClick={reset}>Cancel</GreyButton>
          <GreenButton
            onClick={() => {
              showProcessing();
              // const message = "test message";
              const code = getCode();
              const branch = getBranch();
              if (code && branch) {
                const notEmptyMessage =
                  message.length > 0 ? message : new Date().toISOString();
                createNew(branch, notEmptyMessage, code);
              } else {
                //TODO: show error maybe...
              }
            }}
          >
            Commit
          </GreenButton>
        </ButtonArea>
      </BoxContainer>
    );
  };

  const processing = () => {
    return (
      <BoxContainer onClick={reset}>
        <BlueText>
          <Spinner />
          <p>Processing your commit...</p>
        </BlueText>
      </BoxContainer>
    );
  };

  return (
    <Container>
      {mode === "NEW" && newCommit()}
      {mode === "EDIT" && editCommit()}
      {mode === "PROCESSING" && processing()}
    </Container>
  );
};

export default NewCommit;
