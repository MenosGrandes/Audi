// controller.js
var Map = {
	track_id : '', // Name/ID of the exercise
	watch_id : null, // ID of the geolocation
	tracking_data : [], // Array containing GPS position objects
	map : null,
	total_km : 0,
	tracking_status : "",

	gps_distance : function(lat1, lon1, lat2, lon2) {
		// http://www.movable-type.co.uk/scripts/latlong.html
		var R = 6371; // km
		var dLat = (lat2 - lat1) * (Math.PI / 180);
		var dLon = (lon2 - lon1) * (Math.PI / 180);
		lat1 *= (Math.PI / 180);
		lat2 *= (Math.PI / 180);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2)
				* Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	},
	calculateTotalKmFromMap : function() {
		if (document.getElementById("track_info_info") != null) {
			// position.coords;
			Map.total_km = 0;

			for ( var i = 0; i < Map.tracking_data.length; i++) {

				if (i == (Map.tracking_data.length - 1)) {
					break;
				}
				Map.total_km += Map.gps_distance(
						Map.tracking_data[i].coords.latitude,
						Map.tracking_data[i].coords.longitude,
						Map.tracking_data[i + 1].coords.latitude,
						Map.tracking_data[i + 1].coords.longitude);
			}

			var total_km_rounded = Map.total_km.toFixed(2);

			// Calculate the total time taken for the track
			var start_time = new Date(Map.tracking_data[0].timestamp).getTime();
			var end_time = new Date(
					Map.tracking_data[Map.tracking_data.length - 1].timestamp)
					.getTime();

			var total_time_ms = end_time - start_time;
			var total_time_s = total_time_ms / 1000;

			var final_time_m = Math.floor(total_time_s / 60);
			var final_time_s = total_time_s - (final_time_m * 60);
			final_time_s = final_time_s.toFixed(3);

			document.getElementById("track_info_info").innerHTML = String('Travelled <strong>'
					+ total_km_rounded
					+ '</strong> km in <strong>'
					+ final_time_m
					+ 'm</strong> and <strong>'
					+ final_time_s
					+ 's</strong>');
			Map.tracking_status = document.getElementById("track_info_info").innerHTML;
		}

	},
	calculateTotalKmFromData : function(data) {
		// position.coords;
		if (document.getElementById("track_info_info") != null) {
			var total_km = 0;

			for ( var i = 0; i < data.length; i++) {

				if (i == (data.length - 1)) {
					break;
				}
				total_km += Map.gps_distance(data[i].coords.latitude,
						data[i].coords.longitude, data[i + 1].coords.latitude,
						data[i + 1].coords.longitude);
			}

			var total_km_rounded = total_km.toFixed(2);

			// Calculate the total time taken for the track
			var start_time = new Date(data[0].timestamp).getTime();
			var end_time = new Date(data[data.length - 1].timestamp).getTime();

			var total_time_ms = end_time - start_time;
			var total_time_s = total_time_ms / 1000;

			var final_time_m = Math.floor(total_time_s / 60);
			var final_time_s = total_time_s - (final_time_m * 60);
			final_time_s = final_time_s.toFixed(3);

			document.getElementById("track_info_info").innerHTML = String('Travelled <strong>'
					+ total_km_rounded
					+ '</strong> km in <strong>'
					+ final_time_m
					+ 'm</strong> and <strong>'
					+ final_time_s
					+ 's</strong>');
			Map.tracking_status = document.getElementById("track_info_info").innerHTML;
		}
	}

};
var Question = {
	points : 0
};
var Animations = {
	set_translate : function(e, pixX, pixY, time) {
		// e.style["-webkit-transform"] = "translate(" pixX +"px," + pixY
		// +"px)";
		// e.style["-moz-transform"] = "translate(0px, -" + pix +"px)";
		// e.style["-ms-transform"] = "translate(0px, -" + pix + "px)";
		// e.style["-o-transform"] = "translate(0px, " + pix + "px)";
		e.style["transform"] = "translate(" + pixX + "px, -" + pixY + "px)";
		e.style["transition-duration"] = time + "s";

	}
};
/*
 * Wymyślłem że pacman zaczyna za nami podąrzać dopiero po zdobyciu przez nas 5
 * waypointów. Jak GPS złapie 5 punktów, czyli już jakaś wartość przebiegliśmy,
 * to na podstawie odległości przebytej: całkowitej dla wszystkich punktów oraz
 * dla każdego punktu z osobna zostanie obliczona średnia prędkość na przebytej
 * odległości i z taką predkośią będzie poruszał się PacMan
 * 
 * Za każdym razem gdy gps złapie piątą z kolei lokalizację ta prędkość będzie
 * korygowana.
 * 
 * Poziom trudności będzie polegał na tym będzie można PacMana zwolnić albo
 * przyspieszyć. Czyli zostanie zaproksymowane z jaką predkością porusza się
 * biegacz i na podstawie tego będzie możan do tej prędkości dodac lub odjąć
 * procentową wartosć.
 * 
 * Czasowe ewenty też wchodzą w gre. W sensie że co jakiś czas PacMan
 * przyspieszy i będzie to sygnalizowane poprzez albo dzwięk albo wibrację
 * 
 */
var Audi = {
	position : 0,
	aproximatePosition : function() {

	}
};
var PacMan = {
	position : 0
};

(function() {
	var app = angular.module('myApp', [ 'onsen','chart.js', 'ngDialog' ]);
	app.factory('theService', function() {
		return {
			msg : {
				id : 0
			}
		};
	});

	// Example of how to set default values for all dialogs
	app.config([ 'ngDialogProvider', function(ngDialogProvider) {
		ngDialogProvider.setDefaults({
			className : 'ngdialog-theme-default',
			plain : false,
			showClose : false,
			closeByDocument : false,
			closeByEscape : false,
			appendTo : false,
			preCloseCallback : function() {
				console.log('default pre-close callback');
			}
		});
	} ]);

	// Sliding menu controller, swiping management
	var SlidingMenuController = function($scope) {

		// app.controller('SlidingMenuController', function ($scope) {

		$scope.checkSlidingMenuStatus = function() {

			$scope.slidingMenu.on('postclose', function() {
				$scope.slidingMenu.setSwipeable(false);
			});
			$scope.slidingMenu.on('postopen', function() {
				$scope.slidingMenu.setSwipeable(true);
			});
		};

		$scope.checkSlidingMenuStatus();
	};

	// Map controller
	// app.controller('MapController', function ($scope, $timeout) {
	var MapController = function($scope, $timeout, theService, ngDialog, $http,
			$window) {

		$scope.openNotify = function() {

			$scope.question = "";
			$scope.A = "";
			$scope.B = "";
			$scope.C = "";
			$scope.ans = "";
			$scope.isAns = true;
			$scope.iconGood = "ion-checkmark-round";
			$scope.iconBad = "ion-close-round";

			$http.get('json/quizNew.json').success(function(data) {
				var x = Math.floor((Math.random() * 15) + 1);
				console.log(data[x]);
				$scope.question = String(data[x].pytanie);
				$scope.A = String(data[x].a);
				$scope.B = String(data[x].b);
				$scope.C = String(data[x].c);
				$scope.ans = String(data[x].odp);

				$scope.iconA = "ion-close-round";
				$scope.iconB = "ion-close-round";
				$scope.iconC = "ion-close-round";
				switch ($scope.ans) {
				case 'a':
					$scope.iconA = "ion-checkmark-round";
					console.log("a");
					break;
				case 'b':
					$scope.iconB = "ion-checkmark-round";
					console.log("b");
					break;
				case 'c':
					$scope.iconC = "ion-checkmark-round";
					//console.log("c");
					break;
				}

			});

			var dialog = ngDialog.open({
				template : 'question.html',
				className : 'ngdialog-theme-plain',
				scope : $scope
			});

			dialog.closePromise.then(function(data) {

				document.getElementById("points").innerHTML = String("Points :"
						+ Question.points);
				$scope.isAns = true;
			});

			$scope.btnClicked = function(btn) {
				if ($scope.isAns) {
					if ($scope.ans == btn) {
						console.log("dobrze");
						Question.points++;

					}

					$scope.isAns = false;

					$timeout(dialog.close, 2000);
				}
			};

		};

		$scope.addZero = function(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		};

		$scope.refreshMap = function() {
			console.log("refresh " + theService.msg);
			document.getElementById("track_info_info").innerHTML = Map.tracking_status;
			if (Map.track_id != null) {
				document.getElementById("trackingStatus").innerHTML = String("Tracking workout: <strong> <br>"
						+ Map.track_id + "</strong>");

			}

			if (theService.msg.id != 0) {
				document.getElementById("audiAnim").className = "";
				document.getElementById("pacmanAnim").className = "";
				var data = window.localStorage.getItem(theService.msg);
				data = JSON.parse(data);

				Map.calculateTotalKmFromData(data);

				var myLatLng = new google.maps.LatLng(data[0].coords.latitude,
						data[0].coords.longitude);

				// Google Map options

				// Create the Google Map, set options
				if (Map.map === null) {
					var myOptions = {
						zoom : 15,
						center : myLatLng,
						mapTypeId : google.maps.MapTypeId.ROADMAP
					};
					Map.map = new google.maps.Map(document
							.getElementById("map_canvas"), myOptions);
				}
				var trackCoords = [];

				// Add each GPS entry to an array
				for (i = 0; i < data.length; i++) {
					trackCoords.push(new google.maps.LatLng(
							data[i].coords.latitude, data[i].coords.longitude));
				}

				// Plot the GPS entries as a line on the Google Map
				var trackPath = new google.maps.Polyline({
					path : trackCoords,
					strokeColor : "#FF0000",
					strokeOpacity : 1.0,
					strokeWeight : 2
				});

				// Apply the line to the map
				trackPath.setMap(Map.map);

			}
		};

		$scope.startWorkout = function() {
			var today = new Date();
			var date = today.toDateString();

			var h = $scope.addZero(today.getHours());
			var m = $scope.addZero(today.getMinutes());
			var s = $scope.addZero(today.getSeconds());

			console.log("startrted tracking");
			Map.watch_id = navigator.geolocation.watchPosition(
			// Success
			function(position) {
				// console.log(position);
				Map.tracking_data.push(position);
				Map.calculateTotalKmFromMap();

				// console.log(String(position));
			},

			// Error
			function(error) {
				console.log(error);
			},

			// Settings
			{
				frequency : 3000,
				enableHighAccuracy : true
			});

			// Tidy up the UI
			Map.track_id = date + " " + h + ":" + m + ":" + s;
			document.getElementById("trackingStatus").innerHTML = String("Tracking workout: <strong> <br>"
					+ Map.track_id + "</strong>");
			// content.innerHTML="Internet Disabled";

			// $("#trackingStatus").html("Tracking workout: <strong> <br>" +
			// track_id + "</strong>");
			document.getElementById("audiAnimID").className = "audiAnim";
			document.getElementById("pacmanAnimID").className = "pacmanAnim";
			document.getElementById("audiAnimID").style.float = "right";

			console.log("pc "
					+ document.getElementById("pacmanAnimID").className);
			console.log("audi "
					+ document.getElementById("audiAnimID").className);

			$timeout($scope.Animate, 2000);

		};
		$scope.Animate = function() {

			Animations.set_translate(document.getElementById("pacmanAnimID"),
					1000, 0, 1);
			// $scope.audiPosition =
			// document.getElementById("pacmanAnimID").getBoundingClientRect().x;
			console.log(document.getElementById("pacmanAnimID").classList);
			// if($scope.audiPosition>$window.innerWidth-150)
			// {
			// console.log("hurrra");
			// }
			$timeout($scope.Animate, 2000);
		};

		$scope.stopWorkout = function() {

			// Stop tracking the user
			navigator.geolocation.clearWatch(Map.watch_id);

			// Save the tracking data
			window.localStorage.setItem(Map.track_id, JSON
					.stringify(Map.tracking_data));
			console.log("stoped " + Map.track_id);
			// Reset watch_id and tracking_data
			Map.watch_id = null;
			Map.tracking_data = [];

			document.getElementById("trackingStatus").innerHTML = String("Stopped tracking workout: <strong> <br>"
					+ Map.track_id + "</strong>");

			console.log("stoped tracking tracking");

		};

		// $scope.goAudi = function()
		// {
		// // console.log($window.innerWidth);
		// if($window.innerWidth>=$scope.leftMargin+200)
		// document.getElementById("pacmanAnimID").setAttribute("style",
		// "margin-left:" + $scope.leftMargin + "px");
		// //document.getElementById("audiAnimID").style.marginLeft=document.getElementById("audiAnimID").style.marginLeft+10+"%";
		//
		// $timeout($scope.goAudi, 5);
		// //
		// console.log(document.getElementById("pacmanAnimID").style.marginLeft);
		// $scope.leftMargin+=1;
		//
		// };

	};

	// app.controller('SettingsController', function ($scope) {
	var SettingsController = function($scope) {

		$scope.checkInternet = function() {
			var content = document.getElementById("button_Internet");

			if (!navigator.onLine) {
				console.log("no internet");
				ons.notification.alert({
					message : 'Internet is OFF.'
				});
				content.innerHTML = "Internet Disabled";
			} else {
				ons.notification.alert({
					message : 'Internet is ON.'
				});
				content.innerHTML = "Internet Enabled";

			}

		};
		$scope.clearHistory = function() {

			window.localStorage.clear();
			ons.notification.confirm({
				message : 'Do you want to clear history?',
				callback : function(idx) {
					switch (idx) {
					case 1:
						window.localStorage.clear();
						ons.notification.alert({
							message : 'Memory cleared.'
						});
						break;
					}
				}
			});

		};

	};

	var HistoryController = function($scope, $timeout, theService) {

		$scope.refreshHistory = function() {

			var tracks_recorded = window.localStorage.length;
			document.getElementById("numberOfExercises").innerHTML = String("<strong>"
					+ tracks_recorded + "</strong> workouts recorded");
			for (i = 0; i < tracks_recorded; i++) {
				var node = document.createElement("LI"); // Create a <li>
				// node
				node.classList.add('list__item');
				node.classList.add("list--inset__item");
				node.classList.add("list__item--chevron");
				node.setAttribute("id", window.localStorage.key(i));
				node.innerHTML = String(window.localStorage.key(i));

				node.addEventListener("click", $scope.clickedExercise, false);
				document.getElementById("historyTrackList").appendChild(node);
			}
		};
		$scope.clickedExercise = function(event) {
			slidingMenu.setMainPage('map.html');
			// console.log(theService.msg);
			if (theService.msg != event.target.id) {
				Map.map = null;
			}
			theService.msg = event.target.id;

			// sharedService.prepForBroadcast({message: 'hujku działaj'});
			// console.log(event.target.id);

		};

        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

	};

	app.controller('HistoryController', HistoryController);
	app.controller('SettingsController', SettingsController);
	app.controller('MapController', MapController);
	app.controller('SlidingMenuController', SlidingMenuController);

})();
