import React, { useState } from "react";
import { observer, inject } from "mobx-react";
import Select from "react-select";
import { BoxContainer, ButtonArea, Input, InputBlock, Label, TwoItems } from "./NewCommit";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";
import NewBranch from "./NewBranch";
import { ButtonIcon } from "./Icons";
import { controlHeight, selectStyles } from "./shared";

const BranchSelector = props => {
  const { settings } = props;
  const { currentBranch, branchList, loadingBranches } = settings;
  const { setBranch } = settings;

  // State
  const [mode, setMode] = useState("SHOW");

  // Actions
  const toggleEdit = () => setMode("EDIT");
  const toggleShow = () => setMode("SHOW");

  if (loadingBranches) {
    return <p>Loading branch list, please wait...</p>;
  }

  return mode === "SHOW" ? (
    <BoxContainer>
      {branchList.length > 0 ? (
        <TwoItems>
          <InputBlock mb={0}>
            <Label>Branch:</Label>
            <Select
              isSearchable={true}
              width={"100%"}
              options={branchList}
              value={currentBranch}
              onChange={({ value }) => {
                setBranch(value);
              }}
              styles={selectStyles}
            />
          </InputBlock>
          <GreenButton onClick={toggleEdit} title="Create New Branch" height={controlHeight} p={0}>
            <ButtonIcon name="new-branch" />
          </GreenButton>
        </TwoItems>
      ) : (
        <InputBlock>
          <GreenButton onClick={toggleEdit} title="Create New Branch">
            <ButtonIcon name="new-branch" mr="8px" /> Create Branch
          </GreenButton>
        </InputBlock>
      )}
    </BoxContainer>
  ) : (
    <NewBranch cancel={toggleShow} />
  );
};

export default inject("settings", "commitList")(observer(BranchSelector));
