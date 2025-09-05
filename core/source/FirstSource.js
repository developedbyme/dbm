import Dbm from "../../index.js";

export default class FirstSource extends Dbm.core.source.SourceBaseObject {
	
    _construct() {
        super._construct();

        this.item.setValue("defaultValue", null);
        this.item.setValue("sources", []);
    }
	
	getSource(aFromObject, aEventData = null) {
        //console.log("getSource");
        
        let currentArray = this.item.sources;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentSource = currentArray[i];

            let value = currentSource.getSource(aFromObject, aEventData);
            if(this._log) {
                console.log("Source first>>>>>", i, currentSource, value);
            }

            if(value) {
                return value;
            }
        }

        if(this._log) {
            console.log("Source first>>>>> default", this.item.defaultValue);
        }
        
        return this.item.defaultValue;
    }
}