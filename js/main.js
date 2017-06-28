/**
 * This is a game where the computer plays first,
 * then the user follows the sequence,
 * if user is wrong, the computer plays the sequence again
 * when strict mode is active, the game restarts on user's wrong button press
 */


"use strict";

// Tile options for computer to pick button to press
var tileBoard = ["red", "blue", "yellow", "green"];

var tileColors = {red: "#f22613", blue: "#2980b9", yellow: "#f1c40f", green: "#2ecc71"};

var audio = {
	red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"), 
	blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"), 
	yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"), 
	green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
};

// stores computer sequence
var currentCompSeries = [];

// stores user sequence;
var userSeries = [];

// keeps track of current user sequence
var counter = 0;

// computer plays a move at intervals
var gameMove;

var strictMode = false; 


/** 
 * press button, play sound, then depress button
 * usage applies to both computer and user move
 */
function playMove(tile){
	document.getElementById(tile).style.backgroundColor = tileColors[tile];
	audio[tile].play();
	setTimeout(() => { 
		document.getElementById(tile).style.backgroundColor = "#f6f6f6";
	}, 500);
}


function newGame(){
	currentCompSeries = [];
	if (gameMove) clearInterval(gameMove);
	setTimeout(() => {
		document.getElementById("count").innerHTML = "--";
		compMove();
	}, 1000);
}


/** 
 * Plays the first move of the game.
 * Also plays the computer sequence from the beginning,
 * and adds an extra move if user got the last sequence correct i.e. next == "extra move"
 */
function compMove(moveSeries, next){
	counter = 0;
	userSeries = [];
	if (moveSeries) {
		// play computer sequence from the beginning
		let index = 0;

		// computer plays a move at intervals
		gameMove = setInterval(() => {
			let tile = moveSeries[index];
			playMove(tile);	

			index++;

			// on sequence completion; execute an extra move
			if (index >= moveSeries.length){
				clearInterval(gameMove);
				if (next == "extra move"){
					setTimeout(() => compMove(), 700);
				}
			}				
		}, 700);
	} 
	else {
		// generate random button press
		let randomMove = Math.floor(Math.random()*4);
		let tile = tileBoard[randomMove];
		
		// play a new move
		playMove(tile);

		currentCompSeries.push(tile);
	}	
}


function userMove(tile){
	userSeries.push(tile);

	// cross-check user press versus computer press
	if (currentCompSeries[counter] == userSeries[counter]){
		playMove(tile);
		counter++;
	} else {
		message("wrong-move");
		
		// strict mode active; start a new game
		if (strictMode == true)	return newGame();
		
		// play computer sequence again
		compMove(currentCompSeries);
	}
	
	/**
	 * when user sequence the same as computer sequence,
	 * set counter, play computer sequence, 
	 * then computer plays an extra button press
	 */
	if (userSeries.toString() == currentCompSeries.toString()){
		counter = counter < 10 ? "0" + counter : counter; 
		document.getElementById("count").innerHTML = counter;

		if (counter < 20){
			setTimeout(() => compMove(currentCompSeries, "extra move"), 700);
		} else {
			message("victory");
		}
	}
}	


// Notify user of message and then fade message out
function message(element){
	document.getElementById(element).className = "show-message";
	setTimeout(() => {
		document.getElementById(element).className = "hide-message";
		if (element == "victory") return newGame();
	}, 1500);
}


function toggleStrict(){
	strictMode = !strictMode;
	document.getElementById("strict").style.backgroundColor = strictMode ? "#8e44ad" : "#e4f1fe";
}