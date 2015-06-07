// controller.js
var Map = {
    track_id: null, // Name/ID of the exercise
    watch_id: null, // ID of the geolocation
    tracking_data: [], // Array containing GPS position objects
    map: null,
    total_km: 0,
    tracking_status: "0.00",

    gps_distance: function (lat1, lon1, lat2, lon2) {
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
    calculateTotalKmFromMap: function () {
        if (document.getElementById("track_info_info") != null) {

            Map.total_km = 0;

            for (var i = 0; i < Map.tracking_data.length; i++) {

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
            Map.tracking_status = total_km_rounded;
            Clock.clocker(total_km_rounded, "track_info_info");
        }

    },
    calculateTotalKmFromData: function (data) {
        // position.coords;
        if (document.getElementById("track_info_info") != null) {
            var total_km = 0;

            for (var i = 0; i < data.length; i++) {

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
            var final_time_s = parseInt(total_time_s - (final_time_m * 60));


            var total_km_rounded = Map.total_km.toFixed(2);
            Map.tracking_status = total_km_rounded;
            Clock.clocker(total_km_rounded, "track_info_info");
            Clock.clocker(String("0:" + final_time_m + ":" + final_time_s), "clock");

        }
    }

};
var Question = {
    points: 0
};
var Animations = {
    set_translate: function (e, pixX, pixY, time) {
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
var MapStatisticElement =
{
    position: 0,
    time: 0,
    speed: 0

};
var WORKOUT_STATE =
{
    STARTED: 0,
    STOPPED: 1
};
var HumanSizes =
{
    weight: 0,
    height: 0,
    age: 0,
    gender: "male"
};
var Clock =
{
    startDate: 0,
    clock: "0:0:0", // initialise the time variable
    tickInterval: 1000, //ms
    clockTimer: 0,
    clockCanvas2d: null,

    clocker: function (string, element) {

        var canvas = document.getElementById(element);
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");

            ctx.beginPath();
            ctx.fillStyle = "rgb(248, 81, 47)";
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2 - canvas.height * 0.02, 0, 2 * Math.PI, false);
            ctx.fill();

            ctx = canvas.getContext("2d");
            Clock.clockCanvas2d = ctx;
            ctx.font = '18pt Calibri';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.fillText(string, canvas.width / 2, canvas.height / 2);
        }
    },
    calculateTimeDiff: function (option) {

        var diff = Date.now() - Clock.startDate;
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        if (option == 1) {
            return String(hh + ":" + mm + ":" + ss);
        }
        else if (option == 2) {
            Clock.clock = String(hh + ":" + mm + ":" + ss);  // get the current time
        }

    }
};
var Audi = {};
var PacMan = {};
/*http://www.shapesense.com/fitness-exercise/calculators/activity-based-calorie-burn-calculator.aspx
 https://docs.google.com/viewer?a=v&pid=sites&srcid=ZGVmYXVsdGRvbWFpbnxjb21wZW5kaXVtb2ZwaHlzaWNhbGFjdGl2aXRpZXN8Z3g6NmNhZWIwM2FjZjhkMzcxMQ
 */
var Calculations =
{
    R4mph: 6.0,
    R5mph: 8.3,
    R5_2mph: 0.0,
    R6mph: 9.8,
    R6_7mph: 10.5,
    R7mph: 11.0,
    R7_5mph: 11.5,
    R8mph: 11.8,
    R8_6mph: 12.3,
    R9mph: 12.8,
    R10mph: 14.5,
    R11mph: 16.0,
    R12mph: 19.0,
    R13mph: 19.8,
    R14mph: 23.0,
    MileforKm: function (mile) {
        return mile * 1.609344;
    },
    KmforMile: function (km) {
        return km / 1.609344;
    },

    /*
     * Oblicza i zwraca BMR.
     * weight - waga kg
     * height - wzrost cm
     * age - wiek
     * time - czas ćwiczenia w godzinach
     * speed - prędkość biegu (średnia z całego czasu)
     * */
    calculateBMR: function (time, speed) {
        var met = 0;
        var bmr = 0;
        //
        if (speed > 0 && speed < this.MileforKm(4)) {
            met = this.R4mph;
        }
        else if (speed >= this.MileforKm(4) && speed < this.MileforKm(5)) {
            met = this.R5mph;
        }
        else if (speed >= this.MileforKm(5) && speed < this.MileforKm(5.2)) {
            met = this.R5_2mph
        }
        else if (speed >= this.MileforKm(5.2) && speed < this.MileforKm(6)) {
            met = this.R6mph
        }
        else if (speed >= this.MileforKm(6) && speed < this.MileforKm(6.7)) {
            met = this.R6_7mph
        }
        else if (speed >= this.MileforKm(6.7) && speed < this.MileforKm(7)) {
            met = this.R7mph
        }
        else if (speed >= this.MileforKm(7) && speed < this.MileforKm(7.5)) {
            met = this.R7_5mph
        }
        else if (speed >= this.MileforKm(7.5) && speed < this.MileforKm(8)) {
            met = this.R8mph
        }
        else if (speed >= this.MileforKm(8) && speed < this.MileforKm(8.6)) {
            met = this.R8_6mph
        }
        else if (speed >= this.MileforKm(8.6) && speed < this.MileforKm(9)) {
            //console.log("r9mph");
            met = this.R9mph
        }
        else if (speed >= this.MileforKm(9) && speed < this.MileforKm(10)) {
           // console.log("R10mph");
            met = this.R10mph
        }
        else if (speed >= this.MileforKm(10) && speed < this.MileforKm(11)) {
            met = this.R11mph
        }
        else if (speed >= this.MileforKm(11) && speed < this.MileforKm(12)) {
            met = this.R12mph
        }
        else if (speed >= this.MileforKm(12) && speed < this.MileforKm(13)) {
            met = this.R13mph
        }
        else if (speed >= this.MileforKm(13) && speed < this.MileforKm(14)) {
            met = this.R14mph
        }
        else {
            console.log("nie wiem o co chodzi");
        }


        //woman
        if (HumanSizes.gender == "female") {
            bmr = (9.56 * HumanSizes.weight) + (1.85 * HumanSizes.height) - (4.68 * HumanSizes.age) + 655;

        }
        //man
        else {
            bmr = (13.75 * HumanSizes.weight) + (5 * HumanSizes.height) - (6.76 * HumanSizes.age) + 665;
        }
        return ((bmr / 24) * met * time)
    }

};
(function () {
    var app = angular.module('myApp', ['onsen', 'chart.js', 'ngDialog']);
    app.factory('theService', function () {
        return {
            msg: {
                id: 0
            }
        };
    });

    app.factory('mapSettings', function () {
        return {
            msg: {
                data: [],
                track_id :0
            }
        };
    });

    // Example of how to set default values for all dialogs
    app.config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: false,
            closeByDocument: false,
            closeByEscape: false,
            appendTo: false,
            preCloseCallback: function () {
                console.log('default pre-close callback');
            }
        });
    }]);

    // Sliding menu controller, swiping management
    var SlidingMenuController = function ($scope) {

        // app.controller('SlidingMenuController', function ($scope) {

        $scope.checkSlidingMenuStatus = function () {

            $scope.slidingMenu.on('postclose', function () {
                $scope.slidingMenu.setSwipeable(false);
            });
            $scope.slidingMenu.on('postopen', function () {
                $scope.slidingMenu.setSwipeable(true);
            });
        };

        $scope.checkSlidingMenuStatus();
    };


    var MapController = function ($scope, $timeout, theService, ngDialog, $http,mapSettings) {

        $scope.stateOfWorkout = -1;


        var tick = function () {
            Clock.calculateTimeDiff(2);  // get the current time
            Clock.clockTimer = $timeout(tick, Clock.tickInterval); // reset the timer
            Clock.clocker(Clock.clock.toString(), "clock");

            Map.calculateTotalKmFromMap();
        };

        $scope.$watch('stateOfWorkout', function (newValue, oldValue) {
            if ($scope.stateOfWorkout == WORKOUT_STATE.STOPPED) {
                $timeout.cancel(Clock.clockTimer);
                Clock.clock = "0:0:0";
                Clock.clocker(Clock.clock.toString(), "clock");

                console.log("stop");
            }
            else if ($scope.stateOfWorkout == WORKOUT_STATE.STARTED) {
                $timeout(tick, Clock.tickInterval);

            }
        });

        // Start the timer


        $scope.openNotify = function () {

            $scope.question = "";
            $scope.A = "";
            $scope.B = "";
            $scope.C = "";
            $scope.ans = "";
            $scope.isAns = true;
            $scope.iconGood = "ion-checkmark-round";
            $scope.iconBad = "ion-close-round";

            $http.get('json/quizNew.json').success(function (data) {
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
                template: 'question.html',
                className: 'ngdialog-theme-plain',
                scope: $scope
            });

            dialog.closePromise.then(function (data) {

                document.getElementById("points").innerHTML = String("Points :"
                    + Question.points);
                $scope.isAns = true;
            });

            $scope.btnClicked = function (btn) {
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

        $scope.addZero = function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        };

        $scope.refreshMap = function () {


            Clock.clocker("0:0:0", "clock");
            Clock.clocker(Map.tracking_status, "track_info_info");


            if (Map.track_id != null) {
                document.getElementById("trackingStatus").innerHTML = String("Tracking workout: <strong> <br>"
                    + Map.track_id + "</strong>");

            }
            else {
                var today = new Date();
                document.getElementById("trackingStatus").innerHTML = String("Date: <strong> <br>"
                    + today.toDateString() + "</strong>");
            }
///////////////////////////////////////////
            HumanSizes.age = 21;
            HumanSizes.gender = "female";
            HumanSizes.height = 165;
            HumanSizes.weight = 65;

///////////////////////////////////////////
            console.log("checkService id");
            if (theService.msg.id != 0) {


                document.getElementById("audiAnimID").className = "";
                document.getElementById("pacmanAnimID").className = "";


                var data = window.localStorage.getItem(theService.msg);
                data = JSON.parse(data);

                Map.calculateTotalKmFromData(data);
                //
                var myLatLng = new google.maps.LatLng(data[0].coords.latitude,
                    data[0].coords.longitude);

                // Google Map options

                // Create the Google Map, set options
                console.log("before map");
                if (Map.map === null) {
                    var myOptions = {
                        zoom: 15,
                        center: myLatLng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
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
                    path: trackCoords,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                // Apply the line to the map
                trackPath.setMap(Map.map);

                mapSettings.data=data;
                mapSettings.track_id=theService.msg;

            }
        };

        $scope.startWorkout = function () {

            $scope.stateOfWorkout = WORKOUT_STATE.STARTED;
            var today = new Date();
            Clock.startDate = today;
            var date = today.toDateString();

            var h = $scope.addZero(today.getHours());
            var m = $scope.addZero(today.getMinutes());
            var s = $scope.addZero(today.getSeconds());

            console.log("startrted tracking");
            Map.watch_id = navigator.geolocation.watchPosition(
                // Success
                function (position) {
                    // console.log(position);
                    Map.tracking_data.push(position);


                    //console.log(String(position.speed));
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
            document.getElementById("trackingStatus").innerHTML = String("Tracking workout: <strong> <br>"
                + Map.track_id + "</strong>");

            document.getElementById("audiAnimID").className = "audiAnim";
            document.getElementById("pacmanAnimID").className = "pacmanAnim";
            document.getElementById("audiAnimID").style.float = "right";

            // $timeout($scope.Animate, 2000);

        };
        $scope.Animate = function () {

            // Animations.set_translate(document.getElementById("pacmanAnimID"),
            //1000, 0, 1);
            // $scope.audiPosition =
            // document.getElementById("pacmanAnimID").getBoundingClientRect().x;
            //console.log(document.getElementById("pacmanAnimID").classList);
            // if($scope.audiPosition>$window.innerWidth-150)
            // {
            // console.log("hurrra");
            // }
            // $timeout($scope.Animate, 2000);
        };

        $scope.stopWorkout = function () {
            $scope.stateOfWorkout = WORKOUT_STATE.STOPPED;

            // Stop tracking the user
            navigator.geolocation.clearWatch(Map.watch_id);

            // Save the tracking data
            window.localStorage.setItem(Map.track_id, JSON
                .stringify(Map.tracking_data));
            console.log("stoped " + Map.track_id);
            // Reset watch_id and tracking_data

            //$scope.setMapDiagram();

            Map.watch_id = null;
            Map.tracking_data = [];

            document.getElementById("trackingStatus").innerHTML = String("Stopped tracking workout: <strong> <br>"
                + Map.track_id + "</strong>");

            console.log("stoped tracking tracking");

        };


        $scope.clickedStats = function (event) {
            slidingMenu.setMainPage('mapStats.html');
        };

    };

// app.controller('SettingsController', function ($scope) {
    var SettingsController = function ($scope) {

        $scope.checkInternet = function () {
            var content = document.getElementById("button_Internet");

            if (!navigator.onLine) {
                console.log("no internet");
                ons.notification.alert({
                    message: 'Internet is OFF.'
                });
                content.innerHTML = "Internet Disabled";
            } else {
                ons.notification.alert({
                    message: 'Internet is ON.'
                });
                content.innerHTML = "Internet Enabled";

            }

        };
        $scope.clearHistory = function () {

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

    };

    var HistoryController = function ($scope, $timeout, theService) {

        $scope.refreshHistory = function () {

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
        $scope.clickedExercise = function (event) {
            slidingMenu.setMainPage('map.html');
            // console.log(theService.msg);
            if (theService.msg != event.target.id) {
                Map.map = null;
            }
            theService.msg = event.target.id;


        };


    };

    var MapStatsController = function ($scope, mapSettings) {

        $scope.back = function () {
            slidingMenu.setMainPage('map.html');

        }


        $scope.refreshfStatistics = function () {




            var start_time = new Date(mapSettings.data[0].timestamp).getTime();
            var end_time = new Date(mapSettings.data[mapSettings.data.length - 1].timestamp).getTime();

            var timeDiff2 = start_time.getTime() - end_time.getTime();

            var daysDifference2 = Math.floor(timeDiff2 / 1000 / 60 / 60 / 24);
            timeDiff2 -= daysDifference2 * 1000 * 60 * 60 * 24

            var hoursDifference2 = Math.floor(timeDiff2 / 1000 / 60 / 60);
            timeDiff2 -= hoursDifference2 * 1000 * 60 * 60


            var calories= Calculations.calculateBMR(hoursDifference2,7);//Map.tracking_status/hoursDifference2);
            document.getElementById("burnedCalories").innerHTML=String("Burned calories :"+ calories);

            $scope.labels = [];
            $scope.series = [];
            $scope.data = [[1]];

            // $scope.labels.push("January");
            // $scope.labels.push("March");
            // $scope.labels.push("April");
            //
            // $scope.series.push("Series A");
            //// $scope.series.push("Series B");
            // $scope.data[0][0]=32;
            // $scope.data[0][1]=32;
            // $scope.data[0][2]=32;
            var percent = mapSettings.data.length / (mapSettings.data.length * 0.1);

            $scope.series.push(mapSettings.track_id);
            for (var i = 0; i < mapSettings.data.length; i += percent) {
                var dataD = new Date(mapSettings.data[i].timestamp);
                var hour = dataD.getHours();
                var minutes = dataD.getMinutes();
                var seconds = dataD.getSeconds();

                console.log(hour + ":" + minutes + ":" + seconds);
                $scope.labels.push(hour + ":" + minutes + ":" + seconds);
                if (mapSettings.data[i + percent] != null) {

                    var date2 = new Date(mapSettings.data[i + percent].timestamp);

                    var timeDiff = dataD.getTime() - date2.getTime();

                    var daysDifference = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
                    timeDiff -= daysDifference * 1000 * 60 * 60 * 24

                    var hoursDifference = Math.floor(timeDiff / 1000 / 60 / 60);
                    timeDiff -= hoursDifference * 1000 * 60 * 60

                    var minutesDifference = Math.floor(timeDiff / 1000 / 60);
                    timeDiff -= minutesDifference * 1000 * 60

                    var secondsDifference = Math.floor(timeDiff / 1000);


                    var distance = Map.gps_distance(
                        mapSettings.data[i].coords.latitude,
                        mapSettings.data[i].coords.longitude,
                        mapSettings.data[i + percent].coords.latitude,
                        mapSettings.data[i + percent].coords.longitude);
                        distance *= 1000; //zamiana na metry

                    var speed = distance / secondsDifference;
                    $scope.data[0][i] = speed; //predkosc
                    console.log("speed :"+speed);
                    console.log("distance :"+distance);
                    console.log("secondsDifference :"+secondsDifference);
                }


            }

        };
    };
    app.controller('MapStatsController', MapStatsController);
    app.controller('HistoryController', HistoryController);
    app.controller('SettingsController', SettingsController);
    app.controller('MapController', MapController);
    app.controller('SlidingMenuController', SlidingMenuController);

})
();
