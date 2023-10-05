// Utility functions for Sudoku board generation and validation

export const shuffle = (array) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  export const safeToPlace = (puzzleArray, emptyCell, num, rowSafe, colSafe, boxSafe) => {
    return (
      rowSafe(puzzleArray, emptyCell, num) &&
      colSafe(puzzleArray, emptyCell, num) &&
      boxSafe(puzzleArray, emptyCell, num)
    );
  };
  
  export const rowSafe = (puzzleArray, emptyCell, num) => {
    return !puzzleArray[emptyCell.rowIndex].includes(num);
  };
  
  export const colSafe = (puzzleArray, emptyCell, num) => {
    return !puzzleArray.some((row) => row[emptyCell.colIndex] === num);
  };
  
  export const boxSafe = (puzzleArray, emptyCell, num) => {
    let boxStartRow = Math.floor(emptyCell.rowIndex / 3) * 3;
    let boxStartCol = Math.floor(emptyCell.colIndex / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleArray[boxStartRow + i][boxStartCol + j] === num) {
          return false;
        }
      }
    }
    return true;
  };
  
  export const nextEmptyCell = (puzzleArray) => {
    // ... (same code)
  };
  
  export const fillPuzzle = (startingBoard, numArray, counter) => {
    // ... (same code, but use the arguments instead of 'this.state')
  };
  
  export const pokeHoles = (fb, holes, countSolutions) => {
    // ... (same code, but use the arguments instead of 'this.state')
  };
  
  export const countSolutions = (board, count, isValid) => {
    // ... (same code, but use the arguments instead of 'this.state')
  };
  
  export const isValid = (board, row, col, num) => {
    // ... (same code)
  };
  
  // Add more utility functions here
  