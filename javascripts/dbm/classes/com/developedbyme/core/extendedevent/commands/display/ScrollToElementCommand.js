dbm.registerClass("com.developedbyme.core.extendedevent.commands.display.ScrollToElementCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.display.ScrollToElementCommand");
	
	var ScrollToElementCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.display.ScrollToElementCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	var PositionFunctions = dbm.importClass("com.developedbyme.utils.htmldom.PositionFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.display.ScrollToElementCommand::_init");
		
		this.superCall();
		
		this.elementReevaluator = null;
		this.scrollerElementReevaluator = null;
		this.timeReevaluator = null;
		
		this._tempPoint = Point.create();
		this.addDestroyableObject(this._tempPoint);
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.display.ScrollToElementCommand::perform");
		//console.log(aEventDataObject);
		
		var theElement = this.elementReevaluator.reevaluate(aEventDataObject);
		var theScrollerElement = this.scrollerElementReevaluator.reevaluate(aEventDataObject);
		var time = this.timeReevaluator.reevaluate(aEventDataObject);
		
		PositionFunctions.getParentPositionForNode(theElement, theScrollerElement, this._tempPoint);
		
		theScrollerElement.scrollTop = this._tempPoint.y;
		
		//console.log(theScrollerElement, theScrollerElement.scrollTop);
		
		//dbm.singletons.dbmAnimationManager.animateVariable(theScrollerElement, "scrollTop", this._tempPoint.y, 0.5, "linear", 0);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.elementReevaluator);
		ClassReference.softDestroyIfExists(this.scrollerElementReevaluator);
		ClassReference.softDestroyIfExists(this.timeReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.elementReevaluator = null;
		this.scrollerElementReevaluator = null;
		this.timeReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aElement, aScrollerElement, aTime) {
		
		aTime = VariableAliases.valueWithDefault(aTime, 0);
		
		var newCommand = (new ClassReference()).init();
		
		newCommand.elementReevaluator = StaticVariableObject.createReevaluationObject(aElement);
		newCommand.scrollerElementReevaluator = StaticVariableObject.createReevaluationObject(aScrollerElement);
		newCommand.timeReevaluator = StaticVariableObject.createReevaluationObject(aTime);
		
		return newCommand;
	}
});