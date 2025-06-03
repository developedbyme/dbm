import React from "react";
import Dbm from "../../../index.js";

export default class DoubleImage extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let mobileLayout = React.createElement("div", null, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            elementType: "img",
            image: Dbm.react.source.blockData("image1"),
            targetWidth: 530,
            className: "full-width"
          }), /*#__PURE__*/React.createElement("div", {
            className: "spacing small"
          }), /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            elementType: "img",
            image: Dbm.react.source.blockData("image2"),
            targetWidth: 530,
            className: "full-width"
          }));

        let desktopLayout = React.createElement(Dbm.react.BaseObject, {
            className: "flex-row small-item-spacing halfs",
            style: this.item.properties.halfHeightStyle
          }, /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item"
          }, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            elementType: "img",
            image: Dbm.react.source.blockData("image1"),
            targetWidth: 530,
            className: "full-width"
          })), /*#__PURE__*/React.createElement("div", {
            className: "flex-row-item"
          }, /*#__PURE__*/React.createElement(Dbm.react.image.WidthScaledImage, {
            elementType: "img",
            image: Dbm.react.source.blockData("image2"),
            targetWidth: 530,
            className: "full-width"
          })));;

        this.responsiveLayout = Dbm.react.area.responsiveLayout(mobileLayout).addLayout(desktopLayout, 600);
    }

    _renderMainElement() {

        return React.createElement("div", {
            className: "centered-site"
          }, React.createElement("div", {
            ref: this.createRef("mainElement")
          }, this.responsiveLayout.mainElement));
    }
}