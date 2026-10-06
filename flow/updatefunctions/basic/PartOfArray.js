import Dbm from "../../../index.js";

export default class PartOfArray extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("items", []);
        this.input.register("startAt", 0);
        this.input.register("numberOfItems", -1);
        this.output.register("items", []);
        this.output.register("containsAll", true);
    }

    _update() {

        let currentArray = this.input.items;
        let currentArrayLength = currentArray.length;
        
        let startAt = this.input.startAt;
		let endAt = currentArrayLength;

        let numberOfItems = this.input.numberOfItems;
        if(numberOfItems >= 0) {
            endAt = Math.min(currentArrayLength, startAt+numberOfItems);
        }

		let returnArray = new Array();
		for(let i = startAt; i < endAt; i++) {
			returnArray.push(currentArray[i]);
		}

        this.output.items = returnArray;
        this.output.containsAll = (endAt >= currentArrayLength);
    }
}