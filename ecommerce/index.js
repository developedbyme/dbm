import Dbm from "../index.js";

export {default as Cart} from "./Cart.js";
export {default as CartLineItem} from "./CartLineItem.js";
export {default as LocalStorageCartLoader} from "./LocalStorageCartLoader.js";

export const setup = function() {
    
    let cart = new Dbm.ecommerce.Cart();
    cart.item.register("cart");

    let localStorageLoader = new Dbm.ecommerce.LocalStorageCartLoader();
    localStorageLoader.setCart(cart.item);
    localStorageLoader.load();

}