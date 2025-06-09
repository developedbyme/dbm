import Dbm from "../index.js";

export default class Cart extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._changeCommand = Dbm.commands.callFunction(this._changed.bind(this));

        this.item.setValue("lineItems", []);
        Dbm.flow.addUpdateCommand(this.item.properties.lineItems, this._changeCommand);
        this.item.setValue("numberOfItems", 0);
        this.item.setValue("numberOfLines", 0);

        this.item.setValue("changeCount", 0);

        //METODO: integrate local storage
    }

    addProduct(aProduct, aQuantity = 1) {
        //console.log("addProduct");
        //console.log(aQuantity);

        let lineItems = this.item.lineItems;
        let lineItem;
        let index = Dbm.utils.ArrayFunctions.getItemIndexByIfExists(lineItems, "product", aProduct);
        
        if(index !== -1) {
            lineItem = lineItems[index];
            lineItem.controller.increaseQuantity(aQuantity);
        }
        else {
            let id = "lineItem" + Dbm.getInstance().getNextId();
            lineItem = new Dbm.ecommerce.CartLineItem();
            lineItem.item.setId(id);
            lineItem.setProduct(aProduct);
            lineItem.setQuantity(aQuantity);
            lineItem.setCart(this.item);

            Dbm.flow.addUpdateCommand(lineItem.item.properties.quantity, this._changeCommand);

            let newLineItems = [].concat(lineItems);
            newLineItems.push(lineItem.item);
            this.item.lineItems = newLineItems;
        }

        return lineItem;
    }

    removeLineItem(aItem) {
        let lineItems = [].concat(this.item.lineItems);
        
        let index = lineItems.indexOf(aItem);
        if(index >= 0) {
            lineItems.splice(index, 1);
            this.item.lineItems = lineItems;
        }
    }

    _changed() {
        //console.log("_changed");
        
        let lineItems = this.item.lineItems;

        this.item.numberOfLines = lineItems.length;

        let itemsCount = 0;
        let currentArray = lineItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            itemsCount += currentItem.quantity;
        }

        this.item.numberOfItems = itemsCount;
        this.item.changeCount++;

        //METODO: calculate totals
    }
}