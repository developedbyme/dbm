import React from "react";
import Dbm from "../../../../index.js";

export default class Url extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let id = this.context.item.id;

        return React.createElement("div", {},
            React.createElement(Dbm.react.form.LabelledArea, {label: "Url"}, 
                React.createElement(Dbm.react.admin.editorsgroup.EditUrl, {},
                    React.createElement(Dbm.react.form.FormField, {value: Dbm.react.source.contextVariable("valueEditor.editValue.value"), className: "standard-field standard-field-padding full-width"})
                )
            )
        )
    }
}