import React, { useState } from "react";
import { observer, inject } from "mobx-react";
import Select from "react-select";
import { BoxContainer, InputBlock, Label } from "./NewCommit";
import { GreenButton } from "./Buttons/BasicButton";
import NewFile from "./NewFile";

const FileSelector = props => {
  const { settings } = props;
  // const { currentBranch, branchList, loadingBranches } = settings;
  // const { setBranch } = settings;

  // State
  const [mode, setMode] = useState("SHOW");

  // Actions
  const toggleEdit = () => setMode("EDIT");
  const toggleShow = () => setMode("SHOW");

  return mode === "SHOW" ? (
    <BoxContainer>
      <InputBlock>
        <GreenButton onClick={toggleEdit} title="Create New File">
          Create File
        </GreenButton>
      </InputBlock>

      <InputBlock>
        <Label>Active File</Label>
        <p>Show file selector here</p>
      </InputBlock>
    </BoxContainer>
  ) : (
    <NewFile cancel={toggleShow} />
  );
};

export default inject("settings", "commitList")(observer(FileSelector));
