import React from "react";
import Dbm from "../../index.js";

export default class LineItemQuantity extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let lineItem = this.getPropValue("lineItem");

        let representation = Dbm.flow.controllers.transform.positiveIntegerStringRepresentation(lineItem.properties.quantity);
        this.item.setValue("representation", representation.item);
    }

    _addToCart() {
        console.log("_addToCart");

        let lineItem = this.getPropValue("lineItem");
        lineItem.quantity++;
    }

    _removeFromCart() {
        let lineItem = this.getPropValue("lineItem");
        lineItem.quantity--;
    }

    _renderMainElement() {

        return this._createMainElement("div", {"className": "select-quantity-field"},
            React.createElement("div", {"className": "flex-row"},
                React.createElement(Dbm.react.interaction.CommandButton, {command: this._getScopedCallFunctionCommand(this._removeFromCart)},
                    React.createElement("div", {"className": "flex-row-item step-button cursor-pointer"},
                        Dbm.react.area.centeredFlexDiv("-")
                    )
                ),
                React.createElement(Dbm.react.form.FormField, {"className": "integrated-field text-align-center select-quantity-field-width", value: this.item.representation.properties.stringValue, editing: this.item.representation.properties.editing}),
                React.createElement(Dbm.react.interaction.CommandButton, {command: this._getScopedCallFunctionCommand(this._addToCart)},
                    React.createElement("div", {"className": "flex-row-item step-button cursor-pointer"},    
                        Dbm.react.area.centeredFlexDiv("+")
                    )
                )
            )
            
        );
    }
}

