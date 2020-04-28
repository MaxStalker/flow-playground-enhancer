import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Settings from "./Settings";
import CommitsView from "./CommitsView";
import Blank from "./Blank"

class AppRender extends Component {
  render() {
    const { router, settings } = this.props;
    const { view } = router;
    const { initialized } = settings;

    if (view === "COMMITS" && initialized) {
      return <CommitsView />;
    }

    if (view === "SETTINGS" || !initialized) {
      return <Settings />;
    }
  }
}

export default inject("commitList", "settings", "router", "fileManager")(observer(AppRender));
