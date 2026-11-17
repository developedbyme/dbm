import React from "react";
import Dbm from "../../../index.js";

export default class ColoredBackgroundSection extends Dbm.react.blocks.BaseObject {

    static BLOCK_IDENTIFIER = "dbm/v1/section/coloredBackgroundSection";

    _construct() {
        super._construct();

        
    }

    _renderMainElement() {

      let color = Dbm.objectPath(this.context, "blockData.color");
      let skipSpacing = Dbm.objectPath(this.context, "blockData.skipSpacing");

      let blocks = Dbm.objectPath(this.context, "blockData.content.blocks");

      let pageContent = Dbm.getRepositoryItem("contentBlock").element;

      let content = blocks ? Dbm.react.AddProps.el({blocks: blocks}, pageContent) : React.createElement("div", {"data-error": "no blocks set"});

      

      let style = {

      }

      if(color) {
        style["backgroundColor"] = color;
      }

      let spacingElement = skipSpacing ? null : React.createElement("div", {"className": "spacing double"});

      return React.createElement("div", {className: "colored-background-section", style: style},
        spacingElement,
        content,
        spacingElement
      );
    }
}