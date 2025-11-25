import React from "react";
import Dbm from "../../index.js";

export default class AnimatedElement extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let controller = this.getPropValue("controller");

        controller.propertyInput("element", this.item.requireProperty("animationElement", null));
    }

    _removedUsedProps(aProps) {
        delete aProps["controller"];
    }

    _renderMainElement() {
        //console.log("AnimatedElement::_renderMainElement");
        //console.log(this);
        
        let controller = this.getPropValue("controller");
        let children = this.getPropValue("children");

        return this._createMainElement("div", {"ref": this.createRef("animationElement"), "style": controller.jsxStyle}, children);
    }
}