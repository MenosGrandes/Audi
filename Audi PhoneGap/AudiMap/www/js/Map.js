var Map = {
	/* Google Map Object */
	googleMap : null,
	/* Array of Waypoints.Start Waypoint is on 0 index, last on last */
	waypointsArray : [],
	/**/

	/**/
	addWaypoint : function(latLong) {
		/*
		 * var infowindow = new google.maps.InfoWindow({ content: hour + ":" +
		 * min + ":" + seconds });
		 */
		var marker = new google.maps.Marker({
			position : latLong,
			map : Map.googleMap,
			title : "New Marker"
		});
		/*
		 * google.maps.event.addListener(marker, 'click', function() {
		 * infowindow.open(Map.googleMap,marker); });
		 */
		Map.waypointsArray.push(marker);
	},
	/**/
	addWaypoint : function(latLong, _icon) {/*
											 * var infowindow = new
											 * google.maps.InfoWindow({ content:
											 * hour + ":" + min + ":" + seconds
											 * });
											 */
		var marker = new google.maps.Marker({
			position : latLong,
			map : Map.googleMap,
			title : "New Marker",
			icon : _icon
		});
		/*
		 * google.maps.event.addListener(marker, 'click', function() {
		 * infowindow.open(Map.googleMap,marker); });
		 */
		Map.waypointsArray.push(marker);
	},

	/**/
	onSuccessLoad : function(position) {
		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var latLong = new google.maps.LatLng(latitude, longitude);

		var mapOptions = {
			center : latLong,
			zoom : 25,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};

		Map.googleMap = new google.maps.Map(document.getElementById("map"),
				mapOptions);
		Map.addWaypoint(latLong, 'img/startNode.png');

	},
	/**/
	onSuccessRefresh : function(position) {
		var date = new Date();
		var hour = date.getHours();
		var min = date.getMinutes();
		var seconds = date.getSeconds();

		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var latLong = new google.maps.LatLng(latitude, longitude);
		Map.addWaypoint(latLong);

	}

}