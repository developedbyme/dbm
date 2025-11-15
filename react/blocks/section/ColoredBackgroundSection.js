import React from "react";
import Dbm from "../../../index.js";

export default class ColoredBackgroundSection extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        
    }

    _renderMainElement() {

      let color = Dbm.objectPath(this.context, "blockData.color");

      let style = {

      }

      if(color) {
        style["backgroundColor"] = color;
      }

      return React.createElement("div", {className: "colored-background-section", style: style},
        this.getPropValue("children")
      );
    }
}