import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";
import {
  BoxContainer,
  ButtonArea,
  Input,
  InputBlock,
  Label,
} from "./NewCommit";
import { storeAction, getCode, getBranch } from "../utils/playground";

let memoIndex = null;
class EditCommit extends Component {
  constructor(props) {
    super();
    memoIndex = props.fileManager.index;

    this.state = {
      message: "",
      code: "",
      flip: true,
    };
  }

  getCode = () => {
    const { uri } = document.querySelector(
      "#cadenceEditor .monaco-editor"
    ).dataset;
    const [_, editorIndex] = uri.split("inmemory://model");
    const copyCode = storeAction(editorIndex, "gh-code-replicator");
    const injector = document.getElementById("gh-copy-code-injector");
    injector.href = copyCode;
    injector.click();
    memoIndex = editorIndex;
  };

  componentDidMount() {
    this.getCode();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    setTimeout(() => {
      const { uri } = document.querySelector(
        "#cadenceEditor .monaco-editor"
      ).dataset;
      const [_, editorIndex] = uri.split("inmemory://model");
      if (editorIndex !== memoIndex) {
        this.getCode();
      }
    });
  }

  onChange = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  render() {
    const { message } = this.state;
    const { actions, commitList } = this.props;
    const { createNew } = commitList;
    const [reset, showProcessing] = actions;
    return (
      <BoxContainer>
        <InputBlock mb="20px">
          <Label>Commit Message:</Label>
          <Input
            onChange={this.onChange}
            value={message}
            placeholder={"Default: ISO timestamp"}
          />
        </InputBlock>
        <ButtonArea>
          <GreyButton onClick={reset}>Cancel</GreyButton>
          <GreenButton
            onClick={() => {
              const replicator = document.getElementById("gh-code-replicator");
              const code = replicator.value;

              showProcessing();
              if (code) {
                createNew(message, code, reset);
              } else {
                //TODO: show error maybe...
              }
            }}
          >
            Commit
          </GreenButton>
        </ButtonArea>
      </BoxContainer>
    );
  }
}

export default inject("commitList", "fileManager")(observer(EditCommit));
