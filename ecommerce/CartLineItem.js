import Dbm from "../index.js";

export default class CartLineItem extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("cart", null);
        this.item.setValue("product", null);
        this.item.setValue("quantity", 0);
        this.item.setValue("meta", {});
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

    setMeta(aKey, aValue) {
        this.item.meta[aKey] = aValue;

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
}