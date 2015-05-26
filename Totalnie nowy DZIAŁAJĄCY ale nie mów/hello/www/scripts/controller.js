// controller.js
var Map =
{
    track_id: '', // Name/ID of the exercise
    watch_id: null, // ID of the geolocation
    tracking_data: [], // Array containing GPS position objects
    map: null,

     gps_distance: function(lat1, lon1, lat2, lon2) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

};

(function () {
    var app = angular.module('myApp', ['onsen']);

    //Sliding menu controller, swiping management
    app.controller('SlidingMenuController', function ($scope) {

        $scope.checkSlidingMenuStatus = function () {

            $scope.slidingMenu.on('postclose', function () {
                $scope.slidingMenu.setSwipeable(false);
            });
            $scope.slidingMenu.on('postopen', function () {
                $scope.slidingMenu.setSwipeable(true);
            });
        };

        $scope.checkSlidingMenuStatus();
    });

    //Map controller
    app.controller('MapController', function ($scope, $timeout) {

        $scope.points = 0;

        $scope.currentExerciseKm = 0;


        $scope.map;


        $scope.addZero = function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        $scope.showMap = function ()
        {
            /*var data = window.localStorage.getItem(event.target.id);
            data = JSON.parse(data);


            total_km = 0;

            for (i = 0; i < data.length; i++) {

                if (i == (data.length - 1)) {
                    break;
                }

                total_km += Map.gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i + 1].coords.latitude, data[i + 1].coords.longitude);
            }

            total_km_rounded = total_km.toFixed(2);

            // Calculate the total time taken for the track
            start_time = new Date(data[0].timestamp).getTime();
            end_time = new Date(data[data.length - 1].timestamp).getTime();

            total_time_ms = end_time - start_time;
            total_time_s = total_time_ms / 1000;

            final_time_m = Math.floor(total_time_s / 60);
            final_time_s = total_time_s - (final_time_m * 60);
            final_time_s = final_time_s.toFixed(3);

            document.getElementById("track_info_info").innerHTML=String('Travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>')

            // Set the initial Lat and Long of the Google Map
            // Set the initial Lat and Long of the Google Map
            var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

            // Google Map options
            var myOptions = {
                zoom : 15,
                center : myLatLng,
                mapTypeId : google.maps.MapTypeId.ROADMAP
            };

            // Create the Google Map, set options
            var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            var trackCoords = [];

            // Add each GPS entry to an array
            for (i = 0; i < data.length; i++) {
                trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
            }

            // Plot the GPS entries as a line on the Google Map
            var trackPath = new google.maps.Polyline({
                path : trackCoords,
                strokeColor : "#FF0000",
                strokeOpacity : 1.0,
                strokeWeight : 2
            });

            // Apply the line to the map
            trackPath.setMap(map);

*/

        }

        $scope.startWorkout = function () {
            var today = new Date();
            var date = today.toDateString();

            var h = $scope.addZero(today.getHours());
            var m = $scope.addZero(today.getMinutes());
            var s = $scope.addZero(today.getSeconds());

            console.log("startrted tracking");
            Map.watch_id = navigator.geolocation.watchPosition(
                // Success
                function (position) {

                    Map.tracking_data.push(position);
                    /*
                     if (tracking_data.length >= 2) {
                     total_km = 0;

                     for (i = 0; i < tracking_data.length; i++) {

                     if (i == (tracking_data.length - 1)) {
                     break;
                     }

                     total_km += gps_distance(tracking_data[i].coords.latitude, tracking_data[i].coords.longitude, tracking_data[i + 1].coords.latitude, tracking_data[i + 1].coords.longitude);
                     }

                     total_km_rounded = total_km.toFixed(2);

                     currentExerciseKm = total_km_rounded;

                     // Calculate the total time taken for the track
                     start_time = new Date(tracking_data[0].timestamp).getTime();
                     end_time = new Date(tracking_data[tracking_data.length - 1].timestamp).getTime();

                     total_time_ms = end_time - start_time;
                     total_time_s = total_time_ms / 1000;

                     final_time_m = Math.floor(total_time_s / 60);
                     final_time_s = total_time_s - (final_time_m * 60);
                     final_time_s = final_time_s.toFixed(3);
                     $("#track_info_info").html('Travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>');
                     //                if(currentExerciseKm>1)
                     //                  {
                     //                   question();
                     //                  }
                     }
                     */
                    console.log(String(position));
                },

                // Error
                function (error) {
                    console.log(error);
                },

                // Settings
                {
                    frequency: 3000,
                    enableHighAccuracy: true
                });

            // Tidy up the UI
            Map.track_id = date + " " + h + ":" + m + ":" + s;
            document.getElementById("trackingStatus").innerHTML = String("Tracking workout: <strong> <br>" + Map.track_id + "</strong>");
            //content.innerHTML="Internet Disabled";

            // $("#trackingStatus").html("Tracking workout: <strong> <br>" + track_id + "</strong>");
        };

        $scope.stopWorkout = function () {

            // Stop tracking the user
            navigator.geolocation.clearWatch(Map.watch_id);

            // Save the tracking data
            window.localStorage.setItem(Map.track_id, JSON.stringify(Map.tracking_data));
            console.log("stoped " + Map.track_id);
            // Reset watch_id and tracking_data
            Map.watch_id = null;
            Map.tracking_data = [];

            document.getElementById("trackingStatus").innerHTML = String("Stopped tracking workout: <strong> <br>" + Map.track_id + "</strong>");

            console.log("stoped tracking tracking");

        };
        /*
         //Map initialization
         $timeout(function(){

         var latlng = new google.maps.LatLng(35.7042995, 139.7597564);
         var myOptions = {
         zoom: 8,
         center: latlng,
         mapTypeId: google.maps.MapTypeId.ROADMAP
         };
         $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
         $scope.overlay = new google.maps.OverlayView();
         $scope.overlay.draw = function() {}; // empty function required
         $scope.overlay.setMap($scope.map);
         $scope.element = document.getElementById('map_canvas');
         $scope.addOnClick(event);
         });

         },100);

         //Delete all Markers
         $scope.deleteAllMarkers = function(){

         if($scope.markers.length == 0){
         ons.notification.alert({
         message: 'There are no markers to delete!!!'
         });
         return;
         }

         for (var i = 0; i < $scope.markers.length; i++) {

         //Remove the marker from Map
         $scope.markers[i].setMap(null);
         }

         //Remove the marker from array.
         $scope.markers.length = 0;
         $scope.markerId = 0;

         ons.notification.alert({
         message: 'All Markers deleted.'
         });
         };

         $scope.rad = function(x) {
         return x * Math.PI / 180;
         };

         //Calculate the distance between the Markers
         $scope.calculateDistance = function(){

         if($scope.markers.length < 2){
         ons.notification.alert({
         message: 'Insert at least 2 markers!!!'
         });
         }
         else{
         var totalDistance = 0;
         var partialDistance = [];
         partialDistance.length = $scope.markers.length - 1;

         for(var i = 0; i < partialDistance.length; i++){
         var p1 = $scope.markers[i];
         var p2 = $scope.markers[i+1];

         var R = 6378137; // Earth’s mean radius in meter
         var dLat = $scope.rad(p2.position.lat() - p1.position.lat());
         var dLong = $scope.rad(p2.position.lng() - p1.position.lng());
         var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos($scope.rad(p1.position.lat())) * Math.cos($scope.rad(p2.position.lat())) *
         Math.sin(dLong / 2) * Math.sin(dLong / 2);
         var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
         totalDistance += R * c / 1000; //distance in Km
         partialDistance[i] = R * c / 1000;
         }


         ons.notification.confirm({
         message: 'Do you want to see the partial distances?',
         callback: function(idx) {

         ons.notification.alert({
         message: "The total distance is " + totalDistance.toFixed(1) + " km"
         });

         switch(idx) {
         case 0:

         break;
         case 1:
         for (var i = (partialDistance.length - 1); i >= 0 ; i--) {

         ons.notification.alert({
         message: "The partial distance from point " + (i+1) + " to point " + (i+2) + " is " + partialDistance[i].toFixed(1) + " km"
         });
         }
         break;
         }
         }
         });
         }
         };

         //Add single Marker
         $scope.addOnClick = function(event) {
         var x = event.gesture.center.pageX;
         var y = event.gesture.center.pageY-44;
         var point = new google.maps.Point(x, y);
         var coordinates = $scope.overlay.getProjection().fromContainerPixelToLatLng(point);

         var marker = new google.maps.Marker({
         position: coordinates,
         map: $scope.map
         });

         marker.id = $scope.markerId;
         $scope.markerId++;
         $scope.markers.push(marker);


         $timeout(function(){
         //Creation of the listener associated to the Markers click

         google.maps.event.addListener(marker, "click", function (e) {
         ons.notification.confirm({
         message: 'Do you want to delete the marker?',
         callback: function(idx) {
         switch(idx) {
         case 0:
         ons.notification.alert({
         message: 'You pressed "Cancel".'
         });
         break;
         case 1:
         for (var i = 0; i < $scope.markers.length; i++) {
         if ($scope.markers[i].id == marker.id) {
         //Remove the marker from Map
         $scope.markers[i].setMap(null);

         //Remove the marker from array.
         $scope.markers.splice(i, 1);
         }
         }
         ons.notification.alert({
         message: 'Marker deleted.'
         });
         break;
         }
         }
         });
         });
         },1000);


         };
         */
    });


    app.controller('SettingsController', function ($scope) {
        $scope.questionBool = false;
        console.log("SettingsController");
        $scope.checkInternet = function (event) {
            var content = document.getElementById("button_Internet");

            if (!navigator.onLine) {
                console.log("no internet");
                ons.notification.alert({
                    message: 'Internet is OFF.'
                });
                content.innerHTML = "Internet Disabled";
            }
            else {
                ons.notification.alert({
                    message: 'Internet is ON.'
                });
                console.log("internet")
                content.innerHTML = "Internet Enabled";

            }

        };
        $scope.clearHistory = function (event) {

            window.localStorage.clear();
            ons.notification.confirm({
                message: 'Do you want to clear history?',
                callback: function (idx) {
                    switch (idx) {
                        case 1:
                            window.localStorage.clear();
                            ons.notification.alert({
                                message: 'Memory cleared.'
                            });
                            break;
                    }
                }
            });

        };
        //Nie dziala coś wiec olewam

        $scope.switchForQuestions = function (event) {
            var switchQuestion = document.getElementById("questionOnOff");
            $scope.questionBool = switchQuestion.isChecked();
            console.log("asdasdsad");
            //questionOnOff
            //switchQuestion
        };

    });

    app.controller('HistoryController', function ($scope,$timeout) {

        $scope.refreshHistory = function (event) {

            var tracks_recorded = window.localStorage.length;
                document.getElementById("numberOfExercises").innerHTML = String("<strong>" + tracks_recorded + "</strong> workouts recorded");
                for(i=0;i<tracks_recorded;i++)
                {
                    var node = document.createElement("LI");                 // Create a <li> node
                    node.classList.add('list__item');
                    node.classList.add("list--inset__item");
                    node.classList.add("list__item--chevron");
                    node.setAttribute("id",window.localStorage.key(i));
                    node.innerHTML=String(window.localStorage.key(i));

                    node.addEventListener("click", $scope.clickedExercise, false);
                    document.getElementById("historyTrackList").appendChild(node);
                }
        };
        $scope.clickedExercise = function(event)
        {
            slidingMenu.setMainPage('map.html');

        }
    });

})();

