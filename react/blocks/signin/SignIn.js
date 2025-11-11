import React from "react";
import Dbm from "../../../index.js";

export default class SignIn extends Dbm.react.BaseObject {

    _construct() {
        super._construct();
    }

    _renderMainElement() {

        return React.createElement(Dbm.react.login.LoginForm, {});
    }
}