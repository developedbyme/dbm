import Dbm from "../../index.js";

export default class ContextVariableSource extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("path", null);
    }

    get isSource() {
        return true;
    }

    getSource(aFromObject) {
        //console.log("getSource");
        
        return Dbm.objectPath(aFromObject.context, this.item.path);
    }
}