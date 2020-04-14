import React, { useState } from "react";
import { MainContainer, SectionHeader, Title } from "./styles";
import { Action } from "./Icons";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import { ButtonArea, InputBlock, Input, Label } from "./NewCommit";
import { GreenButton, GreyButton } from "./Buttons/BasicButton";

const SettingsContainer = styled.div`
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
`;

const Settings = props => {
  const { router, settings } = props;
  const { initialized, repoOwner, repoName, token } = settings;
  const { setToken, setRepoOwner, setRepoName } = settings;

  const [owner, changeOwner] = useState(repoOwner);
  const [name, changeName] = useState(repoName);
  const [tokenValue, changeToken] = useState(token);

  const handleOwner = event => {
    changeOwner(event.target.value);
  };

  const handleName = event => {
    changeName(event.target.value);
  };

  const handleToken = event => {
    changeToken(event.target.value);
  };

  const save = () => {
    setRepoOwner(owner);
    setRepoName(name);
    setToken(tokenValue);
    if (initialized) {
      router.goTo("COMMITS");
    }
  };

  const goBack = () => {
    router.goTo("COMMITS");
  };

  return (
    <MainContainer>
      <SectionHeader>
        <Title>Settings</Title>
        <Action disabled={!initialized} icon={"close"} onClick={goBack} />
      </SectionHeader>
      <SettingsContainer>
        <InputBlock>
          <Label>Repository Owner</Label>
          <Input value={owner} onChange={handleOwner} />
        </InputBlock>

        <InputBlock>
          <Label>Repository Name</Label>
          <Input value={name} onChange={handleName} />
        </InputBlock>

        <InputBlock mb="32px">
          <Label>Access Token</Label>
          <Input value={tokenValue} onChange={handleToken} type="password" />
        </InputBlock>

        <ButtonArea>
          <GreyButton disabled={!initialized} onClick={goBack}>
            Cancel
          </GreyButton>
          <GreenButton onClick={save}>Save</GreenButton>
        </ButtonArea>
      </SettingsContainer>
    </MainContainer>
  );
};

export default inject("settings", "router")(observer(Settings));
