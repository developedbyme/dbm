import Dbm from "../../../index.js";

export default class SaveData extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._startCommands = [];
        this._savedCommands = [];

        this._saveOperations = [];
        this._currentEditor = null;
    }

    getItemSaveData(aId) {

        //METODO: check that it's an item save operation
        if(this._currentEditor && this._currentEditor.itemId === aId) {
            return this._currentEditor;
        }

        this._currentEditor = new Dbm.graphapi.webclient.admin.ItemSaveData();
        this._currentEditor.itemId = aId;
        this._currentEditor.saveData = this;
        this._saveOperations.push(this._currentEditor);

        return this._currentEditor;
    }

    addStartCommand(aCommand) {
        this._startCommands.push(aCommand);

        return this;
    }

    addSavedCommand(aCommand) {
        this._savedCommands.push(aCommand);

        return this;
    }

    save() {
        Dbm.commands.performCommands(this._startCommands, this);

        let saveOperations = [].concat(this._saveOperations);
        this._performNextSaveOperation(saveOperations);
        
        return this;
    }

    _performNextSaveOperation(aSaveOperations) {
        if(aSaveOperations.length === 0) {
            Dbm.commands.performCommands(this._savedCommands, this);
            return;
        }

        let nextOperation = aSaveOperations.shift();
        let request = nextOperation.save();
        Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, 1, Dbm.commands.callFunction(this._performNextSaveOperation.bind(this), [aSaveOperations]));
    }
}