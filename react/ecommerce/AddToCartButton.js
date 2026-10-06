import React from "react";
import Dbm from "../../index.js";

export default class AddToCartButton extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("lineItem", null);

        let cart = Dbm.repository.getItem("cart");

        cart.properties.lineItems.addUpdate(this._getScopedCallFunctionCommand(this._lineItemsUpdated));
        this._lineItemsUpdated();
    }

    _lineItemsUpdated() {
        console.log("_lineItemsUpdated");
        let cart = Dbm.repository.getItem("cart");
        let product = this.getPropValue("product");

        console.log(cart, product);

        let lineItem = Dbm.utils.ArrayFunctions.getItemByIfExists(cart.lineItems, "product", product);
        this.item.lineItem = lineItem;
        
    }

    _addToCart() {
        console.log("_addToCart");
        let cart = Dbm.repository.getControllerIfExists("cart");
        let product = this.getPropValue("product");

        console.log(cart, product);

        cart.addProduct(product);

        //METODO: add event
    }

    _removeFromCart() {
        if(this.item.lineItem) {
            let cart = Dbm.repository.getControllerIfExists("cart");
            cart.removeLineItem(this.item.lineItem);
        }
    }

    _renderMainElement() {

        return this._createMainElement("div", {},
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.lineItem, checkType: "invert/default"},
                React.createElement(Dbm.react.interaction.CommandButton, {command: this._getScopedCallFunctionCommand(this._addToCart)},
                    React.createElement(Dbm.react.design.buttons.PrimaryButton, {},
                        "Add to cart"
                    )
                )
            ),
            React.createElement(Dbm.react.area.HasData, {check: this.item.properties.lineItem},
                React.createElement(Dbm.react.ecommerce.LineItemQuantity, {lineItem: this.item.properties.lineItem})
            )
        );
    }
}

