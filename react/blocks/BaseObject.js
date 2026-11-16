import React from "react";
import Dbm from "../../index.js";

export default class BaseObject extends Dbm.react.BaseObject {

    static BLOCK_IDENTIFIER = null;
    
    static registerBlock() {
        if(this.BLOCK_IDENTIFIER) {
            Dbm.react.blocks.registerFrontBlock(this.BLOCK_IDENTIFIER, this.el());
        }
        else {
            console.warn("Missing BLOCK_IDENTIFIER, can't register", this);
        }
    }
}