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
    }

    createLineItem(aType, aQuantity = 0, aMeta = null) {
        
        let id = "lineItem" + Dbm.getInstance().getNextId();
        let lineItem = new Dbm.ecommerce.CartLineItem();
        lineItem.item.setId(id);
        lineItem.item.type = aType;
        lineItem.setQuantity(aQuantity);
        lineItem.setCart(this.item);

        if(aMeta) {
            for(let objectName in aMeta) {
                lineItem.setMeta(objectName, aMeta[objectName]);
            }
        }

        Dbm.flow.addUpdateCommand(lineItem.item.properties.quantity, this._changeCommand);

        this.item.addToArray("lineItems", lineItem.item);

        return lineItem;
    }

    addProduct(aProduct, aQuantity = 1, aMeta = null) {
        //console.log("addProduct");
        //console.log(aQuantity);

        let lineItem = Dbm.utils.ArrayFunctions.getItemBy(this.item.lineItems, "product", aProduct);
        
        if(lineItem) {
            lineItem.increaseQuantity(aQuantity);
            
            if(aMeta) {
                for(let objectName in aMeta) {
                    lineItem.setMeta(objectName, aMeta[objectName]);
                }
            }

            return lineItem;
        }

        return this.addProductAsSeparateLineItem(aProduct, aQuantity, aMeta);
    }

    addProductAsSeparateLineItem(aProduct, aQuantity = 1, aMeta = null) {
        let lineItem = this.createLineItem("product", aQuantity, aMeta);
        lineItem.setProduct(aProduct);

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