import Dbm from "../index.js";

export default class PageListTracker extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this.item.requireProperty("items", []);
        this.item.requireProperty("listId", null);

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(true);
        this.item.requireProperty("allLoaded", allLoaded);

        let rendered = this.item.requireProperty("rendered", false);
        allLoaded.addCheck(rendered);

        this.item.requireProperty("ready", false).addUpdateWhenMatched(true, this._getScopedCallFunctionCommand(this._readyToSend));
        this.item.properties.ready.connectInput(allLoaded.output.properties.value);
    }

    startRenderTime(aTime = 0.2) {
        this.item.properties.rendered.delayValue(true, aTime);
    }

    createItem() {
        let newItem = new Dbm.repository.Item();

        let readyProperty = newItem.requireProperty("ready", false);
        newItem.setValue("item", null);
        this.item.addToArray("items", newItem);

        this.item.allLoaded.addCheck(readyProperty);

        return newItem;
    }

    _readyToSend() {
        console.log("_readyToSend");

        let products = Dbm.utils.ArrayFunctions.removeValues(Dbm.utils.ArrayFunctions.mapField(this.item.items, "item"), [null, undefined]);

        if(products.length) {
            let trackingController = Dbm.repository.getControllerIfExists("trackingController");
            trackingController.trackProductListView(products, this.item.listId);
        }
    }
}