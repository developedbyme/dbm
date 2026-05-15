import React from "react";
import Dbm from "../../index.js";

export default class Link extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.getDynamicPropWithoutState("value", {});
        this.getDynamicPropWithoutState("editing", false);
    }

    _renderMainElement() {

        let objectProperty = this.getDynamicPropWithoutState("value", {});
        let textFieldName = this.getPropValueWithDefault("textFieldName", "text");
        let urlFieldName = this.getPropValueWithDefault("urlFieldName", "url");
        let editing = this.getDynamicPropWithoutState("editing", false);

        return this._createMainElement("div", {},
            React.createElement("div", {"className": "flex-row"},
                React.createElement("div", {"className": "flex-row-item quarter flex-resize"},
                    React.createElement("div", {"className": "flex-row-item absolute-container"},
                        React.createElement(Dbm.react.form.EditObjectProperty, {"value": objectProperty, "path": textFieldName},
                            React.createElement(Dbm.react.form.FormField, {"className": "integrated-field standard-field-padding with-left-field-icon full-width", value: Dbm.react.source.contextVariable("value"), editing: editing})
                        ),
                        React.createElement(Dbm.react.image.Image, {"src": "/assets/img/icons/text.svg", "className": "field-icon left-field-icon-position background-contain field-icon-color no-pointer-events", "alt": "Link text"})
                    )
                ),
                React.createElement("div", {"className": "flex-row-item half flex-resize"},
                    React.createElement("div", {"className": "flex-row-item absolute-container"},
                        React.createElement(Dbm.react.form.Url, {"className": "standard-field-padding with-left-field-icon full-width", value: objectProperty, urlFieldName: urlFieldName, editing: editing}),
                        React.createElement(Dbm.react.image.Image, {"src": "/assets/img/icons/link.svg", "className": "field-icon left-field-icon-position background-contain field-icon-color no-pointer-events", "alt": "URL"}),
                    )
                )
            )
            
        );
    }
}

