import Dbm from "../index.js";

export {default as Cart} from "./Cart.js";
export {default as CartLineItem} from "./CartLineItem.js";
export {default as LocalStorageCartLoader} from "./LocalStorageCartLoader.js";
export {default as StandardPriceCalculation} from "./StandardPriceCalculation.js";

export const setup = function() {
    
    let cart = new Dbm.ecommerce.Cart();
    cart.item.register("cart");

    let localStorageLoader = new Dbm.ecommerce.LocalStorageCartLoader();
    localStorageLoader.setCart(cart.item);
    localStorageLoader.load();

}

export const setupStandardPriceCalculation = function() {

    let cart = Dbm.repository.getItem("cart");
    let priceCalculation = new Dbm.ecommerce.StandardPriceCalculation();
    priceCalculation.setCart(cart);
    cart.setValue("priceCalculation", priceCalculation.item);
}