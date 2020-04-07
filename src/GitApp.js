import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MainContainer, SectionHeader } from "./components/Basic";
import { Switch } from "./components/Switch";

class PortalBlock extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    const { portalId } = this.props;
    const node = document.getElementById(portalId);
    console.log(node);
    node.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return createPortal(this.props.children, this.el);
  }
}

export default function GitApp() {
  const [showGit, toggle] = useState(true);
  const toggleGit = () => {
    toggle(!showGit);
    const gridGit = document.getElementById("grid-git");
    gridGit.classList.toggle("grid-git-hide");
  };
  return (
    <MainContainer>
      <SectionHeader>Commits</SectionHeader>
      <PortalBlock portalId="git-portal">
        <Switch active={showGit} onClick={toggleGit} label="Git" />
      </PortalBlock>
    </MainContainer>
  );
}
