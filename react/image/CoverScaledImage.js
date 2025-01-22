import Dbm from "../../index.js";
import React from "react";

export default class CoverScaledImage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _removedUsedProps(aProps) {
        delete aProps["image"];
        delete aProps["targetWidth"];
        delete aProps["targetHeight"];
    }

    _renderMainElement() {

        let image = this.getPropValue("image");
        let width = this.getPropValue("targetWidth");
        let height = this.getPropValue("targetHeight");
        let url = Dbm.utils.UrlFunctions.createCoverScaledImageUrl(image, width, height);

        let newProps = this._copyProps({src: url});

        let elementType = this.getPropValue("elementType");
        if(elementType) {
            newProps["elementType"] = elementType;
        }
        
        return React.createElement(Dbm.react.image.Image, newProps, this.getPropValue("children"));
        
    }
}