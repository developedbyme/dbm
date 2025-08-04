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
        delete aProps["skipWindowSize"];
    }

    _renderMainElement() {

        let image = this.getPropValue("image");
        let width = this.getPropValue("targetWidth");
        let height = this.getPropValue("targetHeight");
        let url;
        
        if(this.getPropValue("skipWindowSize")) {
            url = Dbm.utils.UrlFunctions.createCoverScaledImageUrlWithPixelDensity(image, width, height, Math.floor(window.devicePixelRatio), 10000);
        }
        else {
            url = Dbm.utils.UrlFunctions.createCoverScaledImageUrl(image, width, height);
        }
        

        let newProps = this._copyProps({src: url});

        let altText = Dbm.objectPath(image, "altText");
        if(altText) {
            newProps["alt"] = altText;
        }

        let elementType = this.getPropValue("elementType");
        if(elementType) {
            newProps["elementType"] = elementType;

            if(elementType === "img" && Dbm.utils.UrlFunctions.imageShouldScale(image)) {

                let images = [];
                images.push(Dbm.utils.UrlFunctions.createCoverScaledImageUrlWithPixelDensity(image, width, height, 1, 10000) + " 1x");
                images.push(Dbm.utils.UrlFunctions.createCoverScaledImageUrlWithPixelDensity(image, width, height, 2, 10000) + " 2x");
                images.push(Dbm.utils.UrlFunctions.createCoverScaledImageUrlWithPixelDensity(image, width, height, 3, 10000) + " 3x");

                newProps["srcset"] = images.join(", ");
            }
        }
        
        return React.createElement(Dbm.react.image.Image, newProps, this.getPropValue("children"));
        
    }
}