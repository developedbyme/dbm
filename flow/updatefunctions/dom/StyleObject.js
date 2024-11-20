import Dbm from "../../../index.js";

export default class StyleObject extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("values", {});
        this.input.register("units", {});

        this.output.register("style", {});
    }

    addProperty(aName, aValue, aUnit = null) {
        let property = this.input.register("property_" + aName, null).setOrConnect(aValue);
        let unit = this.input.register("units_" + aName, null).setOrConnect(aUnit);

        this.input.values[aName] = property;
        this.input.units[aName] = unit;

        return this;
    }

    _update() {
        //console.log("_update");

        let properties = this.input.values;

        let styleObject = {};

        for(let objectName in properties) {
            let value = properties[objectName].value;
            let unit = this.input.units[objectName].value;

            if(unit) {
                value += " " + unit;
            }
            styleObject[objectName] = value;
        }

        this.output.style = styleObject;
    }
}