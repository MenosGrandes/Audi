
var app = {
	watchID : null,
	// Application Constructor
	initialize : function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady : function() {
		// app.receivedEvent('deviceready');

		/* Check Internet connection */
		// InternetErrorHandler.checkInternetConnection();
		/**/
		// GPSErrorHandler.checkGPSConnection();

		navigator.geolocation.getCurrentPosition(Map.onSuccessLoad,
				GPSErrorHandler.checkGPSConnection);
				
		app.watchID = navigator.geolocation.watchPosition(Map.onSuccessRefresh,
				GPSErrorHandler.checkGPSConnection,        { frequency: 3000, enableHighAccuracy: true }););
	},

};

app.initialize();