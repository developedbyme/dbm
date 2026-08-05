import React from "react";
import Dbm from "../../index.js";

export default class SiteContent extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let contentBlockId = this.context.moduleData.contentBlock;

        return this._createMainElement("div", {"className": "default-text-formatting"},
            React.createElement(Dbm.react.blocks.content.ContentBlock, {"id": contentBlockId})
        );
    }
}