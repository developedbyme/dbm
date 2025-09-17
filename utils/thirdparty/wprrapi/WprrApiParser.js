import Dbm from "../../../index.js";

export default class WprrApiParser extends Dbm.core.BaseObject {

    constructor() {
        super();

        this.items = {};
    }

    setItems(aItems) {
        this.items = aItems;

        return this;
    }

    getItem(aId) {
        return this.items[aId];
    }

    getItems(aIds) {
        let returnArray = [];
        let currentArray = aIds;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            returnArray.push(this.getItem(currentArray[i]));
        }

        return returnArray;
    }
}