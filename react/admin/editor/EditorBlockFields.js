import React from "react";
import Dbm from "../../../index.js";

export default class EditorBlockFields extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let textSource = new Dbm.react.source.ContextVariableSource();
        textSource.item.path = "moduleData.editorData.name";

        return React.createElement(Dbm.react.admin.editor.EditorBlockName, {},
            React.createElement(Dbm.react.form.LabelledArea, {label: "fieldName", for: "test"},
                React.createElement(Dbm.react.admin.editor.fields.TextField, {name: "fieldName", id: "test"})
            ),
                React.createElement(Dbm.react.admin.editor.fields.RichTextField, {name: "fieldName"}),
                React.createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image"})
        );
    }
}

