import Dbm from "../../../index.js";
import React from "react";

export default class ImageGallerySection extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let images = this.getPropValue("images");
        console.log("images>>>>>", images);
    }

    _removedUsedProps(aProps) {
        delete aProps["images"];
    }

    createLayout2(aImages, aSpacing = 20, aWidth = 800) {

        let width1 = aImages[0].width;
        let width2 = aImages[1].width;

        let height1 = aImages[0].height;
        let height2 = aImages[1].height;

        let minHeight = Math.min(height1, height2);
        let heightRatio1 = (minHeight / height1);
        let heightRatio2 = (minHeight / height2);

        let scaledWidth1 = width1*heightRatio1;
        let scaledWidth2 = width2*heightRatio2;

        let totalWidth = (scaledWidth1+scaledWidth2);
        let widthRatio1 = (scaledWidth1/totalWidth);
        let widthRatio2 = (scaledWidth2/totalWidth);

        let newWidth1 = (aWidth-aSpacing)*widthRatio1;
        let newWidth2 = (aWidth-aSpacing)*widthRatio2;

        let newHeight1 = (height1/width1)*newWidth1;
        let newHeight2 = (height2/width2)*newWidth2;

        console.log(newWidth1, newHeight1, newWidth2, newHeight2);

        let layout = React.createElement("div", {className: "flex-row"},
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth1, "height": newHeight1}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[0].url, "className": "full-size background-cover"})
            ),
            React.createElement("div", {className: "flex-row-item", style: {"width": aSpacing}}),
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth2, "height": newHeight2}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[1].url, "className": "full-size background-cover"})
            ),
        );

        return layout;
    }

    createLayout3(aImages, aSpacing = 20, aWidth = 800) {

        let width1 = aImages[0].width;
        let width2 = aImages[1].width;
        let width3 = aImages[2].width;

        let height1 = aImages[0].height;
        let height2 = aImages[1].height;
        let height3 = aImages[2].height;

        let minHeight = Math.min(height1, height2, height3);
        let heightRatio1 = (minHeight / height1);
        let heightRatio2 = (minHeight / height2);
        let heightRatio3 = (minHeight / height3);

        let scaledWidth1 = width1*heightRatio1;
        let scaledWidth2 = width2*heightRatio2;
        let scaledWidth3 = width3*heightRatio3;

        let totalWidth = (scaledWidth1+scaledWidth2+scaledWidth3);
        let widthRatio1 = (scaledWidth1/totalWidth);
        let widthRatio2 = (scaledWidth2/totalWidth);
        let widthRatio3 = (scaledWidth3/totalWidth);

        let newWidth1 = (aWidth-2*aSpacing)*widthRatio1;
        let newWidth2 = (aWidth-2*aSpacing)*widthRatio2;
        let newWidth3 = (aWidth-2*aSpacing)*widthRatio3;

        let newHeight1 = (height1/width1)*newWidth1;
        let newHeight2 = (height2/width2)*newWidth2;
        let newHeight3 = (height3/width3)*newWidth3;

        console.log(newWidth1, newHeight1, newWidth2, newHeight2, newWidth3, newHeight3);

        let layout = React.createElement("div", {className: "flex-row"},
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth1, "height": newHeight1}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[0].url, "className": "full-size background-cover"})
            ),
            React.createElement("div", {className: "flex-row-item", style: {"width": aSpacing}}),
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth2, "height": newHeight2}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[1].url, "className": "full-size background-cover"})
            ),
            React.createElement("div", {className: "flex-row-item", style: {"width": aSpacing}}),
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth3, "height": newHeight3}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[2].url, "className": "full-size background-cover"})
            ),
        );

        return layout;
    }

    createLayout4(aImages, aSpacing = 20, aWidth = 800) {
        let width1 = aImages[0].width;
        let width2 = aImages[1].width;
        let width3 = aImages[2].width;
        let width4 = aImages[3].width;

        let height1 = aImages[0].height;
        let height2 = aImages[1].height;
        let height3 = aImages[2].height;
        let height4 = aImages[3].height;

        let innerP = (height3/width3)/((height2/width2)+(height3/width3));

        let fullWidth = (aWidth-aSpacing);
        let p = (fullWidth*(height1/width1)-aSpacing+innerP*aSpacing*(height2/width2))/(fullWidth*((height4/width4)+innerP*(height2/width2)+(height1/width1)))

        let innerWidth = fullWidth*p-aSpacing;

        let newWidth1 = (1-p)*fullWidth;
        let newWidth2 = (innerWidth)*innerP;
        let newWidth3 = (innerWidth)*(1-innerP);
        let newWidth4 = (p)*fullWidth;

        let newHeight1 = (height1/width1)*newWidth1;
        let newHeight2 = (height2/width2)*newWidth2;
        let newHeight3 = (height3/width3)*newWidth3;
        let newHeight4 = (height4/width4)*newWidth4;

        let layout = React.createElement("div", {className: "flex-row"},
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth1, "height": newHeight1}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[0].url, "className": "full-size background-cover"})
            ),
            React.createElement("div", {className: "flex-row-item", style: {"width": aSpacing}}),
            React.createElement("div", {className: "flex-row-item"},
                React.createElement("div", {className: "flex-row"},
                    React.createElement("div", {className: "flex-row-item", style: {"width": newWidth2, "height": newHeight2}},
                        React.createElement(Dbm.react.image.Image, {"src": aImages[1].url, "className": "full-size background-cover"})
                    ),
                    React.createElement("div", {className: "flex-row-item", style: {"width": aSpacing}}),
                    React.createElement("div", {className: "flex-row-item", style: {"width": newWidth3, "height": newHeight3}},
                        React.createElement(Dbm.react.image.Image, {"src": aImages[2].url, "className": "full-size background-cover"})
                    ),
                ),
                React.createElement("div", {style: {"height": aSpacing}}),
                React.createElement("div", {className: "flex-row-item", style: {"width": newWidth4, "height": newHeight4}},
                    React.createElement(Dbm.react.image.Image, {"src": aImages[3].url, "className": "full-size background-cover"})
                ),
            ),
        );

        return layout;
    }

    _renderMainElement() {

        let images = this.getPropValue("images");
        let width = this.getPropValueWithDefault("width", 800);
        let spacing = this.getPropValueWithDefault("spacing", 20);

        let layout = null;
        switch(images.length) {
            case 2:
                layout = this.createLayout2(images, spacing, width);
                break;
            case 3:
                layout = this.createLayout3(images, spacing, width);
                break;
            case 4:
                layout = this.createLayout4(images, spacing, width);
                break;
        }

        return this._createMainElement("div", {},
            layout
        );
    }

    /*
    createLayout4(aImages, aSpacing = 20, aWidth = 800) {
        let width1 = aImages[0].width;
        let width2 = aImages[1].width;
        let width3 = aImages[2].width;
        let width4 = aImages[3].width;

        let height1 = aImages[0].height;
        let height2 = aImages[1].height;
        let height3 = aImages[2].height;
        let height4 = aImages[3].height;

        let innerP = (height2/width2)/((height1/width1)+(height2/width2));
        let innerWidth = aWidth-aSpacing;

        let newWidth1 = (innerWidth)*innerP;
        let newWidth2 = (innerWidth)*(1-innerP);

        let newHeight1 = (height1/width1)*newWidth1;
        let newHeight2 = (height2/width2)*newWidth2;

        console.log(innerP);

        let layout = React.createElement("div", {className: "flex-row"},
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth1, "height": newHeight1}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[0].url, "className": "full-size background-cover"})
            ),
            React.createElement("div", {className: "flex-row-item", style: {"width": aSpacing}}),
            React.createElement("div", {className: "flex-row-item", style: {"width": newWidth2, "height": newHeight2}},
                React.createElement(Dbm.react.image.Image, {"src": aImages[1].url, "className": "full-size background-cover"})
            ),
        );

        return layout;
    }
        */
}