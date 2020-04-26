import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import Select from "react-select";
import Commit from "./Commit";
import {
  CommitsContainer,
  MainContainer,
  SectionHeader,
  SelectContainer,
  Title,
  Empty,
} from "./styles";
import { Action, Spinner } from "./Icons";
import NewCommit, { BlueText, BoxContainer, InputBlock } from "./NewCommit";
import { getBranch, getCode } from "../utils/playground";

class CommitsView extends Component {
  async componentDidMount() {
    const { commitList, settings } = this.props;
    const { initialized } = settings;
    if (initialized) {
      await commitList.fetchFileList();
    }
  }

  showCommits = () => {
    const { commitList } = this.props;
    return commitList.commits.length > 0 ? (
      commitList.commits.map((commit) => {
        return <Commit key={commit.hash} commit={commit} />;
      })
    ) : (
      <Empty>No commits for this file</Empty>
    );
  };

  render() {
    const { commitList, router, fileManager } = this.props;
    const {
      loading,
      createNew,
      fileList,
      fileListGroups,
      defaultValue,
    } = commitList;
    return (
      <MainContainer>
        <a id="gh-copy-code-injector" style={{ display: "none" }} />
        <textarea
          readOnly
          id="gh-code-replicator"
          style={{ display: "none" }}
        />
        <SectionHeader>
          <Title>Commits</Title>
          <Action
            icon={"settings"}
            onClick={() => {
              router.goTo("SETTINGS");
            }}
          />
        </SectionHeader>
        {fileList.length > 0 && (
          <SelectContainer>
            <Select
              value={{
                value: fileManager.filename,
                label: fileManager.filename,
              }}
              isSearchable={true}
              options={fileListGroups}
              width={"100%"}
              onChange={({ value }) => {
                fileManager.updateFilename(value);
              }}
            />
          </SelectContainer>
        )}
        <NewCommit
          createNew={createNew}
          getCode={getCode}
          getBranch={getBranch}
        />
        <CommitsContainer>
          {loading ? (
            <BoxContainer>
              <BlueText>
                <Spinner />
                <p>Loading commits...</p>
              </BlueText>
            </BoxContainer>
          ) : (
            this.showCommits()
          )}
        </CommitsContainer>
      </MainContainer>
    );
  }
}

export default inject(
  "commitList",
  "router",
  "settings",
  "fileManager"
)(observer(CommitsView));
