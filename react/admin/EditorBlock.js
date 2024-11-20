import Dbm from "../../index.js";

export default class EditorBlock extends Dbm.core.BaseObject {

    constructor(aSettings){
        super();

        this._settings = aSettings;

        this.item.setValue("data", aSettings.data ? aSettings.data : {});
        this.item.setValue("name", aSettings.config ? aSettings.config.name : "Unnamed block");
        this.item.setValue("module", Dbm.getInstance().repository.getItem("moduleCreators/blocks/editor/" + aSettings.config.module));

    }

    render(){
        //console.log("render");

        let holderElement = document.createElement('div');
        this.item.setValue("holderElement", holderElement);

        let module = this.item.module.controller;

        if(module) {
            let moduleData = {};
            moduleData["editorData"] = this.item;

            module.createModule(holderElement, moduleData);
        }
        else {
            console.warn("No module for block " + this.item.module.id);
        }

        return this.item.holderElement;
    }
  
    save(aHolderElement){
        console.log("save");
        console.log(aHolderElement);

        return this.item.data;
    }

    static get toolbox() {

        //'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" id="Module--Streamline-Streamline-3.0" height="16" width="16"><desc>Module Streamline Icon: https://streamlinehq.com</desc><g><path d="M14.21875 2.65625a0.625 0.625 0 0 1 0.46875 0.625v8.4375a0.625 0.625 0 0 1 -0.42500000000000004 0.59375l-6.55625 2.34375a0.625 0.625 0 0 1 -0.41250000000000003 0L0.725 12.318750000000001a0.625 0.625 0 0 1 -0.41250000000000003 -0.5874999999999999V3.2624999999999997a0.625 0.625 0 0 1 0.46875 -0.625L7.34375 0.33125000000000004a0.6625000000000001 0.6625000000000001 0 0 1 0.3125 0Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="m7.5 5.29375 0 9.393749999999999" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path><path d="M14.51875 2.8375 7.5 5.29375 0.48125 2.8375" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path></g></svg>'

        return {
          title: 'DbmBlock',
          icon: null
        };
      }
  }