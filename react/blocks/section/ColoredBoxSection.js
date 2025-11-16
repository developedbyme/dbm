import React from "react";
import Dbm from "../../../index.js";

export default class ColoredBoxSection extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        
    }

    _renderMainElement() {

      let color = Dbm.objectPath(this.context, "blockData.color");
      let invertText = Dbm.objectPath(this.context, "blockData.invertText");

      let style = {

      }

      if(color) {
        style["backgroundColor"] = color;
      }

      let textClass = invertText ? "dark-background-text" : "";

      return React.createElement("div", {className: "centered-site colored-box-section colored-box-section-padding " + textClass, style: style},
        this.getPropValue("children"),
      );
    }
}