import React from "react";
import Dbm from "../../index.js";

export default class CartContents extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

    }

    _renderMainElement() {
        //console.log("_renderMainElement");

        let cart = Dbm.repository.getItem("cart");

        return React.createElement(Dbm.react.area.List, {items: cart.properties.lineItems, as: "lineItem"}, this.getPropValue("children"));
    }
}