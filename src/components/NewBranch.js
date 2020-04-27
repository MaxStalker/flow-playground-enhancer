import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
import { BoxContainer, ButtonArea, Input, InputBlock, Label } from "./NewCommit";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";

const Error = styled.p`
  font-size: 12px;
  color: red;
`;

const validate = (name, { branches }, pristine) => {
  const branchExists = branches.includes(name);
  if (branchExists) {
    return {
      message: "Branch already exists"
    };
  }

  if (name === "" && !pristine) {
    return {
      message: "Name can't be empty"
    };
  }

  return {};
};

const NewBranch = props => {
  const { cancel, settings } = props;
  const { branches } = settings;
  const { createNewBranch, creationMessage, creatingBranch } = settings;
  const [name, setName] = useState("");
  const [pristine, setPristine] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleChange = event => {
    setPristine(false);
    setName(event.target.value);
  };

  const submit = () => {
    createNewBranch(name, cancel);
  };

  const error = validate(name, { branches }, pristine);
  const inputMargin = error ? "0.5rem" : 0;
  return (
    <BoxContainer>
      <InputBlock>
        <Label>Branch Name</Label>
        <Input ref={inputRef} mb={inputMargin} value={name} onChange={handleChange} />
        {error && <Error>{error.message}</Error>}
      </InputBlock>

      {creatingBranch ? (
        <p>{creationMessage}</p>
      ) : (
        <ButtonArea>
          <GreyButton onClick={cancel}>Cancel</GreyButton>
          <GreenButton disabled={error.message || pristine} onClick={submit}>
            Create
          </GreenButton>
        </ButtonArea>
      )}
    </BoxContainer>
  );
};

export default inject("settings")(observer(NewBranch));
