import Dbm from "../../index.js";

export default class WebSocketRequest extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

    }

    get processPromise() {
        if(this.item.status === Dbm.loading.LoadingStatus.LOADED) {
            return Promise.resolve(this.item);
        }
        if(this.item.status === Dbm.loading.LoadingStatus.LOADING || this.item.status === Dbm.loading.LoadingStatus.NOT_STARTED) {
            if(!this.item.processPromise) {
                let resolveCommand = Dbm.commands.resolvePromise(this.item);
                this.item.setValue("doneCommands", [resolveCommand]);
                let rejectCommand = Dbm.commands.callFunction(resolveCommand.item.reject, []);
                this.item.setValue("errorCommands", [rejectCommand]);
    
                //METODO: change these to addToArray

                this.item.setValue("processPromise", resolveCommand.item.promise);
            }
            
            return this.item.processPromise;
        }
        
        return Promise.reject();
    }
}