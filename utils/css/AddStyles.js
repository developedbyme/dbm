import Dbm from "../../index.js";

export default class AddStyles extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._updateCommand = this._getScopedCallFunctionCommand(this.updateStyles);

        this.item.requireProperty("element", null).addUpdate(this._updateCommand);
        this.item.requireProperty("styles", []).addUpdate(this._updateCommand);
    }

    setElement(aElement) {
        this.item.element = aElement;

        return this;
    }

    createHeadElement() {
        let element = document.createElement("style");
        document.head.appendChild(element);
        this.setElement(element);

        return this;
    }

    updateStyles() {

        let declarations = Dbm.utils.ArrayFunctions.mapField(this.item.styles, "cssDeclaration");

        if(this.item.element) {
            this.item.element.innerHTML = declarations.join("\n");
        }
    }

    createStyle(aName, aDeclaration) {
        let styleItem = new Dbm.repository.Item();
        styleItem.requireProperty("name", aName);
        styleItem.requireProperty("cssDeclaration", "." + CSS.escape(aName) + "{" + aDeclaration + "}").addUpdate(this._updateCommand);

        this.item.addToArray("styles", styleItem);

        return styleItem;
    }

    createGroupedStyle(aGroupName, aName, aDeclaration) {
        let styleItem = new Dbm.repository.Item();
        styleItem.requireProperty("groupName", aGroupName);
        styleItem.requireProperty("name", aName);
        let selectors = [
            "." + CSS.escape(aGroupName + ":" + aName),
            "." + CSS.escape("group(" + aGroupName + ":" + aName + ")") + " " + "." + CSS.escape("use(" + aGroupName + ")")
        ];
        styleItem.requireProperty("cssDeclaration", selectors.join(", ") + "{" + aDeclaration + "}").addUpdate(this._updateCommand);

        this.item.addToArray("styles", styleItem);

        return styleItem;
    }
}