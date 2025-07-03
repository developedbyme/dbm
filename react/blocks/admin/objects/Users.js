import React from "react";
import Dbm from "../../../../index.js";

export default class Users extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        return React.createElement("div", {className: "content-narrow"}, 
            React.createElement(Dbm.react.admin.objects.UserList, {})
        );
    }
}