import Dbm from "../index.js";

export default class BaseObject extends Dbm.core.LifeCycleObject {

    _constructProperties() {
        super._constructProperties();
        this._item = null;
    }

    get item() {
        if(!this._item) {
            this._item = new Dbm.repository.Item();
            this._item.setValue("controller", this);
        }
        return this._item;
    }

    setItem(aItem) {
        this._item = aItem;

        return this;
    }
}