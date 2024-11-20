import Dbm from "../index.js";

export default class GlobalObject extends Dbm.core.BaseObject {
    constructor() {
        super();

        this._repository = new Dbm.repository.Repository();
        this._nextId = 0;
    }

    get repository() {
        return this._repository;
    }

    getNextId() {
        return this._nextId++;
    }
}