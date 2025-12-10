import React from "react";
import Dbm from "../../../../index.js";

export default class RichTextField extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let label = this.getPropValue("label");
        let fieldName = this.getPropValue("fieldName");

        return React.createElement("div", {},
            React.createElement(Dbm.react.form.LabelledArea, {label: label}),
            React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": fieldName},
                React.createElement(Dbm.react.thirdparty.tinymce.Editor, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
            )
        )
    }
}