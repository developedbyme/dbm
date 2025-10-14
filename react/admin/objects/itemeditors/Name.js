import React from "react";
import Dbm from "../../../../index.js";

export default class Name extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        /*
                    React.createElement(Dbm.react.admin.editorsgroup.EditFieldTranslation, {"fieldName": fieldNameSource, "language": "sv"},
                        React.createElement(Dbm.react.form.FormField, {value: editorValueSource, className: "standard-field standard-field-padding full-width"})
                    ),
                    React.createElement(Dbm.react.admin.editorsgroup.EditFieldTranslation, {"fieldName": fieldNameSource, "language": "en"},
                        React.createElement(Dbm.react.form.FormField, {value: editorValueSource, className: "standard-field standard-field-padding full-width"})
                    ),
                    React.createElement(Dbm.react.admin.editorsgroup.EditFieldTranslation, {"fieldName": fieldNameSource, "language": "fi"},
                        React.createElement(Dbm.react.form.FormField, {value: editorValueSource, className: "standard-field standard-field-padding full-width"})
                    )
                    
        */

        let label = "Name";
        let fieldName = "name";

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