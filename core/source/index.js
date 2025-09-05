import Dbm from "../../index.js";

export {default as SourceBaseObject} from "./SourceBaseObject.js";
export {default as EventSource} from "./EventSource.js";
export {default as FromObject} from "./FromObject.js";
export {default as StaticSource} from "./StaticSource.js";
export {default as FirstSource} from "./FirstSource.js";

export const event = function(aPath = null) {
	let newSource = new Dbm.core.source.EventSource();
	
	newSource.item.properties.path.setOrConnect(aPath);
	
	return newSource;
}

export const fromObject = function(aPath = null) {
	let newSource = new Dbm.core.source.FromObject();
	
	newSource.item.properties.path.setOrConnect(aPath);
	
	return newSource;
}

export const staticObject = function(aObject, aPath = null) {
	let newSource = new Dbm.core.source.StaticSource();
	
	newSource.item.object = aObject;
	newSource.item.properties.path.setOrConnect(aPath);
	
	return newSource;
}

export const first = function(...aSources) {
	let newSource = new Dbm.core.source.FirstSource();
	
	newSource.item.sources = [].concat(aSources);
	
	return newSource;
}

export const firstWithDefault = function(...aSourcesAndDefault) {
	let newSource = new Dbm.core.source.FirstSource();

	let sources = [].concat(aSourcesAndDefault);
	let defaultValue = sources.pop();
	
	newSource.item.sources = sources;
	newSource.item.properties.defaultValue.setOrConnect(defaultValue);
	
	return newSource;
}
