import React from "react";
import Dbm from "../../../index.js";

export default class EditorBlockName extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let textSource = new Dbm.react.source.ContextVariableSource();
        textSource.item.path = "moduleData.editorData.name";

        return React.createElement("div", {"className": "editor-block-box editor-block-box-padding text-align-center"},
            Dbm.react.text.text(textSource),
        );
    }
}

