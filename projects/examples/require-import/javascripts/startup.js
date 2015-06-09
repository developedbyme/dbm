require(
	["dbm/dbm"],
	function(dbm) {
		require(
			["dbm/setup/defaultSetup", "Application"],
			function(defaultSetupNull, Application) {
				console.log("startup");
				dbm.setup(window, document, null, null);
				dbm.externalStart();
				
				var runningInstance = (new Application()).init();
				runningInstance.start();
			}
		);
	}
);