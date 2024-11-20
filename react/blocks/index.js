import Dbm from "../../index.js";
import {createElement} from "react";

let createToolConfiguration = function(aId, aName, aInitialData = {}, aIcon = null) {

    let returnObject = {
        "class": Dbm.react.admin.EditorBlock,
        "config": {
            "module": aId,
            "name": aName,
        },
        "data": aInitialData,
        "toolbox": {
            title: aName,
            icon: aIcon
        }  
    }

    return returnObject;
}

export let registerAllBlocks = function() {

    let displayNameModule = new Dbm.react.modules.ModuleCreator();

    let displayNameEditor = createElement(Dbm.react.admin.EditorBlockName, {});
    displayNameModule.setMainElement(displayNameEditor);

    let editorConfigItem = Dbm.getInstance().repository.getItem("editorjs");
    let tools = editorConfigItem.tools ? {...editorConfigItem.tools} : {};

    {
        let moduleName = "cookie/settings";
        
        let editorItem = new Dbm.repository.Item();
        editorItem.setValue("controller", displayNameModule);
        editorItem.register("moduleCreators/blocks/editor/" + moduleName);

        let elementItem = new Dbm.repository.Item();
        elementItem.setValue("element", createElement(Dbm.react.cookies.CookieSettings));
        elementItem.register("blocks/" + moduleName);

        tools[moduleName] = createToolConfiguration(moduleName, "Cookie settings");
    }

    {
        let moduleName = "login/loginForm";
        
        let editorItem = new Dbm.repository.Item();
        editorItem.setValue("controller", displayNameModule);
        editorItem.register("moduleCreators/blocks/editor/" + moduleName);

        let elementItem = new Dbm.repository.Item();
        elementItem.setValue("element", createElement(Dbm.react.login.LoginForm));
        elementItem.register("blocks/" + moduleName);

        tools[moduleName] = createToolConfiguration(moduleName, "Login form");
    }

    editorConfigItem.setValue("tools", tools);
}