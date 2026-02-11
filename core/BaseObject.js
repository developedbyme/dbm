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

    _getScopedCallFunctionCommand(aFunction, aArguments = []) {
        let CallFunction = Dbm.objectPath(Dbm.getRepositoryItem("library"), "Dbm/commands/CallFunction");
        let command = new CallFunction();
        command.item.scopeObject = this;
        command.item.callFunction = aFunction;
        command.item.callArguments = aArguments;

        return command;
    }

    _propertyOrName(aPropertyOrName) {
        if(typeof(aPropertyOrName) === "string") {
            return this.item.properties[aPropertyOrName];
        }

        return aPropertyOrName;
    }

    addUpdateCall(aPropertyOrName, aFunction, aArguments = []) {
        this._propertyOrName(aPropertyOrName).addUpdate(this._getScopedCallFunctionCommand(aFunction, aArguments));
    }

    addUpdateCallWhenMatched(aPropertyOrName, aMatchValue, aFunction, aArguments = []) {
        console.log(this._propertyOrName(aPropertyOrName), aPropertyOrName, this);
        this._propertyOrName(aPropertyOrName).addUpdateWhenMatched(aMatchValue, this._getScopedCallFunctionCommand(aFunction, aArguments));
    }

    destroy() {
        if(this._item) {
            //METODO: destroy item
        }
        this._item = null;
        super.destroy();
    }
}