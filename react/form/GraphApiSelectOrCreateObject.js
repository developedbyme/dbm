import React from "react";
import Dbm from "../../index.js";

export default class GraphApiSelectOrCreateObject extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        let value = this.getDynamicProp("value", null);
        let objectType = this.getPropValue("objectType");
        let encoding = this.getPropValueWithDefault("encoding", "name");
        let nameField = this.getPropValueWithDefault("nameField", "name");

        
        let selectElement = React.createElement("div", {},
            React.createElement(Dbm.react.form.GraphApiObjectSelection, {value: value, objectType: objectType, encoding: encoding, nameField: nameField}),
            React.createElement(Dbm.react.interaction.CommandButton, {command: Dbm.commands.callFunction(this._create.bind(this))},
                React.createElement("div", {className: "standard-button standard-button-padding"},
                    "Create"
                )
            )
        );

        let selectedElement = React.createElement("div", {className: "flex-row small-item-spacing"},
            React.createElement("div", {className: "flex-row-item flex-resize"},
                Dbm.react.text.text(value)
            ),
            React.createElement("div", {className: "flex-row-item flex-no-resize"},
                React.createElement("div", {onClick: () => {this._remove()}}, "Remove")
            )
        );

        let elementSwitch = Dbm.flow.updatefunctions.logic.switchValue(value).setDefaultValue(selectedElement).addCase(null, selectElement);

        this.item.requireProperty("element", null).connectInput(elementSwitch.output.properties.value);
    }

    _create() {
        console.log("_create");
        let objectType = this.getPropValue("objectType");
        let encodings = this.getPropValueWithDefault("encodings", ["name"]);
        let visibility = this.getPropValueWithDefault("visibility", "private");

        let changes = [
            {"type": "setField", "data": {"value": "Unnamed " + objectType, "field": "name"}}
        ];

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.createItem([objectType], visibility, changes, encodings);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._created.bind(this), [request]));
    }

    _created(aRequest) {
        console.log("_created");
        console.log(aRequest);

        this.getDynamicProp("value").getMostUpstreamProperty().setValue(aRequest.item.id);
    }

    _remove() {

        this.getDynamicProp("value").getMostUpstreamProperty().setValue(null);
    }

    _renderMainElement() {

        return this._createMainElement("div", {"className": "standard-field standard-field-padding"},
            React.createElement(Dbm.react.area.InsertElement, {element: this.item.properties.element})
        );
    }
}

