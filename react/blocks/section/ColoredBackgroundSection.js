import React from "react";
import Dbm from "../../../index.js";

export default class ColoredBackgroundSection extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        
    }

    _renderMainElement() {

      let color = Dbm.objectPath(this.context, "blockData.color");
      let skipSpacing = Dbm.objectPath(this.context, "blockData.skipSpacing");

      let style = {

      }

      if(color) {
        style["backgroundColor"] = color;
      }

      let spacingElement = skipSpacing ? null : React.createElement("div", {"className": "spacing double"});

      return React.createElement("div", {className: "colored-background-section", style: style},
        spacingElement,
        this.getPropValue("children"),
        spacingElement
      );
    }
}