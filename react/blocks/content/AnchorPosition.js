import React from "react";
import Dbm from "../../../index.js";

export default class AnchorPosition extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {
      return React.createElement("div", {"id": this.context.blockData.linkName});
    }
}