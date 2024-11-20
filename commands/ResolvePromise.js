import Dbm from "../index.js";
import CommandBaseObject from "./CommandBaseObject.js"

export default class ResolvePromise extends CommandBaseObject {
    _construct() {
        super._construct();

        this.item.setValue("promise", new Promise((aResolve, aReject) => {
            this.item.setValue("resolve", aResolve);
            this.item.setValue("reject", aReject);
        }));

        this.item.setValue("value", null);
    }

    perform(aFromObject, aData) {

        this.item.resolve(this.item.value);
    }
}