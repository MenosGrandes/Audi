/**
 * 
 */
var GPSErrorHandler = {
	checkGPSConnection : function() {
		navigator.notification
				.alert(
						'Could not get the current position. Either GPS signals are weak or GPS has been switched off', // message
						'Error', // title
						'Done' // buttonName
				);
	}

}
