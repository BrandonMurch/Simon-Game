/*
@description - The classic game of Simon, where the user has to recreate
               the pattern that the computer creates.
@input - based solely on clicking the GUI to create the correct pattern.
@author - Brandon - Brandon.Murch@protonmail.com
*/

let computerArr = [], // holds the computer generated pattern
  inputArr = [],      // holds the user inputed pattern
  strictMode = false, // initiates strict mode, user cannot fail, or game resets.
  level = 1,
  speed = 1000,       // intial speed between the presses in the computer pattern.
  startButtonPressed = false,
  activeGame = false;
  wrongAnswer = false;
  let audio = {
    green : new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red : new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow : new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blue:  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
  }


const display = (display) => {
  document.getElementsByClassName("innerCircle__displayText")[0]
      .innerHTML = display.toString().padStart(2, "0").split('').join(' ');
};

const resetGame = () => {
  activeGame = false;
  computerArr = [];
  inputArr = [];
  level = 1;
  speed = 1000;
  startButtonPressed = false;
  wrongAnswer = false;
  display("--");
  strictMode = false;
};

const gameWin = () => {
  alert("You have won! Congratulations!")
  resetGame();
};

const toggleStrict = () => {
  (strictMode ? strictMode = false : strictMode = true);
  $(".innerCircle__roundButton").toggleClass("innerCircle__roundButton--toggled")
};


                  // takes a color and toggles a class that increases the opacity of the button
const toggleFlash = (color) => {
  let i = 0;
  $(".outerCircle__cone--" + color).toggleClass("outerCircle__cone--" + color + "Flash");
  audio[color].play();
  var interval = setInterval(() => {
    $(".outerCircle__cone--" + color).toggleClass("outerCircle__cone--" + color + "Flash");
    i++
    if (i==1) clearInterval(interval);
  }, 200)
  if(inputArr.length == computerArr.length && activeGame == true) compareSeq();
};


                // a sequence of button presses to signify the start of a game
const initialiseSequence = () => {
  startButtonPressed = true;
  let i = 1;
  var interval = setInterval(() => {
    switch (i) {
      case 6:
        display("Initialising")
        toggleFlash("green");
        break;
      case 7:
        toggleFlash("red");
        break;
      case 8:
        display("- -")
        toggleFlash("yellow");
        break;
      case 9:
        toggleFlash("blue");
        break;
      case 11:
        display("Initialising")
        toggleFlash("blue");
        break;
      case 12:
        toggleFlash("yellow");
        break;
      case 13:
        display("- - ")
        toggleFlash("red");
        break;
      case 14:
        display("Started")
        toggleFlash("green");
        break;
      case 15:
        clearInterval(interval);
        startGame();
    }
    i++
  }, 300)
};

const startGame = () => {
  level = 1;
  computerArr = [];
  inputArr = [];
  display(level);
  activeGame = true;
  randomSeq();
};
                // randomly selects a button
const randomSeq = () => {
  let selector = Math.ceil(Math.random()*4);
  switch (selector){
    case 1:
      computerArr.push("green");
      break;
    case 2:
      computerArr.push("red");
      break;
    case 3:
      computerArr.push("yellow");
      break;
    case 4:
      computerArr.push("blue");
      break;
  }
  replaySeq();
};
              /* flashes "!!" when wrong then if strict mode is enabled,
              starts the game over, otherwise it resets the round */
const wrongAnswerSeq = () => {
  wrongAnswer = true;
  let i = 0;
  let interval = setInterval(() => {
    (i%2 == 0 ? display("--") : display("!!"))
    if (i == 4) {
      display(level);
      clearInterval(interval);
      if (strictMode == true){
        startGame();
      }else{
        inputArr = [];
        replaySeq();
      }
    }
    i++;
  }, 500);
};

                // replays the computer sequence at increasing speeds
const replaySeq = () => {
  let i = 0;
  let interval = setInterval(() => {
    toggleFlash(computerArr[i]);
    if (i == computerArr.length-1) clearInterval(interval);
    i++;
  }, speed);
};

const compareSeq = () => {
  wrongAnswer = false;
  for (i = 0; i<inputArr.length; i++){
    if (inputArr[i] != computerArr[i]){
      wrongAnswerSeq();
    }
  }               // increasing the speed of the computer pattern replay
  if (wrongAnswer == false){
    switch(level) {
      case 5:
        speed = 800;
        break;
      case 9:
        speed = 600;
        break;
      case 13:
        speed = 400;
        break;
    }
    if (level == 20){
      gameWin();
    } else{
      level++;
      display(level);
      inputArr = []
      randomSeq();
    }
  }
};

                // GUI input
$(document).ready(function(){
  $(document).on("click",".innerCircle__list--startButton", function(){
                    // ensures the start button is not pressed twice
    if (startButtonPressed == false) initialiseSequence();
    });
  $(document).on("click",".innerCircle__list--resetButton", function(){
    resetGame();
    });
  $(document).on("click",".outerCircle__cone--green", function(){
    inputArr.push("green");
    toggleFlash("green");
  });
  $(document).on("click",".outerCircle__cone--red", function(){
    inputArr.push("red");
    toggleFlash("red");
  });
  $(document).on("click",".outerCircle__cone--yellow", function(){
    inputArr.push("yellow");
    toggleFlash("yellow");
  });
  $(document).on("click",".outerCircle__cone--blue", function(){
    inputArr.push("blue");
    toggleFlash("blue");
  });
  $(document).on("click",".innerCircle__roundButton", function(){
    toggleStrict();
  });
});
