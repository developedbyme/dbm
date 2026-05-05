import Dbm from "../index.js";

export default class Cart extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._changeCommand = this._getScopedCallFunctionCommand(this._changed);

        this.item.requireProperty("lineItems", []).addUpdate(this._changeCommand);
        this.item.requireProperty("meta", {}).addUpdate(this._changeCommand);

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

        Dbm.flow.addUpdateCommand(lineItem.item.properties.product, this._changeCommand);
        Dbm.flow.addUpdateCommand(lineItem.item.properties.quantity, this._changeCommand);
        //METODO: save change for meta

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
        this.item.removeFromArray("lineItems", aItem);
    }

    emptyCart() {
        this.item.lineItems = [];

        return this;
    }

    setMeta(aKey, aValue) {
        let newMeta = {...this.item.meta};
        newMeta[aKey] = aValue;
        this.item.meta = newMeta;

        return this;
    }

    getAsObject() {
        let returnObject = {};

        let encodedLineItems = [];

        let currentArray = this.item.lineItems;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];

            let meta = currentData.meta.controller.getAsObject();
            //METODO: links in meta
            let encodedData = {"type": currentData.type, "quantity": currentData.quantity, "meta": meta};
            if(currentData.product) {
                encodedData["product"] = currentData.product.id;
            }
            encodedLineItems.push(encodedData);
        }

        returnObject = {"lineItems": encodedLineItems, "meta": {...this.item.meta}};

        return returnObject;
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