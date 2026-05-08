import React from "react";
import Dbm from "dbm";

export default class Spacing extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

    }

    _renderMainElement() {
        console.log(this._createMainElement("div", {className: "spacing standard"}));
        return this._createMainElement("div", {className: "spacing standard"});
    }
}