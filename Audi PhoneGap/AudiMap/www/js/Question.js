/**
 * 
 */
//$( "#spinner" ).spinner();
 var counterForQuestion= $( '#spin' ).attr('value');
 span.innerHTML = counterForQuestion;
 
 //funkcja losujaca pytania i wyswietlajaca je
function getQuestion() {
		counterForQuestion=$( '#spin' ).attr('value');

	$("#A").off();
	$("#B").off();
	$("#C").off();
	
	
 var x = Math.floor((Math.random() * 15) + 1);
 $.getJSON("json/quizNew.json", function (json) {
  var question = json[x.toString()];
  $("#questionQ").html(question.pytanie);
  $("#A").html(question.a);
  $("#B").html(question.b);
  $("#C").html(question.c);
  //listenery do przyciskow A
  $("#A").on("click", function () {
   if (question.odp == "a") {
    points++;
    console.log("dobrze");

   } else {}
   $("#points").html("Points : <strong>" + points);
   $('#questionPopoupDialog').popup('close');
	clearInterval(counterForQuestion);
  });
  //listenery do przyciskow B
  $("#B").on("click", function () {
   if (question.odp == "b") {
    points++;
    console.log("dobrze");
   } else {}
   $("#points").html("Points : <strong>" + points);
   $('#questionPopoupDialog').popup('close');
	clearInterval(counterForQuestion);
  });
  //listenery do przyciskow C
  $("#C").on("click", function () {
   if (question.odp == "c") {
    points++;
    console.log("dobrze");
   } else {}
   $("#points").html("Points : <strong>" + points);
   $('#questionPopoupDialog').popup('close');
	clearInterval(counterForQuestion);
  });




 });

}
function question() {
 //navigator.notification.vibrate(100);
 getQuestion();
 $( "#questionPopoupDialog" ).popup( "option", "positionTo", "origin" );
 $( '#questionPopoupDialog' ).popup('open');
 

 
 setInterval(function() {
	 
    counterForQuestion--;
    if (counterForQuestion >= 0) {
      var span = document.getElementById("counter");
      span.innerHTML = counterForQuestion;
    }
    // Display 'counter' wherever you want to display it.
    if (counterForQuestion === 0) {
        console.log('this is where it happens');
        clearInterval(counterForQuestion);
		
    }
    
  }, 1000);
 
}