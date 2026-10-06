import Dbm from "../index.js";

export default class CartLineItem extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("cart", null);

        this.item.requireProperty("type", null);
        this.item.requireProperty("product", null);
        this.item.requireProperty("quantity", 0).addUpdate(this._getScopedCallFunctionCommand(this._quantityUpdated));

        let meta = new Dbm.utils.NamedArray();
        this.item.requireProperty("meta", meta.item);
    }

    setCart(aItem) {
        this.item.cart = aItem;

        return this;
    }

    setProduct(aProduct) {
        this.item.product = aProduct;

        return this;
    }

    setQuantity(aQuantity) {
        //console.log("setQuantity");
        //console.log(aQuantity);

        this.item.quantity = aQuantity;

        return this;
    }

    _quantityUpdated() {
        if(this.item.quantity > 0) {
            //MENOTE: do nothing
        }
        else {
            //METODO: would be good to have a setting for this
            this.remove();
        }
    }

    setMeta(aKey, aValue) {
        //console.log("setMeta");
        //console.log(aKey, aValue);
        this.item.meta.controller.setValue(aKey, aValue);

        return this;
    }

    increaseQuantity(aQuantity) {
        this.item.quantity += aQuantity;

        return this;
    }

    remove() {
        this.item.cart.controller.removeLineItem(this.item);

        return this;
    }

    getAsObject() {
        let returnObject = {
            "type": this.item.type,
            "quantity": this.item.quantity,
            "meta": this.item.meta.controller.getAsObject()
        }

        if(this.item.product) {
            returnObject["product"] = this.item.product.id;
        }

        return returnObject;
    }
}