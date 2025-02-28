import Dbm from "../../../index.js";

export default class ItemSaveData extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.saveData = null;
        this.itemId = 0;
        this._changes = [];
        this._updateEncodings = [];
        this._savedCommands = [];
    }

    addChange(aChange) {
        this._changes.push(aChange);

        return this;
    }

    createChange(aType, aData) {
        this._changes.push({"type": aType, "data": aData});

        return this;
    }

    setField(aField, aValue) {
        this.createChange("setField", {"value": aValue, "field": aField});

        return this;
    }
    
    addUpdateEncoding(aEncoding) {
        this._updateEncodings.push(aEncoding);

        return this;
    }

    addStartCommand(aCommand) {
        this.saveData.addStartCommand(aCommand);

        return this;
    }

    addSavedCommand(aCommand) {
        this._savedCommands.push(aCommand);

        return this;
    }

    save() {
        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        let request = graphApi.editItem(this.itemId, this._changes, this._updateEncodings);
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, 1, Dbm.commands.callFunction(this._saved.bind(this)));

        return request;
    }

    _saved() {
        console.log("_saved");
        Dbm.commands.performCommands(this._savedCommands, this);
    }
}