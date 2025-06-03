import React from "react";
import Dbm from "../../../index.js";

export default class ImageGallery extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let elementSize = new Dbm.flow.updatefunctions.dom.ElementSize();
        this.item.setValue("elementSize", elementSize);
        
        elementSize.input.properties.element.connectInput(this.item.requireProperty("mainElement", null));
        elementSize.start();

        {
            let heightRatio = Dbm.flow.updatefunctions.logic.multiply(elementSize.output.properties.width, 0.5);
            let styleObject = new Dbm.flow.updatefunctions.dom.StyleObject();
            styleObject.addProperty("height", heightRatio.output.properties.result, "px");
            this.item.propertyInput("halfHeightStyle", styleObject.output.properties.style);
        }
        
        {
            let styleObject = new Dbm.flow.updatefunctions.dom.StyleObject();
            styleObject.addProperty("height", elementSize.output.properties.width, "px");
            this.item.propertyInput("fullHeightStyle", styleObject.output.properties.style);
        }

        {
            let heightRatio = Dbm.flow.updatefunctions.logic.multiply(elementSize.output.properties.width, 3/4);
            let styleObject = new Dbm.flow.updatefunctions.dom.StyleObject();
            styleObject.addProperty("height", heightRatio.output.properties.result, "px");
            this.item.propertyInput("fourThreeHeightStyle", styleObject.output.properties.style);
        }

        {
            let heightRatio = Dbm.flow.updatefunctions.logic.multiply(elementSize.output.properties.width, 1/3);
            let styleObject = new Dbm.flow.updatefunctions.dom.StyleObject();
            styleObject.addProperty("height", heightRatio.output.properties.result, "px");
            this.item.propertyInput("thirdHeightStyle", styleObject.output.properties.style);
        }

        let mobileLayout = React.createElement("div", null, /*#__PURE__*/React.createElement(Dbm.react.BaseObject, {
            style: this.item.properties.fullHeightStyle
          }, /*#__PURE__*/React.createElement(Dbm.react.image.CoverScaledImage, {
            image: Dbm.react.source.blockData("image1"),
            targetWidth: 600,
            targetHeight: 600,
            className: "full-size background-cover"
          })), /*#__PURE__*/React.createElement("div", {
            className: "spacing small"
          }), /*#__PURE__*/React.createElement(Dbm.react.BaseObject, {
            className: "flex-row small-item-spacing halfs",
            style: this.item.properties.thirdHeightStyle
          }, /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item"
          }, /*#__PURE__*/React.createElement("div", {
            className: "full-size placeholder-background"
          }, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            image: Dbm.react.source.blockData("image2"),
            targetWidth: 300,
            className: "full-size background-cover"
          }))), /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item"
          }, /*#__PURE__*/React.createElement("div", {
            className: "full-size placeholder-background"
          }, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            image: Dbm.react.source.blockData("image3"),
            targetWidth: 300,
            className: "full-size background-cover"
          })))), /*#__PURE__*/React.createElement("div", {
            className: "spacing small"
          }), /*#__PURE__*/React.createElement(Dbm.react.BaseObject, {
            style: this.item.properties.fourThreeHeightStyle
          }, /*#__PURE__*/React.createElement(Dbm.react.image.CoverScaledImage, {
            image: Dbm.react.source.blockData("image4"),
            targetWidth: 600,
            targetHeight: 450,
            className: "full-size background-cover"
          })));

        let desktopLayout = React.createElement(Dbm.react.BaseObject, {
            className: "flex-row small-item-spacing halfs",
            style: this.item.properties.halfHeightStyle
          }, /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item"
          }, /*#__PURE__*/React.createElement("div", {
            className: "full-size placeholder-background"
          }, /*#__PURE__*/React.createElement(Dbm.react.image.CoverScaledImage, {
            image: Dbm.react.source.blockData("image1"),
            targetWidth: 530,
            targetHeight: 530,
            className: "full-size background-cover"
          }))), /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item flex-column small-item-spacing"
          }, /*#__PURE__*/React.createElement("div", {
            className: "flex-column-item flex-resize"
          }, /*#__PURE__*/React.createElement("div", {
            className: "flex-row small-item-spacing halfs full-height"
          }, /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item"
          }, /*#__PURE__*/React.createElement("div", {
            className: "full-size placeholder-background"
          }, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            image: Dbm.react.source.blockData("image2"),
            targetWidth: 260,
            className: "full-size background-cover"
          }))), /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item"
          }, /*#__PURE__*/React.createElement("div", {
            className: "full-size placeholder-background"
          }, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            image: Dbm.react.source.blockData("image3"),
            targetWidth: 260,
            className: "full-size background-cover"
          }))))), /*#__PURE__*/React.createElement("div", {
            className: "flex-column-item flex-no-resize"
          }, /*#__PURE__*/React.createElement(Dbm.react.BaseObject, {
            className: "full-size placeholder-background",
            style: this.item.properties.thirdHeightStyle
          }, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            image: Dbm.react.source.blockData("image4"),
            targetWidth: 530,
            className: "full-size background-cover"
          })))));

        this.responsiveLayout = Dbm.react.area.responsiveLayout(mobileLayout).addLayout(desktopLayout, 600);
    }

    _renderMainElement() {

        return React.createElement("div", {
            className: "centered-site"
          }, /*#__PURE__*/React.createElement("div", {
            ref: this.createRef("mainElement")
          }, this.responsiveLayout.mainElement));
    }
}