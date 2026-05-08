import Dbm from "../../index.js";

export default class RepositoryProxy extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._setupDefaults();
        this.proxy = new Proxy({}, {get: this._proxy_get_mainProperty.bind(this)});
    }

    _setupDefaults() {
        this.reposityPrefix = "";
        this.propertyName = "(self)";
    }

    _setupItem(aItem, aFullPath) {
        //MENOTE: shoud be overridden
    }

    _getProperty(aTarget, aPropertyName, aPrefix) {
        //MENOTE: this is not called directly by the proxy get function, but looks very similar

        if(aTarget[aPropertyName]) {
            return aTarget[aPropertyName];
        }

        
        let firstLetter = aPropertyName.charAt(0);
        let fullPath = aPrefix + aPropertyName;

        if (firstLetter >= 'A' && firstLetter <= 'Z') {
            let item = Dbm.repository.getItemIfExists(fullPath);
            if(!item) {
                let item = Dbm.repository.getItem(fullPath);
                this._setupItem(item, fullPath);
            }

            return Dbm.objectPath(item, this.propertyName);
        }

        aTarget[aPropertyName] = this._getProxyWithPrefix(fullPath + "/");

        return aTarget[aPropertyName];
    }

    _proxy_get_mainProperty(aTarget, aPropertyName, aReceiver) {
        return this._getProperty(aTarget, aPropertyName, this.reposityPrefix);
    }

    _getProxyWithPrefix(aPrefix) {

        let proxyFunction = function(aTarget, aPropertyName, aReceiver) {
            return this._getProperty(aTarget, aPropertyName, aPrefix);
        }

        let proxy = new Proxy({}, {get: proxyFunction.bind(this)});

        return proxy;
    }
}