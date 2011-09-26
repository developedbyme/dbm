dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject");	
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject::init");
		
		this.superCall();
		
		this.setTimes(0, 1);
		
		return this;
	};
	
	objectFunctions.setTimes = function(aStartTime, aEndTime) {
		
		this.startTime = aStartTime;
		this.endTime = aEndTime;
		this.startApplyTime = aStartTime;
		this.endApplyTime = aEndTime;
		
		return this;
	};
	
	objectFunctions.setTimeToGlobal = function() {
		
		this.endTime = this.startTime+1;
		
		return this;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		//MENOTE: should be overridden
		//METODO: error meassage
		return null;
	};
	
	objectFunctions.getTangentByParameter = function(aParameter) {
		var tangent = (this.getValueByParameter(aParameter+0.01)-this.getValueByParameter(aParameter-0.01))/0.02;
		return tangent;
	};
	
	objectFunctions.getValueAt = function(aTime) {
		if(aTime == this.endTime || this.startTime == this.endTime) {
			return this.getValueByParameter(1);
		}
		else if(aTime == this.startTime) {
			return this.getValueByParameter(0);
		}
		return this.getValueByParameter((aTime-this.startTime)/(this.endTime-this.startTime));
	};
	
	objectFunctions.getTangentAt = function(aTime) {
		if(aTime == this.endTime || this.startTime == this.endTime) {
			return this.getTangentByParameter(1);
		}
		else if(aTime == this.startTime) {
			return this.getTangentByParameter(0);
		}
		return this.getTangentByParameter((aTime-this.startTime)/(this.endTime-this.startTime));
	};
});