// Copyright 2013 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var Animator = {

 pacman : null,
 pacmanImage : null,
 pacmanCanvas : null,

 runningMan : null,
 runningManImage : null,
 runningManCanvas : null,

 counterAnim : null,
 countAnim : 30,

 loadAnim : function () {
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
   window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
   window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
     || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
   window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
     },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
   };

  if (!window.cancelAnimationFrame)
   window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
   };
 },

 createAnim : function () {

  function gameLoop() {

   window.requestAnimationFrame(gameLoop);

   pacman.update();
   pacman.render();
   runningMan.update();
   runningMan.render();
  }

  function sprite(options) {

   var that = {},
   frameIndex = 0,
   tickCount = 0,
   ticksPerFrame = options.ticksPerFrame || 0,
   numberOfFrames = options.numberOfFrames || 1;

   that.context = options.context;
   that.width = options.width;
   that.height = options.height;
   that.image = options.image;
   that.positionX = options.positionX;
   that.positionY = options.positionY;
   that.update = function () {

    tickCount += 1;

    if (tickCount > ticksPerFrame) {

     tickCount = 0;

     // If the current frame index is in range
     if (frameIndex < numberOfFrames - 1) {
      // Go to the next frame
      frameIndex += 1;
     } else {
      frameIndex = 0;
     }
    }
   };

   that.render = function () {

    // Clear the pacmanCanvas
    that.context.clearRect(0, 0, that.width, that.height);

    // Draw the animation
    that.context.drawImage(
     that.image,
     frameIndex * that.width / numberOfFrames,
     0,
     that.width / numberOfFrames,
     that.height,
     that.positionX,
     that.positionY,
     that.width / numberOfFrames,
     that.height);
   };

   return that;
  }

  // Get pacmanCanvas
  pacmanCanvas = document.getElementById("pacmanAnimation");
  pacmanCanvas.width = 200;
  pacmanCanvas.height = 200;

  // Create sprite sheet
  pacmanImage = new Image();

  // Create sprite
  pacman = sprite({
    context : pacmanCanvas.getContext("2d"),
    width : 1000,
    height : 100,
    image : pacmanImage,
    numberOfFrames : 10,
    ticksPerFrame : 4,
    positionX : 0,
    positionY : 0
   });

  // Load sprite sheet
  pacmanImage.addEventListener("load", gameLoop);
  pacmanImage.src = "images/coin-sprite-animation.png";

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  // Get pacmanCanvas
  runningManCanvas = document.getElementById("humanAnimation");
  runningManCanvas.width = 200;
  runningManCanvas.height = 200;

  // Create sprite sheet
  runningManImage = new Image();

  // Create sprite
  runningMan = sprite({
    context : runningManCanvas.getContext("2d"),
    width : 864,
    height : 140,
    image : runningManImage,
    numberOfFrames : 8,
    ticksPerFrame : 8,
    positionX : 0,
    positionY : 0
   });

  // Load sprite sheet
  runningManImage.addEventListener("load", gameLoop);
  runningManImage.src = "images/rmanAnim.png";

 },
 moveRunningMan : function () {
  runningMan.positionX += 2;
  //console.log("positionX" + runningMan.positionX);
  //console.log(Animator.countAnim + " secs");
  Animator.countAnim -= 1;
  if (Animator.countAnim == 0) {
   clearInterval(Animator.counterAnim);
  // console.log("wyszlem");

   return;
  }
     //console.log("blabl");

 }

}
