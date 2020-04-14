import React, { Component } from "react";
import { createPortal } from "react-dom";
import { Provider, inject, observer } from "mobx-react";
import { Switch } from "./components/Switch";
import AppRender from "./components/AppRender";
import { store } from "./models";

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

class GitApp extends Component {
  state = {
    showGit: true
  };

  toggleGit = () => {
    this.setState({ showGit: !this.state.showGit });
    const gridGit = document.getElementById("grid-git");
    gridGit.classList.toggle("grid-git-hide");
  };

  render() {
    const { showGit } = this.state;
    return (
      <Provider {...store}>
        <AppRender />
        <PortalBlock portalId="git-portal">
          <Switch active={showGit} onClick={this.toggleGit} label="Git" />
        </PortalBlock>
      </Provider>
    );
  }
}

export default GitApp;
