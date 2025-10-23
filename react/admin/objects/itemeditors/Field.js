import React from "react";
import Dbm from "../../../../index.js";

export default class Field extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let label = this.getPropValue("label");
        let fieldName = this.getPropValue("fieldName");

        let fieldNameSource = Dbm.react.source.contextVariable("fieldName");
        let editorValueSource = Dbm.react.source.contextVariable("valueEditor.editValue.value");

        return React.createElement("div", {},
            React.createElement("label", {className: "standard-field-label"}, label),
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"fieldName": fieldName}},
                React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": fieldNameSource},
                    React.createElement(Dbm.react.form.FormField, {value: editorValueSource, className: "standard-field standard-field-padding full-width"})
                )
            )
        )
    }
}