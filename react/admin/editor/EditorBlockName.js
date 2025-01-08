import React from "react";
import Dbm from "../../../index.js";

export default class EditorBlockName extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let childrenAndSpacing = null;
        let children = this.getPropValue("children");
        if(children) {
            childrenAndSpacing = React.createElement(React.Fragment, {},
                React.createElement("div", {"className": "spacing standard"}),
                children
            )
        }

        return React.createElement("div", {"className": "editor-block-box editor-block-box-padding"},
            React.createElement("div", {"className": "text-align-center"},
                Dbm.react.text.text(Dbm.react.source.contextVariable("moduleData.editorData.name"))
            ),
            childrenAndSpacing
        );
    }
}

