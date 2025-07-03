import React from "react";
import Dbm from "../../../index.js";

export default class UserList extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("username", "");
        this.item.requireProperty("password", "");
        this.item.requireProperty("role", null);

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

        this.item.requireProperty("items", []);

        let encodings = ["admin_user"];

        let allLoaded = Dbm.flow.updatefunctions.logic.allAtValue(Dbm.loading.LoadingStatus.LOADED);
        this.item.requireProperty("loaded", false);

        {
            let request = graphApi.requestRange(
                [
                    {"type": "includePrivate"},
                    {"type": "includeDraft"},
                    {"type": "byObjectType", "objectType": "user"},
                ],
                encodings
            );
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._loaded.bind(this), [request]));
            allLoaded.addCheck(request.properties.status);
        }

        this.item.properties.loaded.connectInput(allLoaded.output.properties.value);
    }

    _loaded(aRequest) {
        console.log("_loaded");

        let currentArray = [].concat(aRequest.items);

        let nameField = this.getPropValueWithDefault("nameField", "name");
        Dbm.utils.ArrayFunctions.sortOnField(currentArray, nameField);
        
        this.item.items = currentArray;
    }

    _create() {
        console.log("_create");

        let data = {
            username: this.item.username,
            password: this.item.password,
            role: this.item.role,
        };

        let request = Dbm.getInstance().repository.getItem("graphApi").controller.performAction("admin/addUser", data);

        Dbm.flow.addUpdateCommand(request.properties.status, Dbm.commands.callFunction(this._created.bind(this), [request]));
    }

    _created(aRequest) {
        console.log("_created");
        console.log(aRequest);

        if(aRequest.data.id) {
            if(!aRequest.data.created) {
                alert("User already exists. No changes made.");
            }
            Dbm.getInstance().repository.getItem("siteNavigation").controller.navigate("/admin/users/user/?id=" + aRequest.data.id);
        }
        else {
            alert("An error occured");
        }
    }

    _renderMainElement() {

        let id = Dbm.react.source.contextVariable("item.id");
        let text = Dbm.react.source.contextVariable("item.username");

        return React.createElement("div", {"className": "standard-alternating-rows"},
            React.createElement(Dbm.react.area.List, {items: this.item.properties.items},
                React.createElement(Dbm.react.admin.objects.UserListRow, {"id": id, "text": text})
            ),
            React.createElement("div", {"className": "spacing standard"}),
            React.createElement("h2", {"className": "no-margins"},
                "New user"
            ),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement(Dbm.react.form.LabelledArea, {"label": "Username"}),
            React.createElement(Dbm.react.form.FormField, {"className": "standard-field standard-field-padding full-width",
                value: this.item.properties.username,
                type: "email",
                name: "username",
                autoComplete: "username"
            }),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement(Dbm.react.form.LabelledArea, {"label": "Password"}),
            React.createElement(Dbm.react.form.FormField, {"className": "standard-field standard-field-padding full-width",
                value: this.item.properties.password,
                type: "password",
                name: "new-password",
                autoComplete: "new-password"}),
            React.createElement("div", {"className": "spacing small"}),
            React.createElement(Dbm.react.form.LabelledArea, {"label": "Role"}),
            React.createElement(Dbm.react.form.Selection, {"className": "standard-field standard-field-padding full-width", value: this.item.properties.role},
                React.createElement("option", {"value": null}, "None"),
                React.createElement("option", {"value": "editor"}, "Editor"),
                React.createElement("option", {"value": "admin"}, "Admin"),
            ),
            React.createElement("div", {"className": "spacing standard"}),
            React.createElement("div", {"className": "flex-row"},
                React.createElement("div", {"className": "flex-row-item"},
                    React.createElement(Dbm.react.interaction.CommandButton, {"command": Dbm.commands.callFunction(this._create.bind(this))},
                        React.createElement("div", {"className": "standard-button standard-button-padding"}, "Create")
                    )
                )
            )
            
        )
    }
}