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
    const emptyCell = { rowIndex: "", colIndex: "" };

    puzzleArray.forEach((row, rowIndex) => {
      // If this key has already been assigned, skip iteration
      if (emptyCell.colIndex !== "") return;

      // find first zero-element
      let firstZero = row.find((col) => col === 0);

      // if no zero present, skip to next row
      if (firstZero === undefined) return;
      emptyCell.rowIndex = rowIndex;
      emptyCell.colIndex = row.indexOf(firstZero);
    })};
  
    export const fillPuzzle = (startingBoard, numArray, counter) => {
        const emptyCell = nextEmptyCell(startingBoard);
      
        if (!emptyCell) {
          return startingBoard;
        }
      
        for (const num of shuffle(numArray)) {
          counter++;
          if (counter > 20_000_000) throw new Error("Recursion Timeout");
      
          if (safeToPlace(startingBoard, emptyCell, num, rowSafe, colSafe, boxSafe)) {
            startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;
      
            if (fillPuzzle(startingBoard, numArray, counter)) {
              return startingBoard;
            }
      
            startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
          }
        }
        return false;
      };
  
  export const pokeHoles = (fb, holes) => {
    // Make sure filledBoard is valid before deep cloning
    // if (!fb || !Array.isArray(fb) || fb.length !== 9) {
    //   console.error("Invalid fb");
    //   return;
    // }
  
    try {
      console.log("fb: ", fb);
      console.log("holes: ", holes)
      const board = JSON.parse(JSON.stringify(fb));
      let pokedHoles = 0;
  
      while (pokedHoles < holes) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
  
        if (board[row][col] !== 0) {
          const temp = board[row][col];
          board[row][col] = 0;
  
          if (this.countSolutions(JSON.parse(JSON.stringify(board)), 0) === 1) {
            pokedHoles++;
          } else {
            board[row][col] = temp;
          }
        }
      }
  
      console.log("board: ", board)
      this.setState({ board });
      return board;
  
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  export const countSolutions = (board, count) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              count = this.countSolutions(board, count);
              board[row][col] = 0;
            }
          }
          return count;
        }
      }
    }
    return count + 1;
  };
  
  export const isValid = (board, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (
        board[row][x] === num ||
        board[x][col] === num ||
        board[3 * Math.floor(row / 3) + Math.floor(x / 3)][
          3 * Math.floor(col / 3) + (x % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  };
  
  // Add more utility functions here
  