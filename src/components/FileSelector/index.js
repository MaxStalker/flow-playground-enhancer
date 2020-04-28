import React, { useState } from "react";
import { observer, inject } from "mobx-react";
import Select from "react-select";
import { BoxContainer, InputBlock, Label, TwoItems } from "../NewCommit";
import { GreenButton } from "../Buttons/BasicButton";
import { ButtonIcon } from "../Icons";
import { controlHeight, selectStyles } from "../shared";
import NewFile from "../NewFile";

const FileSelector = props => {
  const { commitList, fileManager } = props;
  const { loadingFiles, fileList, fileListGroups } = commitList;

  // State
  const [mode, setMode] = useState("SHOW");

  // Actions
  const toggleEdit = () => setMode("EDIT");
  const toggleShow = () => setMode("SHOW");

  if (loadingFiles) {
    return <p>Loading files, please wait...</p>;
  }

  return mode === "SHOW" ? (
    <BoxContainer>
      {fileList.length > 0 ? (
        <TwoItems>
          <InputBlock mb={0}>
            <Label>Active File</Label>
            <Select
              value={{
                value: fileManager.filename,
                label: fileManager.filename
              }}
              isSearchable={true}
              options={fileListGroups}
              width={"100%"}
              onChange={({ value }) => {
                fileManager.updateFilename(value);
              }}
              styles={selectStyles}
            />
          </InputBlock>
          <GreenButton onClick={toggleEdit} title="Create New File" height={controlHeight} p={0}>
            <ButtonIcon name="new-file" />
          </GreenButton>
        </TwoItems>
      ) : (
        <InputBlock>
          <GreenButton onClick={toggleEdit} title="Create New File">
            <ButtonIcon name="new-file" mr="8px" /> New File
          </GreenButton>
        </InputBlock>
      )}
    </BoxContainer>
  ) : (
    <NewFile cancel={toggleShow} />
  );
};

export default inject("commitList", "fileManager")(observer(FileSelector));
