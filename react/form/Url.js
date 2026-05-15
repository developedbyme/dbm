import React from "react";
import Dbm from "../../index.js";

export default class Url extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicPropWithoutState("value", {});
        this.getDynamicPropWithoutState("editing", false);
    }

    _renderMainElement() {

        let objectProperty = this.getDynamicPropWithoutState("value", {});
        let urlFieldName = this.getPropValueWithDefault("urlFieldName", "url");
        let editing = this.getDynamicPropWithoutState("editing", false);

        return React.createElement("div", {},
            React.createElement(Dbm.react.form.EditObjectProperty, {"value": objectProperty, "path": urlFieldName},
                this._createMainElement(Dbm.react.form.FormField, {"className": "integrated-field standard-field-padding-vertical", value: Dbm.react.source.contextVariable("value"), editing: editing})
            )
        );
    }
}

