var Map = {
		/*Google Map Object*/
var googleMap:null,
/*Array of Waypoints.Start Waypoint is on 0 index, last on last*/
var waypointsArray = [],
/**/
		onSuccessLoad : function(position) {
			var longitude = position.coords.longitude;
			var latitude = position.coords.latitude;
			var latLong = new google.maps.LatLng(latitude, longitude);

			var mapOptions = {
				center : latLong,
				zoom : 3,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};

			this.googleMap = new google.maps.Map(document.getElementById("map"),
					mapOptions);
			//addWaypoint(latLong,'img/startNode.png');
			
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
			//addWaypoint(latLong);

		},
		/**/
		addWaypoint : function(latLong)
		{
			var infowindow = new google.maps.InfoWindow({
			      content: hour + ":" + min + ":" + seconds
			  });
			var marker = new google.maps.Marker({
				position : latLong,
				map : this.googleMap,
				title : "New Marker"
			});
			
			  google.maps.event.addListener(marker, 'click', function() {
				    infowindow.open(this.googleMap,marker);
				  });
			this.waypointsArray.push(marker);
		},
		/**/
		addWaypoint : function(latLong,_icon)
		{
			var infowindow = new google.maps.InfoWindow({
			      content: hour + ":" + min + ":" + seconds
			  });
			var marker = new google.maps.Marker({
				position : latLong,
				map : this.googleMap,
				title : "New Marker",
				icon : _icon
			});
			
			  google.maps.event.addListener(marker, 'click', function() {
				    infowindow.open(this.googleMap,marker);
				  });
			  this.waypointsArray.push(marker);
		}
		
}