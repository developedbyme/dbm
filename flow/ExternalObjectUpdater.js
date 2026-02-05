import Dbm from "../index.js";

export default class ExternalObjectUpdater extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("object", null);
        this.item.requireProperty("updateFunctions", []);
        this.item.requireProperty("running", true);

        this.addUpdateCallWhenMatched("running", true, this.start);
        this.addUpdateCallWhenMatched("running", false, this.stop);

    }

    get object() {
        return this.item.object;
    }

    addProperty(aName, aValue, aPath = null) {
        if(!aPath) {
            aPath = aName;
        }

        let property = this.item.requireProperty(aName, null);
        property.setOrConnect(aValue);
        let updateFunction = Dbm.flow.updatefunctions.basic.setProperty(this.item.properties.object, aPath, property);
        this.item.setValue("update/" + aName, updateFunction);
        this.item.addToArray("updateFunctions", updateFunction);

        if(this.item.running) {
            updateFunction.output.properties.value.startUpdating();
        }
        
        return property;
    }

    start() {
        let currentArray = this.item.updateFunctions;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let updateFunction = currentArray[i];
            updateFunction.output.properties.value.startUpdating();
        }

        return this;
    }

    stop() {
        let currentArray = this.item.updateFunctions;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let updateFunction = currentArray[i];
            updateFunction.output.properties.value.stopUpdating();
        }

        return this;
    }

    destroy() {
        this.stop();

        super.destroy();
    }
}