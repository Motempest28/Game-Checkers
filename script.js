//First step is to create the GameState that represent the board and the variables that will be the game pieces

//************************************************Game Board and Variables********************************************

//organize the board in a 8x8 to match what the starting gamestate is
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

//Variables
//This const will get all the spaces on the game board
const spaces = document.querySelector("td")

//Game pieces make this a let since we will modify this as the game is being played
let rPiece = document.querySelector(".rPiece")
let bPiece = document.querySelector(".bPiece")

//Get the turn counter items
const redPlayerTurn = document.querySelector(".redTurnText")
const divider = document.querySelector(".middle")
const blackPlayerTurn = document.querySelector(".blackTurnText")

//Create variables to track the game state
let turn = true
let redPlayerScore = 12;
let blackPlayerScore = 12;
let playerPieces;
//properties of a piece when it is selected
let selectedPiece = {
    pieceId: -1, //Array starts are 0 to get a accurate selection when the selection is 1 it should be 0
    pieceLocation: -1,
    //Check if this piece is a king
    KingStatus: false,
    //movement properties
    //Forward movement
    fSevenSpace: false,
    fNineSpace: false,
    fFourteenSpace: false,
    fEighteenSpace: false,
    //Backward movement
    bSevenSpace: false,
    bNineSpace: false,
    bFourteenSpace: false,
    bEighteenSpace: false,
}


//************************************************Event Listeners********************************************

//Create event listeners on all the game pieces <Red, Black>
function setEventListener(){
    //if the turn property is true then initialize all the red pieces otherwise initialize all the black pieces when a piece is clicked
    if(turn){
        for(let i = 0; i < rPiece.lenght; i++){
            rPiece[i].addEventListener("click", playerPieceChecker);
        }
    }
    else{
        for(let i = 0; i < bPiece.lenght; i++){
            bPiece[i].addEventListener("click", playerPieceChecker);
        }
    }
}

//this function checks if the turn is true then the player's pieces will be red if not then it is black
function playerPieceChecker(){
    if(turn){
        playerPieces = rPiece
    }
    else{
        playerPieces = bPiece
    }
    removeSpaceClickable();
    resetBorders();
}

function removeCellClickable(){
    for(let i = 0; i < spaces.lenght; i++){
        spaces[i].removeAttribute("onClick")
    }
}

function resetBorders(){
    for(let i = 0; i < playerPieces.lenght; i++){
        playerPieces[i].style.border = "1px solid white"
    }
    resetProperties()
    getSelectedPiece()
}

function resetProperties(){
    selectedPiece.pieceId = -1, 
    selectedPiece.pieceLocation = -1,
    selectedPiece.KingStatus = false,
    selectedPiece.fSevenSpace = false,
    selectedPiece.fNineSpace = false,
    selectedPiece.fFourteenSpace = false,
    selectedPiece.fEighteenSpace = false,
    selectedPiece.bSevenSpace = false,
    selectedPiece.bNineSpace = false,
    selectedPiece.bFourteenSpace = false,
    selectedPiece.bEighteenSpace = false
}

function getSelectedPiece(){
    selectedPiece.pieceId = parseInt(event.target.id)
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId)
    kingChecker()
}

let findPiece = function(pieceId){
    let parsed = parseInt(pieceId)
    return gameBoard.indexOf(parsed)
}

//Check to see if the piece is a king
function kingChecker(){
    if(document.getElementById(selectedPiece.pieceId).classList.contains("king")){
        selectedPiece.KingStatus = true
    }
    else{
        selectedPiece.KingStatus = false;
    }
    getFreeSpaces();
}

function getFreeSpaces(){
    //ClassList reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    if(gameBoard[selectedPiece.indexOfBoardPiece + 7] === null && spaces[selectedPiece.indexOfBoardPiece + 7].classList.contains("nPiece") !== true){
        selectedPiece.fSevenSpace = true
    }
    if(gameBoard[selectedPiece.indexOfBoardPiece + 9] === null && spaces[selectedPiece.indexOfBoardPiece + 7].classList.contains("nPiece") !== true){
        selectedPiece.fNineSpace = true
    }
    if(gameBoard[selectedPiece.indexOfBoardPiece - 7] === null && spaces[selectedPiece.indexOfBoardPiece + 7].classList.contains("nPiece") !== true){
        selectedPiece.bSevenSpace = true
    }
    if(gameBoard[selectedPiece.indexOfBoardPiece - 9] === null && spaces[selectedPiece.indexOfBoardPiece + 7].classList.contains("nPiece") !== true){
        selectedPiece.bSevenSpace = true
    }

    checkFreeJump();
}

function checkFreeJump(){
    if(turn){
            //Red piece forward movement
            if(gameBoard[selectedPiece.indexOfBoardPiece + 14] === null && spaces[selectedPiece.indexOfBoardPiece + 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece + 7] >= 12 ){
                selectedPiece.fFourteenSpace = true
            }
            if(gameBoard[selectedPiece.indexOfBoardPiece + 18] === null && spaces[selectedPiece.indexOfBoardPiece + 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece + 9] >= 12 ){
                selectedPiece.fFourteenSpace = true
            }
            //Red piece back movement
            if(gameBoard[selectedPiece.indexOfBoardPiece - 14] === null && spaces[selectedPiece.indexOfBoardPiece - 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece - 7] >= 12 ){
                selectedPiece.fFourteenSpace = true
            }
            if(gameBoard[selectedPiece.indexOfBoardPiece - 18] === null && spaces[selectedPiece.indexOfBoardPiece - 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece - 9] >= 12 ){
                selectedPiece.fFourteenSpace = true
            }
    else{
            //Black piece forward movement
            if(gameBoard[selectedPiece.indexOfBoardPiece + 14] === null && spaces[selectedPiece.indexOfBoardPiece + 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece + 7] < 12 && gameBoard[selectedPiece.indexOfBoardPiece + 7] !== null){
                selectedPiece.fFourteenSpace = true
            }
            if(gameBoard[selectedPiece.indexOfBoardPiece + 18] === null && spaces[selectedPiece.indexOfBoardPiece + 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece + 9] < 12 && gameBoard[selectedPiece.indexOfBoardPiece + 9] !== null){
                selectedPiece.fFourteenSpace = true
            }
            //Black piece back movement
            if(gameBoard[selectedPiece.indexOfBoardPiece - 14] === null && spaces[selectedPiece.indexOfBoardPiece - 14].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece - 7] < 12 && gameBoard[selectedPiece.indexOfBoardPiece - 7] !== null){
                selectedPiece.fFourteenSpace = true
            }
            if(gameBoard[selectedPiece.indexOfBoardPiece - 18] === null && spaces[selectedPiece.indexOfBoardPiece - 18].classList.contains("nPiece") !== true
            && gameBoard[selectedPiece.indexOfBoardPiece - 9] < 12 && gameBoard[selectedPiece.indexOfBoardPiece - 9] !== null){
                selectedPiece.fFourteenSpace = true
            }
        }
        pieceCondition()
    }
}

function pieceCondition(){
    if(selectedPiece.KingStatus){
        givePieceMarker()
    }
    else{
        //Since the piece is not a king take away the backwards movement
        if(turn){
            //red piece
            selectedPiece.bEighteenSpace = false
            selectedPiece.bFourteenSpace = false
            selectedPiece.bNineSpace = false
            selectedPiece.bSevenSpace = false
        }
        else{
            //black piece
            selectedPiece.fEighteenSpace = false
            selectedPiece.fFourteenSpace = false
            selectedPiece.fNineSpace = false
            selectedPiece.fSevenSpace = false
        }
        givePieceMarker()
    }
}