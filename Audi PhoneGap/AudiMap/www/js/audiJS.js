/**
 * 
 */


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
var points = 0;
var track_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects
var currentExerciseKm = 0;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// Funkcja odpowiedzialna za sprawdzanie internetu, jezeli nie ma zmienia napis na :
//"NO INTERNET ACCESS" i ikone na "delete"
document.addEventListener("deviceready", function(){
    
  if(navigator.network.connection.type == Connection.NONE){
    $("#home_network_button").text('No Internet Access');
    $('#home_network_button').buttonMarkup({ icon: "delete" });
  }


});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// Funkcja ktora dodaje mozliwosc wyjscia z aplikacji za pomoca klawisza back
document.addEventListener("backbutton",function(){ 
  navigator.app.exitApp(); 

}, true);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//obliczanie odleglosci z latlong
function gps_distance(lat1, lon1, lat2, lon2)
{
  // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    return d;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

function addZero(i) {
  if (i < 10) {
      i = "0" + i;
  }
  return i;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
function updateStatusOfWorkout(data)
{
  

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//Start szukanie pozycji GPS, start gry.
$(document).on("pagecreate","#map",function(){

  
  //start szukanie położenia po przyciśnieciu przycisku start_tracking
  //Id biegu to data z godzina minutą i sekundami
  $("#startTracking").on("click",function(event){
    
    var today = new Date();
    var date = today.toDateString();
    
    var h = addZero(today.getHours());
    var m = addZero(today.getMinutes());
    var s = addZero(today.getSeconds());
    
    
    console.log("startrted tracking");
      watch_id = navigator.geolocation.watchPosition(
      
        // Success
          function(position){
             
              tracking_data.push(position);
              
              if(tracking_data.length>=2)
              {
                total_km = 0;

                for(i = 0; i < tracking_data.length; i++){
                    
                    if(i == (tracking_data.length - 1)){
                        break;
                    }
                    
                    total_km += gps_distance(tracking_data[i].coords.latitude, tracking_data[i].coords.longitude, tracking_data[i+1].coords.latitude, tracking_data[i+1].coords.longitude);
                }
                
                total_km_rounded = total_km.toFixed(2);
                
                currentExerciseKm = total_km_rounded;
                
                // Calculate the total time taken for the track
                start_time = new Date(tracking_data[0].timestamp).getTime();
                end_time = new Date(tracking_data[tracking_data.length-1].timestamp).getTime();

                total_time_ms = end_time - start_time;
                total_time_s = total_time_ms / 1000;
                
                final_time_m = Math.floor(total_time_s / 60);
                final_time_s = total_time_s - (final_time_m * 60);
                final_time_s=final_time_s.toFixed(3);
                $("#track_info_info").html('Travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>');
//                if(currentExerciseKm>1)
//                  {
//                   question();
//                  }
              }

              console.log(String(position));
          },
          
          // Error
          function(error){
              console.log(error);
          },
          
          // Settings
          { frequency: 3000, enableHighAccuracy: true });
      
      // Tidy up the UI
      track_id = date+" "+h+":"+m+":"+s;
      
     
      
      $("#trackingStatus").html("Tracking workout: <strong> <br>" + track_id + "</strong>");

      
  });

  //Zatrzymanie szukanie pozycji GPS
  $("#stopTracking").on("click",function(){
    // Stop tracking the user
    navigator.geolocation.clearWatch(watch_id);
    
    // Save the tracking data
    window.localStorage.setItem(track_id, JSON.stringify(tracking_data));
    console.log("stoped "+track_id);
    // Reset watch_id and tracking_data 
     watch_id = null;
     tracking_data = null;

    // Tidy up the UI
    $("#track_id").val("").show();
    
    $("#trackingStatus").html("Stopped tracking workout: <strong>" + track_id + "</strong>");
    console.log("stoped tracking tracking");

  });
  
  
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//funkcja losujaca pytania i wyswietlajaca je
function getQuestion()
{
  var x = Math.floor((Math.random() * 15) + 1);
  $.getJSON("json/quizNew.json", function(json) {
    var question=json[x.toString()];
    $( "#questionQ" ).html(question.pytanie);
    $( "#A" ).html(question.a);
    $( "#B" ).html(question.b);
    $( "#C" ).html(question.c);
    //listenery do przyciskow A
    $("#A").on("click",function(){
      if(question.odp=="a")
        {
        points++;
        console.log("dobrze");
        }
      else
        {
        }
      $("#points").html("Points : <strong>" + points);
      $('#questionPopoupDialog').popup('close');

    });
    //listenery do przyciskow B
    $("#B").on("click",function(){
      if(question.odp=="b")
      {
        points++;
        console.log("dobrze");
      }
    else
      {
      
      }
      $("#points").html("Points : <strong>" + points);
      $('#questionPopoupDialog').popup('close');

    });
    //listenery do przyciskow C
    $("#C").on("click",function(){
      if(question.odp=="c")
      {
        points++;
        console.log("dobrze");
      }
    else
      {
      }
      $("#points").html("Points : <strong>" + points);
      $('#questionPopoupDialog').popup('close');
    });
    
    
//    usuwanie listenerow do przyciskow

    
   
});
 
  
}

function question()
{
navigator.notification.vibrate(100);
getQuestion();
$('#questionPopoupDialog').popup('open',{positionTo:'#home'});
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//setInterval(function(){

//  
//}, 10000);
//Funkcja ktora co 5 sekund otwiera dialog z pytaniami
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//Stworzenie sie strony histori. Zrobic tutaj liste zeby sie do niej wczytywaly wczesniejsze biegi
$(document).on("pageshow","#history",function(){
  console.log("history");
  var tracks_recorded = window.localStorage.length;
  $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");

  $("#historyTrack").empty();
  
  for(i=0; i<tracks_recorded; i++)
  {
    $("#historyTrack").append("<li><a href='#home' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
  }
  
  $("#historyTrack").listview('refresh');
  
  
  
  
  
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
$(document).on("pagecreate","#options",function(){


$("#clearHistory").on("click",function(){
  window.localStorage.clear();
  $("#historyTrack").listview('refresh');

  
  });

});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

$(document).on("pagecreate","#home",function(){
  
  $("#playMusic").on("click",function(){
    var my_media = new Media("android_asset/www/sounds/pacman_chomp.mp3",
            // success callback
            function () {
                console.log("playAudio():Audio Success");
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: " + String(err));
            }
        );
  });
  
});


//funkcja przenoszaca do glownego strony i pokazujaca ile przebieglismy i w jakim czasie
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
$(document).on("click", "#historyTrack li a" ,function (event) {

  
  
  // $("#track_info").attr("track_id", $(this).text());
   track_id=$(this).text();
   var data = window.localStorage.getItem(track_id);
   console.log(data);
   data = JSON.parse(data);
   // Calculate the total distance travelled
   total_km = 0;

   for(i = 0; i < data.length; i++){
       
       if(i == (data.length - 1)){
           break;
       }
       
       total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
   }
   
   total_km_rounded = total_km.toFixed(2);
   
   // Calculate the total time taken for the track
   start_time = new Date(data[0].timestamp).getTime();
   end_time = new Date(data[data.length-1].timestamp).getTime();

   total_time_ms = end_time - start_time;
   total_time_s = total_time_ms / 1000;
   
   final_time_m = Math.floor(total_time_s / 60);
   final_time_s = total_time_s - (final_time_m * 60);
   final_time_s=final_time_s.toFixed(3);
   $("#track_info_info").html('Travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>');
   // Set the initial Lat and Long of the Google Map
// Set the initial Lat and Long of the Google Map
   var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

   // Google Map options
   var myOptions = {
       zoom: 15,
       center: myLatLng,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     // Create the Google Map, set options
     var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

     var trackCoords = [];
     
     // Add each GPS entry to an array
     for(i=0; i<data.length; i++){
       trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
     }
     
     // Plot the GPS entries as a line on the Google Map
     var trackPath = new google.maps.Polyline({
       path: trackCoords,
       strokeColor: "#FF0000",
       strokeOpacity: 1.0,
       strokeWeight: 2
     });

     // Apply the line to the map
     trackPath.setMap(map);

 });