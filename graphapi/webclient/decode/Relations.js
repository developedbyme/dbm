import Dbm from "../../../index.js";

export default class Relations extends Dbm.graphapi.webclient.decode.DecodeBaseObject {
    _construct() {
        super._construct();
    }

    _isRelationValid(aStartTime, aEndTime) {
        let now = (new Date()).toISOString().split("T").join(" ").substring(0, 19);

        return ((aStartTime === null || aStartTime <= now) && (aEndTime === null || aEndTime > now));
    }

    updateItem(aItem, aData) {
        super.updateItem(aItem, aData);

        let relations = aData["relations"];
        {
            let currentRelations = relations["in"];
            let currentRelationsItem = aItem["relations/in"];
            if(!currentRelationsItem) {
                currentRelationsItem = new Dbm.repository.Item();
                aItem.setValue("relations/in", currentRelationsItem);
            }

            let currentArray = currentRelations;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentRelationData = currentArray[i];
                let currentType = currentRelationData["type"];
                let typeItem = currentRelationsItem[currentType];
                if(!typeItem) {
                    typeItem = new Dbm.repository.Item();
                    typeItem.setValue("objects", []);
                    typeItem.setValue("relations", []);
                    currentRelationsItem.setValue(currentType, typeItem);
                }

                let relation = Dbm.getRepositoryItem(currentRelationData["relationId"]);
                if(typeItem.relations.indexOf(relation) === -1) {
                    let linkedItem = Dbm.getRepositoryItem(currentRelationData["id"]);
                    //METODO: add data to relation
                    if(this._isRelationValid(currentRelationData["startAt"], currentRelationData["endAt"])) {
                        typeItem.addToArray("objects", linkedItem);
                        typeItem.addToArray("relations", relation);
                    }
                }
            }
        }

        {
            let currentRelations = relations["out"];
            let currentRelationsItem = aItem["relations/out"];
            if(!currentRelationsItem) {
                currentRelationsItem = new Dbm.repository.Item();
                aItem.setValue("relations/out", currentRelationsItem);
            }

            let currentArray = currentRelations;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentRelationData = currentArray[i];
                let currentType = currentRelationData["type"];
                let typeItem = currentRelationsItem[currentType];
                if(!typeItem) {
                    typeItem = new Dbm.repository.Item();
                    typeItem.setValue("objects", []);
                    typeItem.setValue("relations", []);
                    currentRelationsItem.setValue(currentType, typeItem);
                }

                let relation = Dbm.getRepositoryItem(currentRelationData["relationId"]);
                if(typeItem.relations.indexOf(relation) === -1) {
                    let linkedItem = Dbm.getRepositoryItem(currentRelationData["id"]);
                    //METODO: add data to relation
                    if(this._isRelationValid(currentRelationData["startAt"], currentRelationData["endAt"])) {
                        typeItem.addToArray("objects", linkedItem);
                        typeItem.addToArray("relations", relation);
                    }
                }
            }
        }
    }
}