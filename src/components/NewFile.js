import React, { useState, useRef, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";
import { BoxContainer, ButtonArea, Input, InputBlock, Label } from "./NewCommit";
import { Error } from "./NewBranch";
import { getCode } from "../utils/playground";

const validate = (value, {filenameExists}, pristine) => {
  // TODO: check filename with and without extension
  //  use find or includes maybe?..

  if (filenameExists(value)){
    return {
      message: "File with this name already exists"
    }
  }

  if (value === "" && !pristine) {
    return {
      message: "File name can't be empty"
    };
  }
  return {};
};

const NewFile = props => {
  const { cancel, commitList, fileManager } = props;
  const { createNew, commitProcess, isCommiting } = commitList;
  const { fetchFileList } = commitList;
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

    // NOTE: This is hacky, but editor update is differed, so this is the only
    // solution that I found consistently working
    setTimeout(async () => {
      const replicator = document.getElementById("gh-code-replicator");
      let code = replicator.value;
      const fullName = name.includes(".cdc") ? name : `${name}.cdc`;
      await createNew("Initial commit", code, cancel, fullName);
      await fetchFileList();
      fileManager.updateFilename(fullName);
      // TODO: select newly created file
    }, 100);
  };

  const error = validate(name, commitList, pristine);
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

export default inject("commitList", "fileManager")(observer(NewFile));
