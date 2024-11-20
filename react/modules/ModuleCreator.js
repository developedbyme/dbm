import Dbm from "../../index.js";
import {createRoot} from 'react-dom/client';
import {createElement} from "react";

export default class ModuleCreator extends Dbm.core.BaseObject {
    constructor() {
        super();

        this._mainElement = null;
    }

    setMainElement(aElement) {
        this._mainElement = aElement;

        return this;
    }

    createModule(aHolderNode, aData) {
        //console.log("createModule");
        //console.log(this, aData);

        let root = createRoot(aHolderNode);

        let elementWithInjections = createElement(Dbm.react.context.Context.Provider, {value: {moduleCreator: this, moduleData: aData, moduleRoot: root}}, this._mainElement);

        root.render(elementWithInjections);

        return root;
    }
}