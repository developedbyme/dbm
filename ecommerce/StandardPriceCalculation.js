import Dbm from "../index.js";

export default class StandardPriceCalculation extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._changeCommand = Dbm.commands.callFunction(this._changed.bind(this));

        this.item.requireProperty("loaded", false);
        this.item.requireProperty("cart", null);
    }

    setCart(aCart) {
        this.item.cart = aCart;

        aCart.requireProperty("changeCount", 0);
        aCart.requireProperty("total", 0);

        Dbm.flow.addUpdateCommand(aCart.properties.changeCount, this._changeCommand);

        this._changed();

        return this;
    }

    _changed() {
        console.log("StandardPriceCalculation::_changed");

        let total = 0;
        let allLoaded = true;
        
        let currentArray = this.item.cart.lineItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let lineItem = currentArray[i];

            lineItem.requireProperty("total", 0);

            let product = lineItem.product;
            if(product) {
                if(product["has/encoding/product"]) {
                    let lineTotal = lineItem.quantity*Dbm.objectPath(product, "priceGroup.regularPrice.total");
                    lineItem.total = lineTotal;
                    total += lineTotal;
                }
                else {
                    Dbm.graphapi.webclient.requireObjectEncoding(product, "product", this._changeCommand); //
                    allLoaded = false;
                }
            }
        }

        this.item.cart.total = total;
        this.item.loaded = allLoaded;
    }

    _loaded() {

    }
}