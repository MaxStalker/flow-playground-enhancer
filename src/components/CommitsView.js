import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import Commit from "./Commit";
import {
  CommitsContainer,
  MainContainer,
  SectionHeader,
  Title,
  Empty
} from "./styles";
import { Action, Spinner } from "./Icons";
import NewCommit, { BlueText, BoxContainer } from "./NewCommit";
import { getBranch, getCode } from "../utils/playground";
import { settings } from "../models/Settings";
import BranchSelector from "./BranchSelector"
import FileSelector from "./FileSelector";

class CommitsView extends Component {
  showCommits = () => {
    const { commitList } = this.props;
    return commitList.commits.length > 0 ? (
      commitList.commits.map(commit => {
        return <Commit key={commit.hash} commit={commit} />;
      })
    ) : (
      <Empty>No commits for this file</Empty>
    );
  };

  render() {
    const { commitList, router, fileManager, settings } = this.props;
    const { loading, loadingFiles, createNew, fileList, fileListGroups } = commitList;
    const { currentBranch, branchList } = settings;
    const { setBranch } = settings;
    return (
      <MainContainer>
        <a id="gh-copy-code-injector" style={{ display: "none" }} />
        <textarea readOnly id="gh-code-replicator" style={{ display: "none" }} />

        <SectionHeader>
          <Title>Git Manager</Title>
          <Action
            icon={"settings"}
            onClick={() => {
              router.goTo("SETTINGS");
            }}
          />
        </SectionHeader>

        <BranchSelector/>
        <FileSelector/>

        <SectionHeader>
          <Title>Commits</Title>
        </SectionHeader>

        <NewCommit createNew={createNew} getCode={getCode} getBranch={getBranch} />
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

export default inject("commitList", "router", "settings", "fileManager")(observer(CommitsView));
