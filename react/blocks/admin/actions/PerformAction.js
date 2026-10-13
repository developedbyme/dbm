import React from "react";
import Dbm from "../../../../index.js";

export default class PerformAction extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let form = new Dbm.form.Form();
        this.item.requireProperty("form", form.item);

        {
            let field = form.createField("action", "", Dbm.form.validation.ValidationFunctions.notEmpty);
        }

        {
            let field = form.createField("from", "", Dbm.form.validation.ValidationFunctions.noValidation);
        }

        {
            let field = form.createField("data", "", Dbm.form.validation.ValidationFunctions.noValidation);
        }
    }

    _perform() {
        console.log("_perform");

        if(this.item.form.controller.validate()) {
            let formData = this.item.form.controller.getValue();

            let data = {
                "type": formData.action
            }

            if(formData["from"]) {
                data["from"] = 1*formData["from"];
            }

            if(formData["data"]) {
                data["data"] = formData["data"];
            }
            
            Dbm.graphapi.webclient.performAction("admin/addAndProcessAction", data, this._processed.bind(this));
        }
    }

    _processed(aData) {
        console.log("_processed");
        console.log(aData);

    }

    _renderMainElement() {

        return React.createElement("div", {className: "content-narrow"},
            React.createElement(Dbm.react.context.AddItemToContext,  {item: this.item.form, as: "form"},
                React.createElement("div", {className: "standard-field-label"}, "Action"),
                Dbm.react.form.fieldWithValidation("action", ""),
                React.createElement("div", {className: "standard-field-label"}, "From"),
                Dbm.react.form.fieldWithValidation("from", ""),
                React.createElement("div", {className: "standard-field-label"}, "Data"),
                Dbm.react.form.fieldWithValidation("data", ""),
                React.createElement(Dbm.react.interaction.CommandButton, {command: this._getScopedCallFunctionCommand(this._perform)},
                    React.createElement(Dbm.react.design.buttons.PrimaryButton, {}, "Perform")
                )
            )
        );
    }
}