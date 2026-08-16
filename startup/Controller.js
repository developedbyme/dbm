import Dbm from "../index.js";
import Runner from "./Runner.js";

export default class Controller extends Dbm.core.BaseObject {
    constructor() {
        super();
        this._runners = [];
        this._nextId = 0;
    }

    get isSetup() {
        return true;
    }

    _getNextId() {
        let nextId = this._nextId;

        this._nextId++;

        return nextId;
    }

    create(aElement, aModuleName, aData) {
        //console.log("Controller::create");
        //console.log(aElement, aData);

        let id = this._getNextId();

        let newRunner = new Runner();
        newRunner.setup(aElement, aModuleName, aData, id);
        this.add(newRunner);
        newRunner.start();

        return id;
    }

    add(aWidget) {
        this._runners.push(aWidget);
        return this;
    }

    remove(aId) {
        //METODO
    }
}