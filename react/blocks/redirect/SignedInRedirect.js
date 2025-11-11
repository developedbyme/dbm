import React from "react";
import Dbm from "../../../index.js";

export default class SignedInRedirect extends Dbm.react.BaseObject {

    _construct() {
        super._construct();

        Dbm.flow.runWhenMatched(Dbm.getRepositoryItem("site").getProperty("checkedUser"), true, Dbm.commands.callFunction(this._checkSignedIn.bind(this)));

    }

    _checkSignedIn() {
        console.log("_checkSignedIn");

        if(document.location.href.indexOf("skipRedirect=1") >= 0) {
            return;
        }

        if(Dbm.getRepositoryItem("site").currentUser) {
            let url = Dbm.objectPath(this.context, "blockData.signedInUrl");
            if(url) {
                Dbm.getRepositoryItem("siteNavigation").controller.navigate(url);
            }
        }
        else {
            let url = Dbm.objectPath(this.context, "blockData.signedOutUrl");
            if(url) {
                Dbm.getRepositoryItem("siteNavigation").controller.navigate(url);
            }
        }
    }

    _renderMainElement() {

        return React.createElement("div", {"data-redirect-check": "1"});
    }
}