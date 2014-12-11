require(
	["dbm/dbm"],
	function(dbm) {
		require(
			["dbm/setup/defaultSetup", "dbm/gui/DisplayBaseObject"],
			function(defaultSetupNull, DisplayBaseObject) {
				console.log("startup");
				dbm.setup(window, document, null, null);
				dbm.externalStart();
				console.log(dbm, DisplayBaseObject);
				
				var newDisplayObject = DisplayBaseObject.createDiv(dbm.getDocument(), true, null);
			}
		);
	}
);