import React, { useState, useEffect, useRef} from "react";
import { useParams, useSearchParams } from "react-router-dom"
import "./game.css";
import { io } from "socket.io-client"

const initialBoard = [
  ["R", "N", "B", "Q", "K", "B", "N", "R"], //0 indexes
  ["P", "P", "P", "P", "P", "P", "P", "P"], // 1
  [null, null, null, null, null, null, null, null], //2
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["r", "n", "b", "q", "k", "b", "n", "r"],
];

const pieceSymbols = {
  R: "♜",
  N: "♞",
  B: "♝",
  Q: "♛",
  K: "♚",
  P: "♟",
  r: "♖",
  n: "♘",
  b: "♗",
  q: "♕",
  k: "♔",
  p: "♙",
};

// 1, 2, 3, 4
// 1, 2, 3, 4
// 1, 2, 3, 4
// 1, 2, 3, 4
function Game() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("white");
  const [playerColor, setPlayerColor] = useState(null);
  const socketIO = useRef(null)

  // query params /game/sdkjhgfjadshg/somethingelse
  // search params /something?color=white&day=monday
  const params = useParams()
  const [searchParams] = useSearchParams()
  // socketIO.current 
  useEffect(()=>{
    
    socketIO.current = io(process.env.REACT_APP_BACKEND_URL+"/")
    
    socketIO.current.on("connect" , () => {
      console.log("Connected to the server");
      const color = searchParams.get("color")
      socketIO.current.emit("join", {id: params.game_id, color: color})
    });

    socketIO.current.on("board", (recieveBoard)=>{
      console.log(recieveBoard)
      if(recieveBoard !== null){
        setBoard(recieveBoard.board)
        setCurrentTurn(recieveBoard.currentTurn)
      }
    })

    socketIO.current.on("color", (color)=>{
      console.log(color)
      if(color !== null){
        setPlayerColor(color);
      }
    })

    socketIO.current.on("move", (recieveBoard)=>{
      console.log(recieveBoard)
      if(recieveBoard !== null){
        setBoard(recieveBoard.board)
        setCurrentTurn(recieveBoard.currentTurn)
      }
    })

    socketIO.current.on("disconnect", () => {
      console.log("Disconnected from the server");
    });
  }, [])

  // /game/r1344 - path parameters

  const handleCellClick = (row, cell) => {
    if(currentTurn !== playerColor){
      return;
    }
    const piece = board[row][cell];

    // a -> A, A->A
    // A === A black piece, a !== A white piece
    const pieceColor =
      (piece != null) ? (piece.toUpperCase() === piece ? "black" : "white") : null; // empty cell -> white

    if (selectedPiece != null) {
      if (pieceColor === currentTurn ) {
        setSelectedPiece([row, cell]);
      } // move piece only if this block did not work
      else {
        movePiece(row, cell);
      }
    }
    // piece is not null (non empty), color of a piece is the same as current turn
    else if (piece != null && pieceColor === currentTurn) {
      // selectedPiece = [row, cell]
      setSelectedPiece([row, cell]);
    }
  };

  const movePiece = (row, cell) => {
    // [row, cell] - selected piece
    //  0    1
    // [3,   4]
    const selectedRow = selectedPiece[0];
    const selectedCell = selectedPiece[1];
    const piece = board[selectedRow][selectedCell];// board[3][4]

    if(piece.toUpperCase() == 'R'){
        if(row == selectedRow){
            for(let i = Math.min(selectedCell, cell) + 1; i < Math.max(selectedCell, cell); i++){
              if(board[selectedRow][i] != null)
                return;
            } 
        }
        else if (cell === selectedCell){
            for( let i = Math.min(selectedRow, row) +1; i < Math.max(selectedRow, row); i++){ 
              if(board[i][selectedCell] != null)
                return;
          }
        }
        else{
          return;
        }
    }
      
    if (piece.toUpperCase() == 'B')
      if(row - cell == selectedRow - selectedCell){
        for(let i = 1; Math.min(row, selectedRow) + i < Math.max(row, selectedRow); i++){
          if(board[Math.min(row, selectedRow) + i][Math.min(cell, selectedCell) + i] != null)
            return;
        }
      }
      else if(row + cell == selectedRow + selectedCell){
        for(let i = 1; Math.max(row, selectedRow) - i > Math.min(row, selectedRow); i++){
          if(board[Math.max(row, selectedRow) - i][Math.min(cell, selectedCell) + i] != null)
            return;
        }
      }
      else{
        return;
      }
      
      
    
    if (piece.toUpperCase() == 'N')
      if((Math.abs(row - selectedRow) !=2  || Math.abs(cell - selectedCell)!=1) &&
     (Math.abs(row - selectedRow) !=1 || Math.abs(cell - selectedCell) != 2))
        return;
        
    if (piece.toUpperCase() == 'Q')
      if(row == selectedRow){
        for(let i = Math.min(selectedCell, cell) + 1; i < Math.max(selectedCell, cell); i++){
          if(board[selectedRow][i] != null)
            return;
        } 
      }
      else if (cell === selectedCell){
          for( let i = Math.min(selectedRow, row) +1; i < Math.max(selectedRow, row); i++){ 
            if(board[i][selectedCell] != null)
              return;
        }
      }
      else if(row - cell == selectedRow - selectedCell){
        for(let i = 1; Math.min(row, selectedRow) + i < Math.max(row, selectedRow); i++){
          if(board[Math.min(row, selectedRow) + i][Math.min(cell, selectedCell) + i] != null)
            return;
        }
      }
      else if(row + cell == selectedRow + selectedCell){
        for(let i = 1; Math.max(row, selectedRow) - i > Math.min(row, selectedRow); i++){
          if(board[Math.max(row, selectedRow) - i][Math.min(cell, selectedCell) + i] != null)
            return;
        }
      }
      else{
        return;
      }
      
    if (piece.toUpperCase() == 'K') // Math.abs 2 - 1 == 1 - 2
      if(Math.abs(row - selectedRow) >= 2  || Math.abs(cell - selectedCell) >=2)
      //check that there is no green dot
        return;

    if ( piece.toUpperCase() == 'P'){
     
      const checkingColor = ( currentTurn === "white" ? -1 : 1)
      
      if(row - checkingColor === selectedRow){
        if(
          !(board[row][cell] == null && cell == selectedCell) &&
          !(board[row][cell] != null && Math.abs(cell - selectedCell) == 1)){
          console.log(123)
          return
        }
      }
      else if(selectedRow == 6 && currentTurn == "white"){
        if(!(row == 4 && cell == selectedCell && board[row][cell] == null && board[row+1][cell] == null))
          return
      }
      else if(selectedRow == 1 && currentTurn == "black"){
        if(!(row == 3 && cell == selectedCell && board[row][cell] == null && board[row-1][cell] == null))
          return
      }

      else{
        console.log(321)
        return
      }
    }
      // var == 1 if color is white and -1 if black
      

    const copyBoard = [...board]; // ... - takes elements, [] - creates new array
    
    // step 1 - remove piece from old position, step 2 - put piece in new position
    copyBoard[row][cell] = piece
    copyBoard[selectedRow][selectedCell] = null;
    
    setBoard(copyBoard) // board = copyBoard
    
    //delete a selection
    setSelectedPiece(null);
    
    const newCurrentTurn = currentTurn === "black" ? "white" :  "black";
    
    const data = {
      board: copyBoard,
      currentTurn: newCurrentTurn,
    }
    // copyBoard is sent. recieavedBoard = copyBoard
    // when recieve we do board = recieavedBoard, it is the same as board = copyBoard

    // now we send data object that has field copyBoard
    // when recieave board = data, now we need to extract copyBoard from data
    
    // send to server
    socketIO.current.emit("move", data)

    setCurrentTurn(newCurrentTurn)
    
  };

  return (
    <div>
    <div className="chessboard-container">
      {board.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            //                                     setSelectedPiece([row, cell]);          [5, 6]
            className={`cell-piece ${
              selectedPiece !== null &&
              cellIndex == selectedPiece[1] &&
              rowIndex == selectedPiece[0]
                ? "selected"
                : ""
            }`}
            key={`${rowIndex}-${cellIndex}`}
            style={{ gridRow: rowIndex + 1, gridColumn: cellIndex + 1 }}
            onClick={() => handleCellClick(rowIndex, cellIndex)}
          >
            {/* <div
            className={`move-piece ${piece === selectedPiece && onClick={()=> handleCellClick(rowIndex, cellIndex)} ? movePiece : ''}`}
            > */}

            {cell === null ? null : (
              <span className="piece" style={{ color: "black" }}>
                {pieceSymbols[cell]}
              </span>
            )}
            {/*expression ? works if true       :  works if false*/}
          </div>
        ))
      )}
    </div>
    {/*"" - false, null - false, 0 - false, undefinied - false. any non empty str - True */}
    {playerColor ? <span>You color is {playerColor}</span> : <span>You are a spectator</span>}
    
    </div>
  );
}

export default Game;
