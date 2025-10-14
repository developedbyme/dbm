import Dbm from "../../index.js";

export default class TranslatedText extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let text = this.getPropValue("text");
        let textId = this.getPropValue("textId");
        let additionalPath = [];
        if(!textId) {
            textId = Dbm.utils.StringFunctions.convertToCamelCase(text);
        }
        let path = this.context.translationPath;

        //METODO: split textId into additional path

        let translation = Dbm.flow.updatefunctions.basic.translation(textId, text, path, additionalPath);

        this.item.requireProperty("translatedText", text).connectInput(translation.output.properties.value);
    }

    _renderMainElement() {
        return Dbm.react.text.text(this.item.properties.translatedText);
    }
}