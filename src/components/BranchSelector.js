import React, { useState } from "react";
import { observer, inject } from "mobx-react";
import Select from "react-select";
import { BoxContainer, ButtonArea, Input, InputBlock, Label } from "./NewCommit";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";
import NewBranch from "./NewBranch";

const BranchSelector = props => {
  const { settings } = props;
  const { currentBranch, branchList, loadingBranches } = settings;
  const { setBranch } = settings;

  // State
  const [mode, setMode] = useState("SHOW");

  // Actions
  const toggleEdit = () => setMode("EDIT");
  const toggleShow = () => setMode("SHOW");

  return mode === "SHOW" ? (
    <BoxContainer>
      <InputBlock>
        <GreenButton onClick={toggleEdit} title="Create New Branch">
          Create Branch
        </GreenButton>
      </InputBlock>

      <InputBlock>
        <Label>Active Branch</Label>
        {loadingBranches && <p>Loading branch list, please wait...</p>}
        {!loadingBranches && branchList.length > 0 && (
          <Select
            isSearchable={true}
            width={"100%"}
            options={branchList}
            value={currentBranch}
            onChange={({ value }) => {
              setBranch(value);
            }}
          />
        )}
      </InputBlock>
    </BoxContainer>
  ) : (
    <NewBranch cancel={toggleShow} />
  );
};

export default inject("settings", "commitList")(observer(BranchSelector));
