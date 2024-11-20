import Dbm from "../index.js";

export default class Repository extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._items = {};

        this._item = this.getItem("repository");
        this.item.setValue("controller", this);
    }

    addItem(aItem) {
        this._items[aItem.id] = aItem;

        return this;
    }

    addAlias(aAlias, aItem) {
        this._items[aAlias] = aItem;

        return this;
    }

    getItem(aName) {
        let item = this._items[aName];
        if(!item) {
            item = new Dbm.repository.Item();
            item.setId(aName);
            this._items[aName] = item;
        }

        return item;
    }

    getItems(aNames) {
        let currentArray = aNames;
        let currentArrayLength = currentArray.length;
        let returnArray = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            returnArray[i] = this.getItem(currentArray[i]);
        }

        return returnArray;
    }

    getItemIfExists(aName) {
        let item = this._items[aName];
        if(item) {
            return item;
        }

        return null;
    }

    createInternalItem() {
        let name = "_internal" + Dbm.getInstance().getNextId();
        return this.getItem(name);
    }
}