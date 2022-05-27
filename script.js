//First step is to create the GameState that represent the board and the variables that will be the game pieces

//************************************************Game Board and Variables********************************************

//Organize the board in a 8x8 to match what the starting gamestate is
const gameBoard = [
    null, 0, null, 1, null, 2, null, 3,
    4, null, 5, null, 6, null, 7, null,
    null, 8, null, 9, null, 10, null, 11,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    12, null, 13, null, 14, null, 15, null,
    null, 16, null, 17, null, 18, null, 19,
    20, null, 21, null, 22, null, 23, null
]

/*---------- Variables ----------*/

//Gets pieceId's and returns the index/location of that piece's place on the gameBoard
let findPiece = function (pieceId) {
    let parsed = parseInt(pieceId);
    return gameBoard.indexOf(parsed);
};

//Variable to get all the "spaces" in the html table
const spaces = document.querySelectorAll("td");

//Variables to store all the pieces which are p tags with rPiece being red pieces and bPiece being black pieces
let rPiece = document.querySelectorAll(".rPiece");
let bPiece = document.querySelectorAll(".bPiece")

//Variables for the HUD to track the player turn and the player's score/life counter
const redTurnText = document.querySelectorAll(".redTurnText");
const blackTurntext = document.querySelectorAll(".blackTurnText");
const divider = document.querySelector(".middle");
let rScoreText = document.querySelector(".rScore");
let bScoreText = document.querySelector(".bScore");

//Player properties
//
//A boolean to track the turns. when turn is true then it is the red player's turn
let turn = true;

//In a normal game of checkers each player has 12 pieces
//These variables will track how many each player has to check for the win condition and at the same time display it in the HTML 
let redScore = 12;
let blackScore = 12;

//A floating variable to check for which pieces to manipulate
let playerPieces;

//A variable that holds all the properties needed to check for the movement and status of the piece
let selectedPiece = {
    //The selected piece ID
    pieceId: -1,
    //The selected piece location
    pieceLocation: -1,
    //Is this piece a king
    KingStatus: false,
    //Forward movement
    fSevenSpace: false,
    fNineSpace: false,
    fFourteenSpace: false,
    fEighteenSpace: false,
    //Backward Movement
    bSevenSpace: false,
    bNineSpace: false,
    bFourteenSpace: false,
    bEighteenSpace: false
}

/*---------- Event Listeners ----------*/

//Initialize event listeners on pieces
function setEventListener() {
    //if turn is true then add all the red pieces that currently exist a event listener for click
    if (turn) {
        for (let i = 0; i < rPiece.length; i++) {
            rPiece[i].addEventListener("click", playerPieceChecker);
        }
    }
    //If turn is false then add all the black pieces that currently exist a event listener for click
    else {
        for (let i = 0; i < bPiece.length; i++) {
            bPiece[i].addEventListener("click", playerPieceChecker);
        }
    }
}

/*---------- Methods ----------*/

//This method sets the current pieces in play depending on the turn
function playerPieceChecker() {
    if (turn) {
        playerPieces = rPiece;
    } else {
        playerPieces = bPiece;
    }
    removeSpaceClickable();
    resetBorders();
}

//Removes all the click attributes incase if the player decides to move a different piece and remove the possible moves from the old selected piece
function removeSpaceClickable() {
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].removeAttribute("onclick");
    }
    //A method that removes the highlighted spaces where the possible moves can be made
    spaceHighlightRemove();
}

// resets the piece's borders to default
function resetBorders() {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "1px solid white";
    }
    resetSelectedPieceProperties();
    getSelectedPiece();

}

//Resets the selected piece's properties
function resetSelectedPieceProperties() {
    selectedPiece.pieceId = -1;
    selectedPiece.KingStatus = false;
    selectedPiece.fSevenSpace = false;
    selectedPiece.fNineSpace = false;
    selectedPiece.fFourteenSpace = false;
    selectedPiece.fEighteenSpace = false;
    selectedPiece.bSevenSpace = false;
    selectedPiece.bNineSpace = false;
    selectedPiece.bFourteenSpace = false;
    selectedPiece.bEighteenSpace = false;
}

//Get the selected piece's ID from the html and the location that it sits in the gameBoard array
function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(event.target.id);
    selectedPiece.pieceLocation = findPiece(selectedPiece.pieceId);
    kingChecker();
}

//Checks if selected piece is a king/has the king status
function kingChecker() {
    if (document.getElementById(selectedPiece.pieceId).classList.contains("king")) {
        selectedPiece.KingStatus = true;
    } else {
        selectedPiece.KingStatus = false;
    }
    getFreeSpaces();
}

//Gets the moves that the selected piece can make directly in front of them and if they can move there then modify the the properties to be true
function getFreeSpaces() {
    if (gameBoard[selectedPiece.pieceLocation + 7] === null &&
        spaces[selectedPiece.pieceLocation + 7].classList.contains("nPiece") !== true) {
        selectedPiece.fSevenSpace = true;
    }
    if (gameBoard[selectedPiece.pieceLocation + 9] === null &&
        spaces[selectedPiece.pieceLocation + 9].classList.contains("nPiece") !== true) {
        selectedPiece.fNineSpace = true;
    }
    if (gameBoard[selectedPiece.pieceLocation - 7] === null &&
        spaces[selectedPiece.pieceLocation - 7].classList.contains("nPiece") !== true) {
        selectedPiece.bSevenSpace = true;
    }
    if (gameBoard[selectedPiece.pieceLocation - 9] === null &&
        spaces[selectedPiece.pieceLocation - 9].classList.contains("nPiece") !== true) {
        selectedPiece.bNineSpace = true;
    }
    checkFreeJumps();
}

//Gets the moves that the selected piece can jump and take a piece. If this is true then update the properties to reflect that
function checkFreeJumps() {
    if (turn) {
        if (gameBoard[selectedPiece.pieceLocation + 14] === null
            && spaces[selectedPiece.pieceLocation + 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation + 7] >= 12) {
            selectedPiece.fFourteenSpace = true;
        }
        if (gameBoard[selectedPiece.pieceLocation + 18] === null
            && spaces[selectedPiece.pieceLocation + 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation + 9] >= 12) {
            selectedPiece.fEighteenSpace = true;
        }
        if (gameBoard[selectedPiece.pieceLocation - 14] === null
            && spaces[selectedPiece.pieceLocation - 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation - 7] >= 12) {
            selectedPiece.bFourteenSpace = true;
        }
        if (gameBoard[selectedPiece.pieceLocation - 18] === null
            && spaces[selectedPiece.pieceLocation - 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation - 9] >= 12) {
            selectedPiece.bEighteenSpace = true;
        }
    } else {
        if (gameBoard[selectedPiece.pieceLocation + 14] === null
            && spaces[selectedPiece.pieceLocation + 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation + 7] < 12 && gameBoard[selectedPiece.pieceLocation + 7] !== null) {
            selectedPiece.fFourteenSpace = true;
        }
        if (gameBoard[selectedPiece.pieceLocation + 18] === null
            && spaces[selectedPiece.pieceLocation + 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation + 9] < 12 && gameBoard[selectedPiece.pieceLocation + 9] !== null) {
            selectedPiece.fEighteenSpace = true;
        }
        if (gameBoard[selectedPiece.pieceLocation - 14] === null && spaces[selectedPiece.pieceLocation - 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation - 7] < 12
            && gameBoard[selectedPiece.pieceLocation - 7] !== null) {
            selectedPiece.bFourteenSpace = true;
        }
        if (gameBoard[selectedPiece.pieceLocation - 18] === null && spaces[selectedPiece.pieceLocation - 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.pieceLocation - 9] < 12
            && gameBoard[selectedPiece.pieceLocation - 9] !== null) {
            selectedPiece.bEighteenSpace = true;
        }
    }
    pieceCondition();
}

//If the piece's king state is true then give it a marker. If not true then retrict that piece's movement by stripping the true statements depending on the turn
function pieceCondition() {
    if (selectedPiece.KingStatus) {
        givePieceMarker();
    } else {
        if (turn) {
            selectedPiece.bSevenSpace = false;
            selectedPiece.bNineSpace = false;
            selectedPiece.bFourteenSpace = false;
            selectedPiece.bEighteenSpace = false;
        } else {
            selectedPiece.fSevenSpace = false;
            selectedPiece.fNineSpace = false;
            selectedPiece.fFourteenSpace = false;
            selectedPiece.fEighteenSpace = false;
        }
        givePieceMarker();
    }
}

//Gives the selected Piece a aquamarine ring to indicate that the piece is selected if any of the movement conditions are met. If they are not then do nothing as that piece cannot move so strip its interactablilty
function givePieceMarker() {
    if (selectedPiece.fSevenSpace || selectedPiece.fNineSpace || selectedPiece.fFourteenSpace || selectedPiece.fEighteenSpace
        || selectedPiece.bSevenSpace || selectedPiece.bNineSpace || selectedPiece.bFourteenSpace || selectedPiece.bEighteenSpace) {
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid aquamarine";
        giveSpacesClick();
    }
    else {
        return;
    }
}

//Give the spaces on the board a eventlistener depeneding on the true/false properties from previous methods where they can jump on the board and highlight those positions for ease of asscessibilty 
function giveSpacesClick() {
    if (selectedPiece.fSevenSpace) {
        spaces[selectedPiece.pieceLocation + 7].setAttribute("onclick", "move(7)");
        spaces[selectedPiece.pieceLocation + 7].style.backgroundColor = "aquamarine";
    }
    if (selectedPiece.fNineSpace) {
        spaces[selectedPiece.pieceLocation + 9].setAttribute("onclick", "move(9)");
        spaces[selectedPiece.pieceLocation + 9].style.backgroundColor = "aquamarine";
    }
    if (selectedPiece.fFourteenSpace) {
        spaces[selectedPiece.pieceLocation + 14].setAttribute("onclick", "move(14)");
        spaces[selectedPiece.pieceLocation + 14].style.backgroundColor = "aquamarine";
    }
    if (selectedPiece.fEighteenSpace) {
        spaces[selectedPiece.pieceLocation + 18].setAttribute("onclick", "move(18)");
        spaces[selectedPiece.pieceLocation + 18].style.backgroundColor = "aquamarine";
    }
    if (selectedPiece.bSevenSpace) {
        spaces[selectedPiece.pieceLocation - 7].setAttribute("onclick", "move(-7)");
        spaces[selectedPiece.pieceLocation - 7].style.backgroundColor = "aquamarine";
    }
    if (selectedPiece.bNineSpace) {
        spaces[selectedPiece.pieceLocation - 9].setAttribute("onclick", "move(-9)");
        spaces[selectedPiece.pieceLocation - 9].style.backgroundColor = "aquamarine";
    }
    if (selectedPiece.bFourteenSpace) {
        spaces[selectedPiece.pieceLocation - 14].setAttribute("onclick", "move(-14)");
        spaces[selectedPiece.pieceLocation - 14].style.backgroundColor = "aquamarine";
    }
    if (selectedPiece.bEighteenSpace) {
        spaces[selectedPiece.pieceLocation - 18].setAttribute("onclick", "move(-18)");
        spaces[selectedPiece.pieceLocation - 18].style.backgroundColor = "aquamarine";
    }
}

//The method called when the player selects the space they wish to jump to
function move(num) {
    //Clear the selected piece's current location from the html
    document.getElementById(selectedPiece.pieceId).remove();
    spaces[selectedPiece.pieceLocation].innerHTML = "";

    //Depending on the turn select the piece and check if that is a king piece and update the new location on the HTML
    if (turn) {
        if (selectedPiece.KingStatus) {
            spaces[selectedPiece.pieceLocation + num].innerHTML = `<p class="rPiece king" id="${selectedPiece.pieceId}"></p>`;
            rPiece = document.querySelectorAll(".rPiece");
        } else {
            spaces[selectedPiece.pieceLocation + num].innerHTML = `<p class="rPiece" id="${selectedPiece.pieceId}"></p>`;
            rPiece = document.querySelectorAll(".rPiece");
        }

    }
    else {
        if (selectedPiece.KingStatus) {
            spaces[selectedPiece.pieceLocation + num].innerHTML = `<p class="bPiece king" id="${selectedPiece.pieceId}"></p>`;
            bPiece = document.querySelectorAll(".bPiece");
        } else {
            spaces[selectedPiece.pieceLocation + num].innerHTML = `<p class="bPiece" id="${selectedPiece.pieceId}"></p>`;
            bPiece = document.querySelectorAll(".bPiece");
        }
    }

    //A variable to the new location of the selected piece
    let indexOfPiece = selectedPiece.pieceLocation

    //These 4 numbers in the if statement occur when the selected piece makes a jump to take the opposing player's piece. If any of these are true then run the if statement to calculate the position of the old piece and store that in the third element
    //If not then run the else statement which only gets the old location and the new location of the selected piece
    if (num === 14 || num === -14 || num === 18 || num === -18) {
        update(indexOfPiece, indexOfPiece + num, indexOfPiece + num / 2);
    } else {
        update(indexOfPiece, indexOfPiece + num);
    }
}

//This method updates the backend board state to reflect what happened in the front end what the player sees.
function update(pieceLocation, modifiedIndex, removePiece) {
    //Clear out the selected piece's location
    gameBoard[pieceLocation] = null;
    //Insert the selected piece to its new location
    gameBoard[modifiedIndex] = parseInt(selectedPiece.pieceId);
    //If a red piece since the IDs of red pieces are less than 12 moves to the other side of the board. Give that piece the King class via classlist.add
    if (turn && selectedPiece.pieceId < 12 && modifiedIndex >= 57) {
        document.getElementById(selectedPiece.pieceId).classList.add("king")
    }
    //If a black piece since the IDs of black pieces are greater than 12 moves to the other side of the board. Give that piece the King class via classlist.add
    if (turn === false && selectedPiece.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(selectedPiece.pieceId).classList.add("king");
    }
    //If remove piece is true stating that there is a number being passed down from the move method then run this
    if (removePiece) {
        //Remove the taken piece from teh gameState
        gameBoard[removePiece] = null;
        //If the turn is true and the selected piece is one of the red piece IDs then remove the black piece and lower the score as well as update it on the front end.
        if (turn && selectedPiece.pieceId < 12) {
            spaces[removePiece].innerHTML = "";
            blackScore--
            bScoreText.innerHTML = `<p class="bScore"">Score - ${blackScore}</p>`;
        }
        //If the turn is false and the selected piece is one of the black piece IDs then remove the red piece and lower the score as well as update it on the front end.
        if (turn === false && selectedPiece.pieceId >= 12) {
            spaces[removePiece].innerHTML = "";
            redScore--
            rScoreText.innerHTML = `<p class="rScore"">Score - ${redScore}</p>`;
        }
    }
    resetSelectedPieceProperties();
    removeSpaceClickable();
    removeEventListener();
}

//Removes the event listener from the pieces depending on the turn status
function removeEventListener() {
    if (turn) {
        for (let i = 0; i < rPiece.length; i++) {
            rPiece[i].removeEventListener("click", playerPieceChecker);

        }
    } else {
        for (let i = 0; i < bPiece.length; i++) {
            bPiece[i].removeEventListener("click", playerPieceChecker);

        }
    }
    winCondition();
}

//A method to check the game state if a player has won if no one won then run the switch turn method to pass the turn to the other player
function winCondition() {
    if (blackScore === 0) {
        divider.style.display = "none";
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "black";
            blackTurntext[i].style.display = "none";
            redTurnText[i].textContent = "RED WINS!";
            redTurnText.style.color = "red";
        }
    }
    else if (redScore === 0) {
        divider.style.display = "none";
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "black";
            redTurnText[i].style.display = "none";
            blackTurntext[i].textContent = "BLACK WINS!";
            blackTurntext.style.color = "black";
        }
    }
    switchTurns();
}

//A method to swtich the player turn and update the HUD to reflect that information and reset the event listeners for the other player's pieces to start again
function switchTurns() {
    if (turn) {
        turn = false;
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "lightGrey";
            blackTurntext[i].style.color = "black";
        }
    } else {
        turn = true;
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "lightGrey";
            redTurnText[i].style.color = "black";
        }
    }
    setEventListener();
}

//A method that brute forces all the spaces to have no background color "highlight" incase if a move has been made or if the player decided on another piece to move
function spaceHighlightRemove() {
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].style.backgroundColor = "";
    }
}

//initialize the game 
setEventListener();