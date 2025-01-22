import React from "react";
import Dbm from "../../index.js";

export default class Image extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let url = Dbm.objectPath(this.context, "blockData.file.url");

        let image = Dbm.objectPath(this.context, "blockData.file");

        if(image && image.resizeUrl) {
            let imageWidth = Math.round(window.devicePixelRatio*800);
            url = image.resizeUrl.split("{scale}").join("width=" + imageWidth);
        }

        return this._createMainElement("div", {},
            React.createElement(Dbm.react.image.Image, {elementType: "img", className: "full-width", src: url, alt: Dbm.react.source.blockData("caption")} )
        )
    }
}