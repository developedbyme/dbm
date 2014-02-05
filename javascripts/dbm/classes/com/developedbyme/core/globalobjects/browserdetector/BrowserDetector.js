dbm.registerClass("com.developedbyme.core.globalobjects.browserdetector.BrowserDetector", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.browserdetector.BrowserDetector");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var Application = dbm.importClass("com.developedbyme.core.globalobjects.browserdetector.data.Application");
	
	dbm.setClassAsSingleton("dbmBrowserDetector");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.browserdetector.BrowserDetector::_init");
		
		this.superCall();
		
		this.operatingSystem = null;
		this.browserName = null;
		this.browserVersion = null;
		this.device = null;
		this.deviceType = null;
		this.renderEngine = null;
		
		this._applications = (new NamedArray()).init();
		
		return this;
	};
	
	objectFunctions.setupApplications = function(aUserAgentString) {
		//console.log("om.developedbyme.core.globalobjects.browserdetector.BrowserDetector::setupApplications");
		//console.log(aUserAgentString);
		
		var currentStartPosition = 0;
		
		while(currentStartPosition < aUserAgentString.length) {
			var slashPosition = aUserAgentString.indexOf("/", currentStartPosition);
			if(slashPosition !== -1) {
				var spacePosition = aUserAgentString.indexOf(" ", slashPosition);
				if(spacePosition === -1) {
					spacePosition = aUserAgentString.length;
				}
				var applicationAndVersion = aUserAgentString.substring(currentStartPosition, spacePosition);
				var lastSlashIndex = applicationAndVersion.lastIndexOf("/");
				var applicationName = applicationAndVersion.substring(0, lastSlashIndex);
				var applicationVersion = applicationAndVersion.substring(lastSlashIndex+1, applicationAndVersion.length);
				var applicationComment = null;
				var applicationSquareBracketComment = null;
				
				if(aUserAgentString.charAt(spacePosition+1) === "[") {
					//MENOTE: square brackets aren't allowed, this is for browsers not conforming to standards.
					var endBracketPosition = aUserAgentString.indexOf("]", spacePosition+1);
					if(endBracketPosition === -1) {
						//METODO: error message
						break;
					}
					applicationSquareBracketComment = aUserAgentString.substring(spacePosition+2, endBracketPosition);
					spacePosition = endBracketPosition+1;
				}
				if(aUserAgentString.charAt(spacePosition+1) === "(") {
					var endBracketPosition = aUserAgentString.indexOf(")", spacePosition+1);
					if(endBracketPosition === -1) {
						//METODO: error message
						break;
					}
					applicationComment = aUserAgentString.substring(spacePosition+2, endBracketPosition);
					spacePosition = endBracketPosition+1;
				}
				currentStartPosition = spacePosition+1;
				
				var newApplication = (new Application()).init();
				newApplication.setData(applicationName, applicationVersion, applicationComment, applicationSquareBracketComment);
				this._applications.addObject(applicationName.toLowerCase(), newApplication);
			}
			else {
				//METODO: error message
				break;
			}
		}
	};
	
	objectFunctions.detectBrowser = function(aUserAgentString) {
		this.setupApplications(aUserAgentString);
		
		var firstBrowser = this.getFirstApplicationOf(["Camino", "Chrome", "Firefox", "CriOS", "Mobile Safari", "OmniWeb", "Opera", "Safari"]);
		var mozillaApplication = this.getApplicationByName("Mozilla");
		if(mozillaApplication === null) {
			mozillaApplication = this.getApplication(0);
		}
		var commentsArray = null;
		if(mozillaApplication !== null) {
			commentsArray = mozillaApplication.comment.split(";");
		}
		
		this.deviceType = "screen";
		
		if(commentsArray) {
			this.device = commentsArray[0];
			this.operatingSystem = commentsArray[commentsArray.length-1];
			switch(this.device) {
				case "BlackBerry":
				case "iPad":
				case "iPhone":
				case "J2ME/MIDP":
				case "PalmOS":
					this.deviceType = "handheld";
					break;
				default:
					if(this.device.indexOf("SymbianOS") !== -1) {
						this.deviceType = "handheld";
					}
					break;
			}
			switch(this.operatingSystem) {
				case "Windows CE":
				case "PalmOS":
				case "Symbian OS":
					this.deviceType = "handheld";
					break;
				default:
					if(this.operatingSystem !== null) {
						if(this.operatingSystem.indexOf("Android") !== -1) {
							this.deviceType = "handheld";
						}
						else if(this.operatingSystem.indexOf("Linux armv") !== -1) {
							this.deviceType = "handheld";
						}
					}
					break;
			}
		}
		
		var firstRenderEngine = this.getFirstApplicationOf(["AppleWebKit", "Gecko", "KHTML", "Presto"]);
		if(firstRenderEngine !== null) {
			this.renderEngine = firstRenderEngine.name;
		}
		
		if(firstBrowser === null) {
			//MENOTE: check for internet explorerer on konqueror
			if(commentsArray !== null) {
				if(commentsArray[1].indexOf("MSIE") !== -1) {
					this.browserName = "MSIE";
					this.browserVersion = commentsArray[1].substring(commentsArray[1].indexOf("MSIE")+5, commentsArray[1].length);
					this.renderEngine = commentsArray[4];
				}
				
				else if(commentsArray[1].indexOf("Konqueror") !== -1) {
					this.browserName = "Konqueror";
					this.browserVersion = commentsArray[1].substring(commentsArray[1].indexOf("/")+1, commentsArray[1].length);
				}
			}
		}
		else {
			this.browserName = firstBrowser.name;
			if(this.browserName === "Safari") {
				var versionApplication = this.getApplicationByName("Version");
				if(versionApplication !== null) {
					this.browserVersion = versionApplication.version;
				}
			}
			else {
				this.browserVersion = firstBrowser.version;
			}
		}
		
		//METODO: check versions application on safari
		
		//console.log(this.operatingSystem, this.browserName, this.browserVersion, this.device, this.deviceType, this.renderEngine);
		//console.log(this._applications.getObjectsArray());
	};
	
	objectFunctions.detectBrowserFromUserAgent = function(aUserAgentString) {
		this.detectBrowser(navigator.userAgent);
	};
	
	objectFunctions.getApplication = function(aIndex) {
		return this._applications.getObjectsArray()[aIndex];
	};
	
	objectFunctions.getApplicationByName = function(aName) {
		//console.log("com.developedbyme.core.globalobjects.browserdetector.BrowserDetector::getApplicationByName");
		return this._applications.getObject(aName.toLowerCase());
	};
	
	objectFunctions.getFirstApplicationOf = function(aNamesArray) {
		//console.log("com.developedbyme.core.globalobjects.browserdetector.BrowserDetector::getApplicationByName");
		var currentArray = aNamesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(this._applications.select(currentArray[i].toLowerCase())) {
				return this._applications.currentSelectedItem;
			}
		}
		//METODO: error message
		return null;
	};
});