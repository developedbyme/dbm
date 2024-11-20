import Dbm from "../index.js";

export default class CommandBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    perform(aFromObject, aData) {
        //MENOTE: should be overridden
    }
}