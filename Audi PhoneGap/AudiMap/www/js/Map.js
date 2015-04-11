/**
 * 
 */
function Map() {
	/* Representation of GoogleMap */
	this.map = null;
	/*
	 * String: returns a watch id that references the watch position interval.
	 * The watch id should be used with geolocation.clearWatch to stop watching
	 * for changes in position.
	 */
	this.watchID = null;
	/*
	 * Options to refreshing map, adding new markers.
	 * http://docs.phonegap.com/en/edge/cordova_geolocation_geolocation.md.html#geolocationOptions
	 */
	this.options = null;

	/* Function to create GoogleMap and add start marker to it */
	this.onSuccessMapLoad = function(position) {

		this.options = {
			timeout : 30000
		};

		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var latLong = new google.maps.LatLng(latitude, longitude);

		var mapOptions = {
			center : latLong,
			zoom : 13,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		/* GoogleMap object */
		this.map = new google.maps.Map(document.getElementById("map"),
				mapOptions);
		/* Add first marker */
		this.addMarker(latLong);
	}
	/* Add new marker every options.timeout */
	this.onSuccessMapRefresh = function(position) {
		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var latLong = new google.maps.LatLng(latitude, longitude);
		/* Add new marker */
		this.addMarker(latLong);
	}
	this.addMarker = function(latlng) {
		var marker = new google.maps.Marker({
			position : latlng,
			map : this.map,
			title : 'my location'
		});
	}

}