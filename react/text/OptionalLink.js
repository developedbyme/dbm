import Dbm from "../../index.js";
import React from "react";

export default class OptionalLink extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let url = this.getPropValue("href");
        let children = this.getPropValue("children");
        if(url) {
            return this._createMainElement(Dbm.react.text.Link, {href: url}, children);
        }
        else {
            return React.createElement(React.Fragment, {}, children);
        }
        
    }
}