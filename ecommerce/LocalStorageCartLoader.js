import Dbm from "../index.js";

export default class LocalStorageCartLoader extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._changeCommand = Dbm.commands.callFunction(this._changed.bind(this));

        this._isLoading = false;
        this.item.requireProperty("storageKey", "cart");
        this.item.requireProperty("cart", null);
    }

    setCart(aCart) {
        this.item.cart = aCart;
        Dbm.flow.addUpdateCommand(aCart.properties.changeCount, this._changeCommand);

        return this;
    }

    load() {
        //console.log("load");

        let repository = Dbm.getInstance().repository;

        this._isLoading = true;
        try {
            let cartDataString = localStorage.getItem(this.item.storageKey);
            if(cartDataString) {
                let cartData = JSON.parse(cartDataString);
                let currentArray = cartData.lineItems;
                let currentArrayLength = currentArray.length;
                for(let i = 0; i < currentArrayLength; i++) {
                    let currentData = currentArray[i];

                    this.item.cart.controller.addProduct(repository.getItem(currentData["product"]), currentData["quantity"]);
                }
            }
        }
        catch(theError) {
            console.error(theError);
        }

        this._isLoading = false;
    }

    _changed() {
        //console.log("_changed");
        
        if(this._isLoading) {
            return;
        }

        let encodedLineItems = [];

        let currentArray = this.item.cart.lineItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];

            let encodedData = {"product": currentData.product.id, "quantity": currentData.quantity};
            encodedLineItems.push(encodedData);
        }

        try {
            let cartDataString = localStorage.setItem(this.item.storageKey, JSON.stringify({"lineItems": encodedLineItems}));
        }
        catch(theError) {
            console.error(theError);
        }
    }
}