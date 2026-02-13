import Dbm from "../index.js";

export default class CartLineItem extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("cart", null);

        this.item.setValue("type", null);
        this.item.setValue("product", null);
        this.item.setValue("quantity", 0);

        let meta = new Dbm.utils.NamedArray();
        this.item.setValue("meta", meta.item);
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
        console.log("setMeta");
        console.log(aKey, aValue);
        this.item.meta.controller.setValue(aKey, aValue);

        console.log(this.item.meta.controller, this.item.meta);

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