import React from "react";
import Dbm from "../../index.js";

export default class LoginForm extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("username", "");
        this.item.setValue("password", "");

    }

    _login() {
        console.log("_login");

        let loader = new Dbm.loading.JsonLoader();
        loader.setupJsonPost("/api/user/login", {"username": this.item.username, "password": this.item.password});

        Dbm.flow.addUpdateCommand(loader.item.properties.status, Dbm.commands.callFunction(this._loaderStatusChanged.bind(this), [loader]));

        loader.load();
    }

    _loaderStatusChanged(aLoader) {
        console.log("_loaderStatusChanged");
        console.log(aLoader, aLoader.item.status);

        if(aLoader.item.status === Dbm.loading.LoadingStatus.LOADED) {
            if(aLoader.item.data.success) {
                
                let item = Dbm.getRepositoryItem("graphApi").controller.signIn(aLoader.item.data.data.wsToken);
                Dbm.flow.addUpdateCommand(item.properties.status, Dbm.commands.callFunction(this._graphApiRequestStatusChanges.bind(this), [item, aLoader]));
            }
            else {
                alert("Unable to log in: " + aLoader.item.data.message);
            }
        }
    }

    _graphApiRequestStatusChanges(aRequest, aLoader) {
        console.log("_graphApiRequestStatusChanges");
        console.log(aRequest, aRequest.status);

        if(aRequest.status === Dbm.loading.LoadingStatus.LOADED) {
            let completedCommands = this.getProp("completedCommands");
            if(completedCommands) {
                let currentArray = completedCommands;
                let currentArrayLength = currentArray.length;
                for(let i = 0; i < currentArrayLength; i++) {
                    let currentCommand = currentArray[i];
                    currentCommand.perform(this, aLoader.item.data.data);
                }
                return;
            }

            let site = Dbm.getRepositoryItem("site");
            let queryString = new URLSearchParams(window.location.search);
            let skipRedirect = this.getProp("skipRedirect");

            if(!skipRedirect) {
                let redirectUrl = queryString.get('redirect');
                if(redirectUrl) {
                    Dbm.getRepositoryItem("siteNavigation").controller.navigate(redirectUrl);
                    return;
                }
            }
            
            let action = queryString.get('action');
            if(action) {
                let actionCommand = Dbm.objectPath(site, "loginActions." + action);
                if(actionCommand) {
                    actionCommand.perform(this, aLoader.item.data.data);
                    return;
                }
                console.warn("Unknown action " + action);
            }

            let actionCommand = Dbm.objectPath(site, "loginActions.default");
            if(actionCommand) {
                actionCommand.perform(this, aLoader.item.data.data);
                return;
            }  

            Dbm.getRepositoryItem("siteNavigation").controller.navigate(site.loggedInUrl);
        }
    }

    _renderMainElement() {

        return this._createMainElement("div", {className: "content-narrow"}, 
            React.createElement("div", {className: "body-text"},
                React.createElement("div", {"className": ""},
                    React.createElement("label", {className: "standard-field-label"},
                        "Email"
                    )
                ),
                React.createElement(Dbm.react.form.FormField, {value: this.item.properties.username, className: "standard-field standard-field-padding full-width"}),
                React.createElement("div", {"className": "spacing standard"}),
                React.createElement("div", {"className": ""},
                    React.createElement("label", {className: "standard-field-label"},
                        "Password"
                    )
                ),
                React.createElement(Dbm.react.form.FormField, {type: "password", value: this.item.properties.password, className: "standard-field standard-field-padding full-width"})
            ),
            React.createElement("div", {"className": "spacing standard"}),
            React.createElement("div", {"className": "flex-row justify-center"}, 
                React.createElement("div", {"className": "standard-button standard-button-padding", onClick: () => this._login()}, "Login")
            )
        );
    }
}

