// Utility functions for Sudoku board generation and validation

export const initBoard = (blankBoard) => {
  const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let counter = 0;
  return fillPuzzle(blankBoard, numArray, counter);
};

export const shuffle = (array) => {
  // console.log("shuffle: About to spread this variable: ", array);

  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const safeToPlace = (puzzleArray, emptyCell, num) => {
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
  // console.log("nextEmptyCell: puzzleArray: ", puzzleArray);
  const emptyCell = { rowIndex: -1, colIndex: -1 };
  puzzleArray.forEach((row, rowIndex) => {
    if (emptyCell.colIndex !== -1) return;

    let firstZero = row.indexOf(0);
    if (firstZero !== -1) {
      emptyCell.rowIndex = rowIndex;
      emptyCell.colIndex = firstZero;
    }
  });
  return emptyCell.rowIndex === -1 ? null : emptyCell;
};

export const fillPuzzle = (startingBoard, numArray, counter) => {
  const emptyCell = nextEmptyCell(startingBoard);
  if (!emptyCell) {
    return startingBoard;
  }
  for (const num of shuffle(numArray)) {
    counter++;
    if (counter > 20_000_000) throw new Error("Recursion Timeout");

    if (safeToPlace(startingBoard, emptyCell, num)) {
      const newBoard = startingBoard.map((row) => [...row]);
      newBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;

      const result = fillPuzzle(newBoard, numArray, counter);
      if (result) {
        return result;
      }
    }
  }
  return false;
};

export const isRowComplete = (board, rowIndex) => {
  const row = board[rowIndex];
  return new Set(row.filter((cell) => cell !== 0)).size === 9;
};

export const isColComplete = (board, colIndex) => {
  const col = board.map((row) => row[colIndex]);
  return new Set(col.filter((cell) => cell !== 0)).size === 9;
};

export const isSingleGridComplete = (board, gridRowStart, gridColStart) => {
  const grid = [];
  for (let row = gridRowStart; row < gridRowStart + 3; row++) {
    for (let col = gridColStart; col < gridColStart + 3; col++) {
      grid.push(board[row][col]);
    }
  }
  return new Set(grid.filter((cell) => cell !== 0)).size === 9;
};

export const isGridComplete = (board) => {
  for (let gridRow = 0; gridRow < 9; gridRow += 3) {
    for (let gridCol = 0; gridCol < 9; gridCol += 3) {
      const grid = [];
      for (let row = gridRow; row < gridRow + 3; row++) {
        for (let col = gridCol; col < gridCol + 3; col++) {
          grid.push(board[row][col]);
        }
      }
      if (new Set(grid.filter((cell) => cell !== 0)).size !== 9) {
        return false;
      }
    }
  }
  return true;
};

export const pokeHoles = (fb, holes) => {
  try {
    if (!Array.isArray(fb) || fb.length !== 9 || typeof holes !== "number") {
      console.error("Invalid arguments");
      return;
    }
    console.log("Debug: fb in pokeHoles:", fb);
    console.log("Debug: holes in pokeHoles:", holes);

    const board = fb.map((row) => [...row]); // Deep copy
    let pokedHoles = 0;

    while (pokedHoles < holes) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (board[row][col] !== 0) {
        const temp = board[row][col];
        board[row][col] = 0;

        if (
          countSolutions(
            board.map((row) => [...row]),
            0
          ) === 1
        ) {
          // Deep copy
          pokedHoles++;
        } else {
          board[row][col] = temp;
        }
      }
    }

    // console.log("poke holes: board: ", board);
    return board;
  } catch (error) {
    console.error("poke holes: An error occurred:", error);
  }
};

export const countSolutions = (board, count) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            count = countSolutions(board, count);
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

export const validateUserInput = (row, col, num, board, listOfSolutions) => {
  if (!listOfSolutions) {
    console.warn("validateuserinput: listOfSolutions is not yet initialized.");
    return false;
  }

  let validSolutions = {};
  for (const [key, solution] of Object.entries(listOfSolutions)) {
    if (solution[row][col] === num) {
      validSolutions[key] = solution;
    }
  }

  if (Object.keys(validSolutions).length === 0) {
    return false;
  } else {
    return true;
  }
};

export const findAllSolutions = (board, solutions = {}, counter = 0) => {
  // console.log("findAllSolutionsboard: ", board);
  const emptyCell = nextEmptyCell(board);
  if (!emptyCell) {
    const solutionKey = JSON.stringify(board);
    solutions[solutionKey] = JSON.parse(JSON.stringify(board)); // Deep copy
    return;
  }

  for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    counter++;
    if (counter > 20_000_000) throw new Error("Recursion Timeout");

    if (safeToPlace(board, emptyCell, num)) {
      const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy
      newBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;
      // console.log("findAllSolutions: newBoard: ", newBoard);
      findAllSolutions(newBoard, solutions, counter);
    }
  }
};
