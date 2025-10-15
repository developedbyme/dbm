import React from "react";
import Dbm from "../../../../index.js";

export default class Title extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let label = "Title";
        let fieldName = "title";

        let fieldNameSource = Dbm.react.source.contextVariable("fieldName");
        let editorValueSource = Dbm.react.source.contextVariable("valueEditor.editValue.value");

        return React.createElement("div", {},
            React.createElement("label", {className: "standard-field-label"}, label),
            React.createElement(Dbm.react.context.AddContextVariables, {values: {"fieldName": fieldName}},
                React.createElement(Dbm.react.admin.editorsgroup.EditField, {"fieldName": fieldNameSource},
                    React.createElement(Dbm.react.form.FormField, {value: editorValueSource, className: "standard-field standard-field-padding full-width"})
                ),
                React.createElement(Dbm.react.area.List, {items: Dbm.getRepositoryItem("site").properties.availableLanguages, as: "language"},
                    React.createElement("div", {className: "flex-row small-item-spacing vertically-center-items"},
                        React.createElement("div", {className: "flex-row-item flex-no-resize"},
                            Dbm.react.text.text(Dbm.react.source.contextVariable("language.code"))
                        ),
                        React.createElement("div", {className: "flex-row-item flex-resize"},
                            React.createElement(Dbm.react.admin.editorsgroup.EditFieldTranslation, {"fieldName": fieldNameSource, "language": Dbm.react.source.contextVariable("language.code")},
                                React.createElement(Dbm.react.form.FormField, {value: editorValueSource, className: "standard-field standard-field-padding full-width"})
                            ),
                        )
                    )
                )
            )
        )
    }
}