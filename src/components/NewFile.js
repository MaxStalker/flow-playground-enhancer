import React, { useState, useRef, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";
import { BoxContainer, ButtonArea, Input, InputBlock, Label } from "./NewCommit";
import { Error } from "./NewBranch";
import {getCode} from "../utils/playground";

const validate = (value, data, pristine) => {
  if (value === "" && !pristine) {
    return {
      message: "File name can't be empty"
    };
  }
  return {};
};

const NewFile = props => {
  const { cancel, commitList } = props;
  const { createNew, commitProcess, isCommiting } = commitList;
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
    getCode();
    const replicator = document.getElementById("gh-code-replicator");
    const code = replicator.value;
    const fullName = name.includes('.cdc') ? name : `${name}.cdc`;
    console.log({code});
    // TODO: BUG - code is not correctly copied
    createNew("Initial commit", code, cancel, fullName);

    // TODO: fetch updated list after
  };

  const error = validate(name, {}, pristine);
  const inputMargin = error ? "0.5rem" : 0;
  return (
    <BoxContainer>
      <InputBlock>
        <Label>New File Name</Label>
        <Input ref={inputRef} mb={inputMargin} value={name} onChange={handleChange} />
        {error && <Error>{error.message}</Error>}
      </InputBlock>
      {isCommiting ? (
        <p>{commitProcess}</p>
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

export default inject("commitList")(observer(NewFile));
