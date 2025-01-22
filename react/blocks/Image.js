import React from "react";
import Dbm from "../../index.js";

export default class Image extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let url = Dbm.utils.UrlFunctions.createScaledImageUrl(Dbm.objectPath(this.context, "blockData.file"), 800);

        return this._createMainElement("div", {},
            React.createElement(Dbm.react.image.Image, {elementType: "img", className: "full-width", src: url, alt: Dbm.react.source.blockData("caption")} )
        )
    }
}