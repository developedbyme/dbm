import React from "react";
import Dbm from "dbm";

export default class PageTitleHeader extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

    }

    _renderMainElement() {
        return this._createMainElement("div", {className: "content-narrow"},
            React.createElement("h1", {className: "no-margins"}, Dbm.react.text.text(Dbm.react.source.contextVariable("page.title")))
        );
    }
}

export const registerBlock = function(aModuleName = "content/pageTitleHeader") {
    Dbm.react.blocks.registerFrontBlock(aModuleName, React.createElement(PageTitleHeader));
}

export const registerBlockEditor = function(aModuleName = "content/pageTitleHeader", aName = "Page title header") {
    let editor = React.createElement(Dbm.react.admin.editor.EditorBlockName, {},
        React.createElement("div", {"data-slot": "description"}, "H1 with text from the title field")
    );
    Dbm.react.blocks.registerBlockEditor(aModuleName, aName, editor);
}