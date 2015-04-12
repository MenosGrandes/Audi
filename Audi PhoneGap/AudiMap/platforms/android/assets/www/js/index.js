var app = {
	map : null,
	watchID : null,
	startWaypoint:null,
	
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
		
		/*Check Internet connection*/
		app.checkConnection();

		navigator.geolocation.getCurrentPosition(app.onSuccessLoad, app.onErrorGPS);
		var options = {
			timeout : 3000
		};
		app.watchID = navigator.geolocation.watchPosition(app.onSuccessRefresh,app.onErrorGPS, options);
	},

	onSuccessLoad : function(position) {
		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var latLong = new google.maps.LatLng(latitude, longitude);

		var mapOptions = {
			center : latLong,
			zoom : 13,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};

		this.map = new google.maps.Map(document.getElementById("map"),
				mapOptions);

		app.startWaypoint = new google.maps.Marker({
			position : latLong,
			map : this.map,
			title : 'my location',
				icon: 'img/startNode.png'
		});
	},
	onSuccessRefresh : function(position) {
		var date = new Date();
		var hour = date.getHours();
		var min = date.getMinutes();
		var seconds = date.getSeconds();
		
		
		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var latLong = new google.maps.LatLng(latitude, longitude);

		var marker = new google.maps.Marker({
			position : latLong,
			map : this.map,	
			title : hour+":"+min+":"+seconds
			});
	},

	onErrorGPS : function(error) {
        navigator.notification.alert(
        		'Could not get the current position. Either GPS signals are weak or GPS has been switched off',  // message
                'Error',            // title
                'Done'                  // buttonName
            );
	},
	
	
	
	checkConnection:function() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        navigator.notification.alert('Connection type: ' + states[networkState],'Info','Done');
    },
};

app.initialize();