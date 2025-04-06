import Dbm from "../../../index.js";

export default class PartOfObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("object", null);
        this.item.requireProperty("path", null);
        this.item.requireProperty("value", null);

        this._lastUpdatedValue = null;

        let objectUpdatedCommand = Dbm.commands.callFunction(this._objectUpdated.bind(this));
        Dbm.flow.addUpdateCommand(this.item.properties.object, objectUpdatedCommand);
        Dbm.flow.addUpdateCommand(this.item.properties.path, objectUpdatedCommand);

        Dbm.flow.addUpdateCommand(this.item.properties.value, Dbm.commands.callFunction(this._valueUpdated.bind(this)));
    }

    _objectUpdated() {
        console.log("_objectUpdated");

        if(this.item.path !== null) {
            let stringValue = JSON.stringify(Dbm.objectPath(this.item.object, this.item.path));
            
            if(stringValue !== this._lastUpdatedValue) {
                this._lastUpdatedValue = stringValue;
                let newValue = JSON.parse(stringValue);
                this.item.value = newValue;
            }
        }
    }

    _valueUpdated() {
        console.log("_valueUpdated");

        if(this.item.path !== null) {
            let stringValue = JSON.stringify(this.item.value);

            if(stringValue !== this._lastUpdatedValue) {
                this._lastUpdatedValue = stringValue;
                let object = JSON.parse(JSON.stringify(this.item.object));
                Dbm.setAtObjectPath(object, this.item.path, JSON.parse(stringValue));
        
                this.item.properties.object.getMostUpstreamProperty().value = object;
            }
            
        }
        
    }
}