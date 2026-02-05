import Dbm from "../index.js";

export default class KeywordReplace extends Dbm.core.BaseObject {
    
    _construct() {
		super._construct();

        this.item.setValue("keywordStart", "{{");
        this.item.setValue("keywordMatch", "[^\\{\\}]*");
        this.item.setValue("keywordEnd", "}}");

        this.item.setValue("keywordProviders", []);
        this.addKeywordProvider("default", {});
		
		return this;
	}
	
	addKeyword(aKeyword, aValue) {
        this.item["keywordProvider/default"][aKeyword] = aValue;

        return this;
    }

    addKeywordProvider(aName, aKeywordProvider) {
        this.item.addToArray("keywordProviders", aKeywordProvider);
        this.item.setValue("keywordProvider/" + aName, aKeywordProvider);

        return this;
    }

    escapeRegex(aText) {
        return aText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    _getRegex() {
        let keywordStart = this.escapeRegex(this.item.keywordStart);
        let keywordEnd = this.escapeRegex(this.item.keywordEnd);

        let regex = new RegExp(keywordStart + "\\s*(" + this.item.keywordMatch + ")\\s*" + keywordEnd, "g");

        return regex;
    }

    _trimRegexKey(aRegexResult) {
        let normalizedKey = aRegexResult[1].replace(/\s+/g, "");
        return normalizedKey;
    }

    findKeywords(aText) {

        let regex = this._getRegex();

        let keywords =  [...regex].map(this._trimRegexKey);

        return keywords;
    }

    getKeywordValue(aKeyword) {

        let index = aKeyword.indexOf(":");
        if(index === -1) {
            let currentArray = this.item.keywordProviders;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let provider = currentArray[i];
                let value = Dbm.objectPath(provider, aKeyword);
                if(value !== undefined) {
                    return value;
                }
            }
        }
        else {
            let group = aKeyword.substring(0, index);
            let keyword = aKeyword.substring(index+1);

            let value = Dbm.objectPath(this.item["keywordProvider/" + group], keyword);
            if(value !== undefined) {
                return value;
            }
        }

        return null;
    }

    _regexReplaceKeyword(aFullMatch, aKey) {
        let normalizedKey = aKey.replace(/\s+/g, "");

        let newValue = this.getKeywordValue(normalizedKey);
        if(newValue) {
            return newValue;
        }

        return aFullMatch;
    }

    replaceKeywords(aText) {
        let newText = aText.replace(this._getRegex(), this._regexReplaceKeyword.bind(this));

        console.log(newText);
        return newText;
    }
}