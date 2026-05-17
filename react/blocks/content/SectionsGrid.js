import React from "react";
import Dbm from "dbm";

export default class SectionsGrid extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

    }

    _renderMainElement() {
        return this._createMainElement("div", {className: "content-narrow"},
            React.createElement("div", {className: "section-grid section-grid-gap"},
                React.createElement(Dbm.react.area.List, {"items": Dbm.react.source.blockData("sections")},
                    React.createElement(Dbm.react.design.content.GridSectionCard, {})
                )
            )
        );
    }
}