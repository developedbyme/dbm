import Dbm from "../index.js";
import CommandBaseObject from "./CommandBaseObject.js"

export default class CallFunction extends CommandBaseObject {
    _construct() {
        super._construct();

        this.item.setValue("scopeObject", null);
        this.item.setValue("callFunction", null);
        this.item.setValue("callArguments", []);
    }

    perform(aFromObject, aData) {

        //METODO: resolve input
        let callFunction = this.item.callFunction;

        //METODO: try catch
        callFunction.apply(this.item.scopeObject, this.item.callArguments);
    }
}