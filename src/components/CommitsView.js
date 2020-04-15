import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import Commit from "./Commit";
import {
  CommitsContainer,
  MainContainer,
  SectionHeader,
  Title,
} from "./styles";
import { Action, Spinner } from "./Icons";
import NewCommit, { BlueText, BoxContainer, InputBlock } from "./NewCommit";
import { getBranch, getCode } from "../utils/playground";

class CommitsView extends Component {
  componentDidMount() {
    const { commitList, settings } = this.props;
    const { initialized } = settings;
    if (initialized) {
      commitList.fetchList();
    }
  }

  showCommits = () => {
    const { commitList } = this.props;
    return commitList.commits.length > 0 ? (
      commitList.commits.map((commit) => {
        return (
          <Commit
            key={commit.hash}
            commit={commit}
            replace={(code) => {
              console.log("Commit code is:", code);
            }}
          />
        );
      })
    ) : (
      <p>No commits for this file</p>
    );
  };

  render() {
    const { commitList, router, fileManager } = this.props;
    const { isLoaded, createNew } = commitList;
    const { branch, fileName } = fileManager;
    return (
      <MainContainer>
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
        <NewCommit
          createNew={createNew}
          getCode={getCode}
          getBranch={getBranch}
        />
        <CommitsContainer>
          {isLoaded ? (
            this.showCommits()
          ) : (
            <BoxContainer>
              <BlueText>
                <Spinner />
                <p>Loading commits...</p>
              </BlueText>
            </BoxContainer>
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
