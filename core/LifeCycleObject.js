import Dbm from "../index.js";

export default class LifeCycleObject {
    constructor() {

        if(process.env.NODE_ENV === "development") {
            this._debugId = Math.round(Math.random()*1000000000000);
        }

        this._constructProperties();
        this._construct();
    }

    _constructProperties() {

    }

    _construct() {

    }

    destroy() {
        //METODO
    }
}