import Dbm from "../../index.js";
import React from "react";

export default class DesignRepositoryProxy extends Dbm.repository.proxy.RepositoryProxy {
    
    _setupDefaults() {
        this.reposityPrefix = "react/design/";
        this.propertyName = "reactClass";
    }

    _setupItem(aItem, aFullPath) {
        console.log("_setupItem");
        console.log(aItem, aFullPath);

        let className = aFullPath.split("/").pop();
        let element = React.createElement("div", {"className": "missing-design-element", "data-repository-path": aFullPath}, className)

        let DynamicDesignElement = Dbm.react.dynamic.setupDesignItem(aItem, element, [], []);

        aItem.requireProperty(this.propertyName, DynamicDesignElement);
    }
}