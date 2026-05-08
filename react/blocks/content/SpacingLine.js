import React from "react";
import Dbm from "dbm";

export default class SpacingLine extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

    }

    _renderMainElement() {

        return this._createMainElement("div", {className: "content-narrow"}, 
            React.createElement("div", {className: "spacing medium"}),
            React.createElement("div", {className: "spacer-line"}),
            React.createElement("div", {className: "spacing medium"})
        );
    }
}