
/**
Question to obiekt, chyba, który odpowiedzialny jest za funkcję związane z zadawaniem pytań.
Posiada licznik który odlicza czas od danej liczby, podanej w spinnerze 'spinboxTimerForQuestion', do 0.
Pytanie losowane jest z puli pytań zawartych w pliku 'json/quizNew.json'.
Na każde pytanie są 3 odpowiedzi w tym jedna dobra. Po dobrej odpowiedzi gracz dosteję punkt. Po złej nic się nie dzieje, chociaż można zrobić jakąś karę.
 */
var Question = {
 counter : null,
 count : null,

 timer : function () {
  console.log(Question.count + " secs");
  Question.count -= 1;
  if (Question.count == 0) {
   clearInterval(Question.counter);
   $("#timer").html(Question.count + " secs");
   return;
  }

  $("#timer").html(Question.count + " secs");
 },

 getQuestion : function () {

  Question.count = $("#spinboxTimerForQuestion").val();
  $("#timer").html(Question.count + " secs");
  console.log("count = " + Question.count);

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
    clearInterval(Question.counter);
   });
   //listenery do przyciskow B
   $("#B").on("click", function () {
    if (question.odp == "b") {
     points++;
     console.log("dobrze");
    } else {}
    $("#points").html("Points : <strong>" + points);
    $('#questionPopoupDialog').popup('close');
    clearInterval(Question.counter);
   });
   //listenery do przyciskow C
   $("#C").on("click", function () {
    if (question.odp == "c") {
     points++;
     console.log("dobrze");
    } else {}
    $("#points").html("Points : <strong>" + points);
    $('#questionPopoupDialog').popup('close');
    clearInterval(Question.counter);

   });

  });

 },
 askQuestion : function () {
  //navigator.notification.vibrate(100);
  Question.getQuestion();
  $("#questionPopoupDialog").popup("option", "positionTo", "origin");
  $('#questionPopoupDialog').popup('open');

  Question.counter = setInterval(Question.timer, 1000); //1000 will  run it every 1 second
 }

}
